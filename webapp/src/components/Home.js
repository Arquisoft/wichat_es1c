// src/components/Home.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, CircularProgress } from '@mui/material';

const Home = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAsk = async () => {
    setLoading(true);
    setResponse('');
    setError('');

    try {
      const apiKey = 'AIzaSyCjkcwRHgwuhMoc0N4hJB_bgud9NV2fv-0'; // Reemplázalo con tu API Key
      const model = 'gemini'; // Puedes cambiar entre 'gemini' y 'empathy'

      const res = await axios.post('/api/chatbot', {
        question,
        model,
        apiKey
      });

      setResponse(res.data.answer || 'No se recibió una respuesta.');
    } catch (err) {
      setError('Error al obtener respuesta del chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        Chatbot - Pregunta lo que quieras
      </Typography>
      <TextField
        fullWidth
        label="Escribe tu pregunta"
        variant="outlined"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleAsk}
        disabled={loading}
      >
        Preguntar
      </Button>
      {loading && <CircularProgress sx={{ mt: 2 }} />}
      {response && (
        <Typography variant="h6" align="center" sx={{ mt: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          {response}
        </Typography>
      )}
      {error && (
        <Typography variant="h6" align="center" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </Container>
  );
};

export default Home;
