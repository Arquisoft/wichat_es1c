import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Usamos useNavigate para la navegación
import Chatbot from './Chatbot';

const endpoint = "http://localhost:8000";

const Game = () => {
    const [selected, setSelected] = useState('');
    const [result, setResult] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswerAnimation, setCorrectAnswerAnimation] = useState(false); // Estado para la animación de respuesta correcta
    const [incorrectAnswer, setIncorrectAnswer] = useState(''); // Estado para la respuesta incorrecta
    const [correctAnswer, setCorrectAnswer] = useState(''); // Estado para la respuesta correcta
    const navigate = useNavigate(); // Usamos useNavigate para la navegación

    useEffect(() => {
        // Cargar preguntas desde localStorage o hacer solicitud si no están disponibles
        const storedQuestions = localStorage.getItem("questions");
        if (storedQuestions) {
            setQuestions(JSON.parse(storedQuestions));
        } else {
            generateQuestions((newQuestions) => {
                setQuestions(newQuestions);
                localStorage.setItem("questions", JSON.stringify(newQuestions)); // Guardar en localStorage
            });
        }
    }, []);

    const generateQuestions = async (setQuestions) => {
        axios.get(endpoint + '/api/generate-questions', {
            withCredentials: true  // 🔥 Importante para enviar cookies o credenciales
        })
            .then((response) => {
                const formattedQuestions = response.data.map(data => {
                    const [title, imageUrl] = data.title.split("|");
                    const answers = data.allAnswers.split(",");
                    return {
                        title,
                        image: imageUrl,
                        correctAnswer: data.correctAnswer,
                        options: answers
                    };
                });
                setQuestions(formattedQuestions);
            })
            .catch((error) => console.error("Error al obtener preguntas", error));
    };

    useEffect(() => {
        // Precargar la imagen de la siguiente pregunta (si existe)
        if (questions.length > currentQuestionIndex + 1) {
            const img = new Image();
            img.src = questions[currentQuestionIndex + 1].image;
        }
    }, [currentQuestionIndex, questions]);

    if (questions.length === 0) {
        return <Typography variant="h6" style={{ textAlign: "center", marginTop: "20px" }}>Cargando preguntas...</Typography>;
    }

    const question = questions[currentQuestionIndex];

    const saveScore = async (finalScore) => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token del localStorage
            
            if (!token) {
                console.error("No se encontró el token");
                return;
            }

            const wrong = 10 - finalScore

            const response = await axios.post(
                `${endpoint}/api/save-score`,
                {correct: finalScore, wrong: wrong},
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Enviar el token JWT en el encabezado
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 200) {
                console.log("Puntuación guardada correctamente:", response.data);
            }
        } catch (error) {
            console.error("Error al guardar la puntuación:", error);
        }
    }

    const handleSelect = (option) => {
        setSelected(option);
        const isCorrect = option === question.correctAnswer;
        setResult(isCorrect ? "¡Correcto!" : "Incorrecto.");
        if (isCorrect) {
            setScore(score + 1);
            setCorrectAnswerAnimation(true); // Activamos la animación al responder correctamente
            setCorrectAnswer(option); // Guardamos la respuesta correcta
            setIncorrectAnswer(''); // Aseguramos que la incorrecta no se mantenga marcada
        } else {
            setIncorrectAnswer(option); // Si es incorrecto, guardamos la respuesta equivocada
            setCorrectAnswer(question.correctAnswer); // Y mostramos la respuesta correcta
        }

        // Precargamos la siguiente pregunta antes de pasar a ella
        if (questions.length > currentQuestionIndex + 1) {
            const nextQuestion = questions[currentQuestionIndex + 1];
            const img = new Image();
            img.src = nextQuestion.image; // Precargamos la imagen de la siguiente pregunta
        }

        // Cambiar la pregunta después de 3 segundos, durante los cuales precargamos la siguiente pregunta
        setTimeout(() => {
            setSelected('');
            setResult('');
            setCorrectAnswerAnimation(false); // Desactivamos la animación
            setIncorrectAnswer(''); // Limpiamos la respuesta incorrecta
            setCorrectAnswer(''); // Limpiamos la respuesta correcta
            setCurrentQuestionIndex(prevIndex => prevIndex + 1); // Avanzamos a la siguiente pregunta
            if (currentQuestionIndex < questions.length) {
                const finalScore = score + (option === question.correctAnswer ? 1 : 0);
                alert(`Juego terminado. Puntuación final: ${finalScore}/10`);
                saveScore(finalScore)
            } 
        }, 3000); // Tiempo de espera de 3 segundos
    };

    const handleGoHome = () => {
        navigate('/home'); // Navega a la página de inicio cuando se haga clic en el botón
    };

    return (
        <Container maxWidth="xs" style={{ marginTop: "20px", textAlign: "center" }}>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>{question.title}</Typography>
            <img
                src={question.image}
                srcSet={`${question.image}?w=300 300w, ${question.image}?w=600 600w`} // Usamos srcSet para imágenes optimizadas
                alt={question.title}
                style={{ width: "100%", height: "200px" }}
            />
            <Typography variant="h6" style={{ marginTop: "10px" }}>Selecciona la respuesta correcta:</Typography>
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: "10px" }}>
                {question.options.map((option, index) => (
                    <Grid item xs={6} key={index}>
                        <Button
                            variant="contained"
                            fullWidth
                            color={selected === option ? "secondary" : "primary"}
                            style={{
                                backgroundColor:
                                    option === correctAnswer ? '#4caf50' : // Verde para la correcta
                                    option === incorrectAnswer ? '#f44336' : // Rojo para la incorrecta
                                    '', // Sin color si no ha sido seleccionada
                            }}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            {result && (
                <Typography
                    variant="h6"
                    style={{
                        marginTop: "15px",
                        animation: correctAnswerAnimation ? "correctAnswerAnim 0.5s ease" : "none", // Aplicamos la animación al resultado
                        fontWeight: "bold",
                        color: correctAnswerAnimation ? "#4caf50" : "black" // Cambiamos el color si la respuesta es correcta
                    }}
                >
                    {result}
                </Typography>
            )}

            {/* Botón para ir a la página de inicio con más formato y animación */}
            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: "40px", // Aumentamos el margen para que esté más abajo
                    padding: "12px 24px", // Aumentamos el tamaño del botón
                    borderRadius: "8px", // Redondeamos los bordes
                    fontSize: "16px", // Cambiamos el tamaño de la fuente
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Agregamos sombra
                    textTransform: "none", // Evitamos que el texto se convierta en mayúsculas
                    transition: "transform 0.3s ease, background-color 0.3s ease", // Transición suave
                }}
                onClick={handleGoHome}
                onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)"; // Aumenta el tamaño del botón al pasar el ratón
                    e.target.style.backgroundColor = "#3b82f6"; // Cambia el color de fondo
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; // Restaura el tamaño original al salir el ratón
                    e.target.style.backgroundColor = "#1976d2"; // Restaura el color original
                }}
            >
                Volver a Inicio
            </Button>

            {/* Aquí agregamos el componente de Chatbot */}
            <Chatbot />
        </Container>
    );
};

export default Game;
