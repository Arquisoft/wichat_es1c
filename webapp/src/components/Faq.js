import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Container, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import OptionsDropdown from './OptionsDropdown';

const FAQ = () => {
    const navigate = useNavigate(); // hook para la navegación
    const [expanded, setExpanded] = useState(false); // Estado para controlar la pregunta expandida

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
            question: "¿Dónde puedo ver mi puntuacion?",
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

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false); // Si se expande un panel, actualizar el estado
    };

    return (
        <>
            <OptionsDropdown />  
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
                <Accordion
                    key={index}
                    expanded={expanded === `panel${index}`} // Se despliega solo el panel seleccionado
                    onChange={handleChange(`panel${index}`)} // Cambiar el estado cuando se expande o colapsa
                    style={{ marginBottom: "10px" }}
                >
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
            <button onClick={handleGoHome}>Home</button>
        </Container>
        </>
    );
};

export default FAQ;
