// src/components/Home.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHome = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setWelcomeMessage(response.data.message);
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar la información');
      } finally {
        setLoading(false);
      }
    };

    fetchHome();
  }, [navigate]);

  if (loading) {
    return (
      <Container component="main" maxWidth="xs">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    // Si ocurre un error (por ejemplo, token inválido), redirige al login
    navigate('/');
    return null;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Typography variant="h4" align="center">
        {welcomeMessage}
      </Typography>
    </Container>
  );
};

export default Home;
