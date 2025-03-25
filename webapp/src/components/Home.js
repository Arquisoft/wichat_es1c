import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import jwtDecode from 'jwt-decode';
import Chatbot from './Chatbot';
import OptionsDropdown from './OptionsDropdown';
import PersonalRanking from "./PersonalRanking";

const Home = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const extractedName =
          decodedToken.name ||
          decodedToken.user?.name ||
          decodedToken.username ||
          decodedToken.preferred_username ||
          decodedToken.given_name ||
          decodedToken.email?.split('@')[0] ||
          '';

        setUserName(extractedName);
      } catch (error) {
        console.error('Error al decodificar el token.');
      }
    }
  }, []);

  return (
    <>
      <OptionsDropdown />
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

        {userName && (
          <Typography
            component="h2"
            variant="h5"
            align="center"
            sx={{
              mt: 2,
              color: 'white',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: '700',
            }}
          >
            Usuario logueado como: {userName}
          </Typography>
        )}

        <PersonalRanking />
        <Chatbot />
      </Container>
    </>
  );
};

export default Home;