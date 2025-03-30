import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js';
import FAQ from './components/Faq.js';
import UserAccount from './components/UserAccount.js';
import Ranking from './components/Ranking.js';
import ProtectedRoute from './components/ProtectedRoute';
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
      mode: darkMode ? 'dark' : 'light', // Cambiar entre 'dark' y 'light'
    },
  });

  useEffect(() => {
    // Cambiar el fondo según el estado del modo oscuro
    const background = darkMode ? '/FondoWichat_2.png' : '/FondoWichat.png'; 
    document.body.style.backgroundImage = `url(${background})`;
  }, [darkMode]);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <div
          style={{
            height: '100vh',
            overflowY: 'scroll',
            overflowX: 'hidden',
            width: '100vw',
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
              {/* Rutas públicas */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rutas protegidas */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game"
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/faq"
                element={
                  <ProtectedRoute>
                    <FAQ />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ranking"
                element={
                  <ProtectedRoute>
                    <Ranking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-account"
                element={
                  <ProtectedRoute>
                    <UserAccount />
                  </ProtectedRoute>
                }
              />
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
              {darkMode ? 'Modo Oscuro' : 'Modo Claro'}
            </Button>

            {location.pathname !== '/home' && location.pathname !== '/game' && location.pathname !== '/faq' && location.pathname !== '/user-account'
              && location.pathname !== '/ranking' && (
              <Typography component="div" align="center" sx={{ mt: 2 }}>
                {location.pathname === '/' ? (
                  <Typography variant="body2" color="white">
                    ¿No tienes una cuenta? <a href="/register" style={{ textDecoration: 'none', color: 'white' }}>Regístrate aquí.</a>
                  </Typography>
                ) : (
                  <Typography variant="body2" color="white">
                    ¿Ya tienes una cuenta? <a href="/" style={{ textDecoration: 'none', color: 'white' }}>Inicia sesión aquí.</a>
                  </Typography>
                )}
              </Typography>
            )}
          </Container>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
