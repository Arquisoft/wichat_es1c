// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const registerUser = async () => {
    try {
      const response = await axios.post(
        '/api/register',
        { name, email, password },
        { withCredentials: true }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/home');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error al registrarse';
      setError(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
    <div className="page-container">
      <Container component="main" maxWidth="xs" className="login-container">
        <img src="/LogoWichat.png" alt="Logo Wichat" className="login-logo" />
        <Typography variant="h5" align="center">
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
        <Button variant="contained" color="primary" fullWidth className="login-button" sx={{ mt: 2 }} onClick={registerUser}>
          Registrarse
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />
      </Container>

      <Typography variant="body2" align="center" className="register-text">
        Already have an account? <a href="/login" className="register-link">Login here</a>.
      </Typography>
    </div>
  );
};

export default Register;
