// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

const Login = () => {
  const [email, setEmail] = useState('');       // Usamos email en lugar de username
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');     // Mensaje de éxito
  const [error, setError] = useState('');         // Mensaje de error
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const loginUser = async () => {
    try {
      // Llama al endpoint de login en tu API; se asume que has configurado el proxy en package.json
      const response = await axios.post('/api/login', { email, password });
      setMessage(response.data.message);
      setLoginSuccess(true);
      setOpenSnackbar(true);
    } catch (err) {
      // Usa encadenamiento opcional para evitar errores si la respuesta es undefined
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
    <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
      {loginSuccess ? (
        <Typography variant="h5" align="center" color="primary">
          {message}
        </Typography>
      ) : (
        <>
          <Typography variant="h5" component="h1" align="center">
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
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={loginUser}
          >
            Login
          </Button>
        </>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || message}
      />
    </Container>
  );
};

export default Login;
