import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Snackbar, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../Register.css';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";


const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [userExists, setUserExists] = useState(false);

  const registerUser = async () => {
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setOpenSnackbar(true);
      return;
    }

    try {
      const response = await axios.post(
        `${endpoint}/api/register`,
        { name, email, password, userRole: 'user' },
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
        setUserExists(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
  };

  return (
    <>
      {/* Background animation */}
      <div className="context"></div>
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      {/* Main form */}
      <Container component="main" maxWidth="xs" sx={{ mt: 4 }} className="register-container">
        <img src="/LogoWichat.gif" alt="Logo Wichat" className="register-logo" />
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
          Registro
        </Typography>
        <TextField
          inputProps={{ 'data-testid': 'nombre-input' }}
          margin="normal"
          fullWidth
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          inputProps={{ 'data-testid': 'email-input' }}
          margin="normal"
          fullWidth
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          inputProps={{ 'data-testid': 'pass-input' }}
          margin="normal"
          fullWidth
          label="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          inputProps={{ 'data-testid': 'confirm-pass-input' }}
          margin="normal"
          fullWidth
          label="Confirmar"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={!!confirmPassword && password !== confirmPassword}
          helperText={
            !!confirmPassword && password !== confirmPassword
              ? 'Las contraseñas no coinciden'
              : ''
          }
        />
        <Button
          variant="contained"
          color="primary"
          className="register-button"
          fullWidth
          sx={{ mt: 2 }}
          onClick={registerUser}
        >
          Registrarse
        </Button>

        {userExists && (
          <Typography align="center" sx={{ mt: 2 }}>
            Ya tienes una cuenta?{' '}
            <Link href="/" variant="body2">
              Inicia sesión aquí.
            </Link>
          </Typography>
        )}

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={error}
        />
      </Container>
    </>
  );
};

export default Register;
