import React from 'react';
import { Container, Typography } from '@mui/material';
import Chatbot from './Chatbot'; // Importamos el componente del chatbot flotante
import OptionsDropdown from './OptionsDropdown'; // Importamos el componente del chatbot flotante

const Home = () => {
  return (
    <Container component="main" maxWidth="md">
      <Typography
                         component="h1"
                         variant="h3"
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
        Bienvenido a WiChat_es1c
      </Typography>

      {/* Se muestra el componente OptionsDropdown */}
      <OptionsDropdown />

      {/* Se muestra el chatbot flotante en la esquina inferior derecha */}
      <Chatbot />
    </Container>
  );
};

export default Home;
