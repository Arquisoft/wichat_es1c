import React, { useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js';
import FAQ from './components/Faq.js';
import Ranking from './components/Ranking.js';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  const location = useLocation();

  useEffect(() => {
    // const currentPath = location.pathname;

    // Arreglo de fondos posibles
    const backgrounds = [
      '/FondoWichat.png',
      '/FondoWichat_2.png',
      '/FondoWichat_3.png',
      '/FondoWichat_4.png',
    ];

    // Seleccionar un fondo aleatorio
    const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Cambiar el fondo basado en la ruta actual
    document.body.style.backgroundImage = `url(${randomBackground})`;
  }, [location]);

  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        boxShadow: '0px 4px 20px rgba(0,0,0,0)', 
        padding: 3,
      }}
    >
      <CssBaseline />
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
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), '
              + '-1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)',
          width: '100%',
          letterSpacing: '0.5px',
          wordBreak: 'break-word',
        }}
      >
      </Typography>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/ranking" element={<Ranking />} />
      </Routes>

      {location.pathname !== '/home' && location.pathname !== '/game' && location.pathname !== '/faq'
        && location.pathname !== '/ranking' && (
        <Typography component="div" align="center" sx={{ mt: 2 }}>
          {location.pathname === '/' ? (
            <Link to="/register" variant="body2" component="button" style={{ color: 'white' }}>
              ¿No tienes una cuenta? Regístrate aquí.
            </Link>
          ) : (
            <Link to="/" variant="body2" component="button" style={{ color: 'white' }}>
              ¿Ya tienes una cuenta? Inicia sesión aquí.
            </Link>
          )}
        </Typography>
      )}
    </Container>
  );
}

export default App;
