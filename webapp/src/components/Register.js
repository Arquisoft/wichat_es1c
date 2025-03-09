import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userExists, setUserExists] = useState(false); // Estado para detectar si el usuario ya está registrado

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

      if (err.response?.status === 409) {
        setUserExists(true); // Si el usuario ya existe, activamos el estado
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 4 }}>
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
      <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }} onClick={registerUser}>
        Registrarse
      </Button>

      {/* Mostrar solo el enlace a Login si el usuario ya está registrado */}
      {userExists && (
        <Typography align="center" sx={{ mt: 2 }}>
          Ya tienes una cuenta?{' '}
          <Link href="/" variant="body2">
            Inicia sesión aquí.
          </Link>
        </Typography>
      )}

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />
    </Container>
  );
};

export default Register;
