import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
    const navigate = useNavigate(); // hook para la navegación

    const faqs = [
        {
            question: "¿Cómo jugar al juego?",
            answer: "Solo selecciona la respuesta correcta a cada pregunta y acumula puntos por cada acierto.",
        },
        {
            question: "¿Puedo jugar más de una vez?",
            answer: "Sí, puedes volver a jugar cuantas veces quieras.",
        },
        {
            question: "¿Cómo sé si he respondido correctamente?",
            answer: "Verás un mensaje que indica si tu respuesta fue correcta o incorrecta.",
        },
        {
            question: "¿Dónde puedo ver mis puntuaciones?",
            answer: "La puntuación se muestra al final de cada ronda.",
        },
        {
            question: "¿El juego es gratuito?",
            answer: "Sí, el juego es completamente gratuito.",
        },
        {
            question: "¿Puedo cambiar mi respuesta después de seleccionarla?",
            answer: "No, una vez que seleccionas una respuesta, no puedes cambiarla.",
        },
        {
            question: "¿Qué sucede cuando termino el juego?",
            answer: "Al terminar el juego, verás tu puntuación final y tendrás la opción de volver a jugar.",
        },
    ];

    const handleGoHome = () => {
        navigate('/home'); // Navegar a la página de inicio
    };

    return (
        <Container maxWidth="md" className="faq-container" style={{ marginTop: "30px", textAlign: "center" }}>
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
                 >Preguntas Frecuentes</Typography>
            {faqs.map((faq, index) => (
                <Accordion key={index} style={{ marginBottom: "10px" }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${index}a-content`}
                        id={`panel${index}a-header`}
                    >
                        <Typography variant="h6">{faq.question}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{faq.answer}</Typography>
                    </AccordionDetails>
                </Accordion>
            ))}
            {/* Botón para volver a la página de inicio */}
            <Button
                variant="contained"
                color="primary"
                style={{
                    marginTop: "20px", 
                    padding: "12px 24px", 
                    borderRadius: "8px", 
                    fontSize: "16px", 
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", 
                    textTransform: "none", 
                    transition: "transform 0.3s ease, background-color 0.3s ease",
                }}
                onClick={handleGoHome}
                onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.1)"; 
                    e.target.style.backgroundColor = "#3b82f6"; 
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)"; 
                    e.target.style.backgroundColor = "#1976d2"; 
                }}
            >
                Volver a Inicio
            </Button>
        </Container>
    );
};

export default FAQ;
