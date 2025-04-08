import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot';
import Timer from './Timer';
import GameOptions from './GameOptions'; // Importar el nuevo componente
import '../Game.css';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Game = () => {
    const [showOptions, setShowOptions] = useState(true); // Estado para mostrar las opciones
    const [questionType, setQuestionType] = useState('Geografía'); // Tipo de preguntas
    const [responseTime, setResponseTime] = useState(60); // Tiempo máximo de respuesta

    const [selected, setSelected] = useState('');
    const [result, setResult] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswerAnimation, setCorrectAnswerAnimation] = useState(false);
    const [incorrectAnswer, setIncorrectAnswer] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [timerKey, setTimerKey] = useState(0);
    const [questionsTitles, setQuestionsTitles] = useState('');
    const [correctAnswers, setCorrectAnswers] = useState('');
    const [givenAnswers, setGivenAnswers] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!showOptions) {
            const fetchQuestions = async () => {
                try {
                    const response = await axios.get(`${endpoint}/api/generate-questions`, {
                        params: { type: questionType },
                        withCredentials: true  
                    });
                    
                    if (response.data.length === 0) {
                        console.error("No se recibieron preguntas del servidor.");
                        return;
                    }

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
                    setStartTime(Date.now()); // Registrar el tiempo de inicio
                } catch (error) {
                    console.error("Error al obtener preguntas", error);
                }
            };

            fetchQuestions();
        }
    }, [showOptions, questionType]);

    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length - 1) {
            const img = new Image();
            img.src = questions[currentQuestionIndex + 1].image;
        }
    }, [currentQuestionIndex, questions]);

    if (showOptions) {
        return (
            <GameOptions
                questionType={questionType}
                setQuestionType={setQuestionType}
                responseTime={responseTime}
                setResponseTime={setResponseTime}
                onStartGame={() => setShowOptions(false)}
            />
        );
    }

    if (questions.length === 0) {
        return (
            <Typography
                component="h1"
                variant="h5"
                align="center"
                sx={{
                    mt: 2,
                    color: 'white',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: '900',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), -1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)',
                    width: '100%',
                    letterSpacing: '0.5px',
                    wordBreak: 'break-word',
                }}
            >
                Cargando preguntas...
            </Typography>
        );
    }

    // ✅ Verificar que el índice es válido antes de acceder a `questions[currentQuestionIndex]`
    if (currentQuestionIndex >= questions.length) {
        return (
            <Container
                maxWidth="xs"
                style={{
                    marginTop: "20px",
                    textAlign: "center",
                    backgroundColor: "#f9f9f9", // Fondo de color claro
                    borderRadius: "16px", // Bordes redondeados
                    padding: "20px", // Espaciado interno
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", // Sombra para dar profundidad
                    width: "300px", // Ancho fijo más estrecho
                    height: "145px", // Altura fija más compacta
                }}
                >
                <Typography variant="h6">¡Juego terminado!</Typography>
                <Typography variant="h5">Puntuación: {score}</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/home')}
                >
                    Volver a Inicio
                </Button>
            </Container>
        );
    }

    const question = questions[currentQuestionIndex];

    const saveScore = async (finalScore, finalTime) => {
        try {
            const token = localStorage.getItem('token'); // Obtener el token del localStorage
            
            if (!token) {
                console.error("No se encontró el token");
                return;
            }

            // Verificar que los valores no estén vacíos
            if (!questionsTitles || !correctAnswers || !givenAnswers) {
                console.error("Faltan datos para guardar la puntuación");
                return;
            }

            const wrong = 10 - finalScore;
            const correct = finalScore;

            const response = await axios.post(
                `${endpoint}/api/save-score`,
                { 
                    correct: correct, 
                    wrong: wrong, 
                    totalTime: finalTime, 
                    question: questionsTitles, 
                    correctAnswer: correctAnswers, 
                    givenAnswer: givenAnswers 
                },
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
    };

    const handleSelect = (option) => {
        setSelected(option);
        const isCorrect = option === question.correctAnswer;
        setResult(isCorrect ? "¡Correcto!" : "Incorrecto.");

        setQuestionsTitles((prev) => prev ? `${prev}¬${question.title}` : question.title);
        setCorrectAnswers((prev) => prev ? `${prev}¬${question.correctAnswer}` : question.correctAnswer);
        setGivenAnswers((prev) => prev ? `${prev}¬${option}` : option);

        const correctSound = new Audio(process.env.PUBLIC_URL + "/sounds/correct_answer.mp3");
        const wrongSound = new Audio(process.env.PUBLIC_URL + "/sounds/wrong_answer.mp3");

        if (isCorrect) {
            correctSound.play();
            setScore(prevScore => prevScore + 1);
            setCorrectAnswerAnimation(true);
            setCorrectAnswer(option);
            setIncorrectAnswer('');
        } else {
            wrongSound.play();
            setIncorrectAnswer(option);
            setCorrectAnswer(question.correctAnswer);
        }

        setTimeout(() => {
            setSelected('');
            setResult('');
            setCorrectAnswerAnimation(false);
            setIncorrectAnswer('');
            setCorrectAnswer('');
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setTimerKey(prevKey => prevKey + 1);

            if (currentQuestionIndex >= questions.length - 1) {
                const finalScore = score + (option === question.correctAnswer ? 1 : 0);
                const endTime = Date.now();
                const finalTime = (endTime - startTime) / 1000;
                saveScore(finalScore, finalTime);
            }
        }, 1750);
    };

    const handleGoHome = () => {
        navigate('/home');
    };

    const handleTimeOut = () => {
        setTimeout(() => {
            setSelected('');
            setResult('');
            setCorrectAnswerAnimation(false);
            setIncorrectAnswer('');
            setCorrectAnswer('');
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setTimerKey(prevKey => prevKey + 1);

            if (currentQuestionIndex >= questions.length - 1) {
                const endTime = Date.now();
                const finalTime = (endTime - startTime) / 1000; // Tiempo total en segundos
                console.log(`Tiempo total: ${finalTime} segundos`);
                saveScore(score, finalTime);
            }
        }, 1750);
    };

    return (
        <Container maxWidth="xs" className="game-container" style={{ marginTop: "20px", textAlign: "center" }}>
            <Timer key={timerKey} onTimeOut={handleTimeOut} duration={responseTime} />

            {/* Contador de preguntas */}
            <Typography
                variant="h6"
                style={{
                    marginBottom: "10px",
                    fontWeight: "bold",
                    color: "#1976d2",
                }}
            >
                Pregunta {currentQuestionIndex + 1} de {questions.length}
            </Typography>

            <Typography variant="h5" style={{ marginBottom: "10px" }}>{question.title}</Typography>
            <img
                src={question.image}
                srcSet={`${question.image}?w=300 300w, ${question.image}?w=600 600w`}
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
                            className="game-button"
                            style={{
                                backgroundColor:
                                    option === correctAnswer ? '#4caf50' :
                                    option === incorrectAnswer ? '#f44336' : '',
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
                        animation: correctAnswerAnimation ? "correctAnswerAnim 0.5s ease" : "none",
                        fontWeight: "bold",
                        color: correctAnswerAnimation ? "#4caf50" : "black"
                    }}
                >
                    {result}
                </Typography>
            )}

            <Button
                variant="contained"
                className="back-home-button"
                style={{
                    marginTop: "40px",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    backgroundColor: "#f44336", // Rojo inicial
                    color: "#fff", // Texto blanco
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    textTransform: "none",
                    transition: "transform 0.3s ease, background-color 0.3s ease",
                }}
                onClick={handleGoHome}
                onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)";
                    e.target.style.backgroundColor = "#e53935"; // Rojo más oscuro al pasar el cursor
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.backgroundColor = "#f44336"; // Rojo inicial
                }}
            >
                Volver a Inicio
            </Button>

            <Chatbot currentAnswer={question.correctAnswer} />
        </Container>
    );
};

export default Game;