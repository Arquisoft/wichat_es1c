import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button} from '@mui/material';

const endpoint = "http://localhost:8000"

const Game = () => {
    const [selected, setSelected] = useState('');
    const [result, setResult] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        generateQuestions(setQuestions);
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
    }

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
        setResult(option === question.correctAnswer ? "¡Correcto!" : "Incorrecto, intenta de nuevo.");
        if (option === question.correctAnswer) {
            setScore(score + 1);
        }
        setTimeout(() => {
            setSelected('');
            setResult('');
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                const finalScore = score + (option === question.correctAnswer ? 1 : 0);
                alert(`Juego terminado. Puntuación final: ${finalScore}/10`);
                saveScore(finalScore)
            }
        }, 1500);
    };

    return (
        <Container maxWidth="xs" style={{marginTop: "20px", textAlign: "center"}}>
            <Typography variant="h5" style={{ marginBottom: "10px" }}>{question.title}</Typography>
            <img src={question.image} alt={question.title} style={{ width: "100%", height: "200px" }} />
            <Typography variant="h6" style={{ marginTop: "10px" }}>Selecciona la respuesta correcta:</Typography>
            <Grid container spacing={2} justifyContent="center" style={{ marginTop: "10px" }}>
                {question.options.map((option, index) => (
                    <Grid item xs={6} key={index}>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            color={selected === option ? "secondary" : "primary"}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </Button>
                    </Grid>
                ))}
            </Grid>
            {result && <Typography variant="h6" style={{ marginTop: "15px" }}>{result}</Typography>}
        </Container>
    );
};

export default Game;