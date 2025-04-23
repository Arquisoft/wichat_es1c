import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar el contexto de autenticación
import '../Login.css';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

axios.defaults.withCredentials = true; // Habilita cookies con credenciales

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const loginUser = async () => {
    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(`${endpoint}/api/login`, { email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error("No se recibió token");
      }

      localStorage.setItem('token', token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('userEmail', response.data.email);
      localStorage.setItem('userName', response.data.name);

      login();
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
    <>
      <Container component="main" maxWidth="xs" className="login-container">
        <img src="/LogoWichat.gif" alt="Logo Wichat" className="login-logo" />
        <Typography
          data-testid="login-title"
          variant="h5"
          align="center"
          sx={{
            fontFamily: "Arial Black",
            fontSize: "37px",
            letterSpacing: "0.6px",
            wordSpacing: "1px",
            color: "#2e1569",
            fontWeight: 400,
            fontStyle: "normal",
            fontVariant: "normal",
            textTransform: "uppercase",
          }}
        >
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
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  data-testid="toggle-password"
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" color="primary" fullWidth className="login-button" onClick={loginUser}>
          Login
        </Button>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={error} />
      </Container>
    </>
  );
};

export default Login;
