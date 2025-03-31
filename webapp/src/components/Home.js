import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import jwtDecode from 'jwt-decode';
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
        {userName && (
          <Container
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
              textAlign: 'center',
            }}
          >
            <Typography
              component="h2"
              variant="h4"
              sx={{
                color: '#ffffff',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '700',
                mb: 1,
              }}
            >
              ¡Bienvenido de nuevo, {userName}!
            </Typography>
            <Typography
              component="p"
              variant="body1"
              sx={{
                color: '#d1d1d1',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: '400',
              }}
            >
              Nos alegra verte de nuevo. Explora tus rankings y disfruta de la experiencia de WiChat.
            </Typography>
          </Container>
        )}

        <PersonalRanking />
      </Container>
    </>
  );
};

export default Home;