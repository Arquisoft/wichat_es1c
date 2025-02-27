import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button} from '@mui/material';

const endpoint = "http://localhost:8000"

const Game = () => {
    const [selected, setSelected] = useState('')
    const [result, setResult] = useState('')
    const [question, setQuestion] = useState(null)

    const getQuestion = async (setQuestion) => {
        axios.get(endpoint + '/generate-question')
        .then((response) => {
            const data = response.data;
            const [title, imageUrl] = data.title.split("|");
            const answers = data.allAnswers.split(",")
            setQuestion({
                title,
                image: imageUrl,
                correct: data.correctAnswer,
                options: answers
            });
          })
        .catch((error) => console.error("Error al realizar la petición", error))
    }

    useEffect(() => {
        getQuestion(setQuestion)
    }, [])

    const handleSelect = (option) => {
        setSelected(option);
        setResult(option === question.correct ? "¡Correcto!" : "Incorrecto, intenta de nuevo.");
    };

    if (!question) {
        return <Typography variant="h6" style={{ textAlign: "center", marginTop: "20px" }}>Cargando pregunta...</Typography>;
      }

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