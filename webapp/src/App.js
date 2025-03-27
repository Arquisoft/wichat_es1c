import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js';
import FAQ from './components/Faq.js';
import UserAccount from './components/UserAccount.js';
import Ranking from './components/Ranking.js';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles'; 
import Button from '@mui/material/Button';
import './App.css';

function App() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Crear tema en base al estado del darkMode
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'light' : 'light', 
    },
  });

  useEffect(() => {
    // Cambiar el fondo según el estado del modo oscuro
    const background = darkMode ? '/FondoWichat_2.png' : '/FondoWichat.png'; 
    document.body.style.backgroundImage = `url(${background})`;
  }, [location, darkMode]); // Asegúrate de actualizar cuando cambie darkMode

  return (
    

    <ThemeProvider theme={theme}> {/* Aplicar el tema en toda la aplicación */}
      <div
        style={{
          height: '100vh',
          overflowY: 'auto', // Permitir desplazamiento vertical
          overflowX: 'hidden', // Deshabilitar desplazamiento horizontal
          width: '100vw', // Asegurar que ocupe todo el ancho de la ventana
        }}
      >

<div className="area">
      <ul className="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
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
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/user-account" element={<UserAccount />} />
          </Routes>

          {/* Botón de cambio de modo */}
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setDarkMode(!darkMode)} 
            sx={{
              position: 'fixed',
              bottom: 20,
              left: 20,
              zIndex: 1000,
            }}
          >
            {darkMode ? 'Modo Oscuro' : 'Modo Claro'} {/* Cambiar el texto según el modo */}
          </Button>

          {location.pathname !== '/home' && location.pathname !== '/game' && location.pathname !== '/faq' && location.pathname !== '/user-account'
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
      </div>
    </ThemeProvider>
  );
}

export default App;
