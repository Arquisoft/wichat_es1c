// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Game from './components/Game';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Container component="main" maxWidth="lg">  {}
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
          textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5), -1px -1px 0 rgba(0, 0, 0, 0.7), 1px -1px 0 rgba(0, 0, 0, 0.7), -1px 1px 0 rgba(0, 0, 0, 0.7), 1px 1px 0 rgba(0, 0, 0, 0.7)', // Simula el contorno negro
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

      {window.location.pathname !== '/home' && (
        <Typography component="div" align="center" sx={{ mt: 2 }}>
          {window.location.pathname === '/' ? (
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
