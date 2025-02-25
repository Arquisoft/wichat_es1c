// src/App.js
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

function App() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ mt: 2 }}>
        Welcome to the 2025 edition of the Software Architecture course
      </Typography>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
      {/* Opcional: enlaces de navegación para cambiar entre Login y Registro */}
      {window.location.pathname !== '/home' && (
        <Typography component="div" align="center" sx={{ mt: 2 }}>
          {window.location.pathname === '/' ? (
            <Link to="/register" variant="body2" component="button">
              Don't have an account? Register here.
            </Link>
          ) : (
            <Link to="/" variant="body2" component="button">
              Already have an account? Login here.
            </Link>
          )}
        </Typography>
      )}
    </Container>
  );
}

export default App;
