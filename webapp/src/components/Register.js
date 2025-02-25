// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';

const Register = () => {
  const [name, setName]           = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const registerUser = async () => {
    try {
      const response = await axios.post('/api/register', { name, email, password });
      setMessage(response.data.message);
      setOpenSnackbar(true);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setMessage('');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h5" component="h1" align="center">
        Registro
      </Typography>
      <TextField
        margin="normal"
        fullWidth
        label="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={registerUser}>
        Registrarse
      </Button>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={error || message}
      />
    </Container>
  );
};

export default Register;
