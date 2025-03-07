// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const loginUser = async () => {
    try {
      const response = await axios.post(
        '/api/login',
        { email, password },
        { withCredentials: true }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al iniciar sesión';
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
    <Container component="main" maxWidth="xs" className="login-container">
      <img src="/LogoWichat.png" alt="Logo Wichat" className="login-logo" /> {/* Imagen añadida */}
      <Typography variant="h5" align="center">
        Login
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Contraseña"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" fullWidth className="login-button" onClick={loginUser}>
        Login
      </Button>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />
    </Container>
  );
};

export default Login;
