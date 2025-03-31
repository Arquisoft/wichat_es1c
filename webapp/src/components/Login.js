import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../Login.css';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const loginUser = async () => {
    try {
      const response = await axios.post(`${endpoint}/api/login`, { email, password });
      const { token } = response.data;

      if (!token) {
        throw new Error("No se recibió token");
      }

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
    <>
      <Container component="main" maxWidth="xs" className="login-container">
        <img src="/LogoWichat.gif" alt="Logo Wichat" className="login-logo" />
        <Typography
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
          type={showPassword ? 'text' : 'password'} // Cambia el tipo de input según el estado
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onMouseDown={() => setShowPassword(true)} // Muestra la contraseña al mantener pulsado
                  onMouseUp={() => setShowPassword(false)} // Oculta la contraseña al soltar
                  onMouseLeave={() => setShowPassword(false)} // Asegura que se oculte si el cursor sale del botón
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
