// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './components/Home.js';
import Game from './components/Game.js'
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useLocation } from 'react-router-dom';


function App() {
  const location = useLocation(); // Obtiene la ruta actual de React Router

  return (
    <Container component="main" maxWidth="lg">
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
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), -1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)',
          width: '100%',
          letterSpacing: '0.5px',
          wordBreak: 'break-word',
        }}
      >
        Welcome to the 2025 edition of the Software Architecture course
      </Typography>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/game" element={<Game />} />
      </Routes>

      {location.pathname !== '/home' && (
        <Typography component="div" align="center" sx={{ mt: 2 }}>
          {location.pathname === '/' ? (
            <Link to="/register" variant="body2" component="button" style={{ color: 'white' }}>
              Don't have an account? Register here.
            </Link>
          ) : (
            <Link to="/" variant="body2" component="button" style={{ color: 'white' }}>
              Already have an account? Login here.
            </Link>
          )}
        </Typography>
      )}
    </Container>
  );
}

export default App;
