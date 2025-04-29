import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js';
import FAQ from './components/Faq.js';
import UserAccount from './components/UserAccount.js';
import AdminMenu from './components/AdminMenu.js';
import Ranking from './components/Ranking.js';
import ProtectedRoute from './components/ProtectedRoute';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

function App() {
  const location = useLocation();

  const theme = createTheme({
    palette: {
      mode: 'light',
    },
  });

  useEffect(() => {
    const background = '/FondoWichat.png'; 

    document.body.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundImage = `url(${background})`;
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundAttachment = "fixed";
  }, []);

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
              <Route
                path="/admin-menu"
                element={
                  <ProtectedRoute>
                    <AdminMenu />
                  </ProtectedRoute>
                }
              />
            </Routes>

            {(location.pathname === '/' || location.pathname === '/login') && (
              <Typography component="div" align="center" sx={{ mt: 2 }}>
                {location.pathname === '/' ? (
                  <Typography variant="body2" color="white">
                    <a href="/register" style={{ textDecoration: 'none', color: 'white' }}>¿No tienes una cuenta? Regístrate aquí.</a>
                  </Typography>
                ) : (
                  <Typography variant="body2" color="white">
                    <a href="/" style={{ textDecoration: 'none', color: 'white' }}>¿Ya tienes una cuenta? Inicia sesión aquí.</a>
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
