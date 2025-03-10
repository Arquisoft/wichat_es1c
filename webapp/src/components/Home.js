import React from 'react';
import { Container, Typography } from '@mui/material';
import Chatbot from './Chatbot'; // Importamos el componente del chatbot flotante
import OptionsDropdown from './OptionsDropdown'; // Importamos el componente del chatbot flotante

const Home = () => {
  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
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
