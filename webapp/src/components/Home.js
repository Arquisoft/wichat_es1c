import React from 'react';
import { Container, Typography } from '@mui/material';
import Chatbot from './Chatbot'; // Importamos el componente del chatbot flotante

const Home = () => {
  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Bienvenido a WiChat
      </Typography>

      {/* Se muestra el chatbot flotante en la esquina inferior derecha */}
      <Chatbot />
    </Container>
  );
};

export default Home;
