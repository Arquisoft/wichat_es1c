// src/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, IconButton, Paper, CircularProgress } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => {
    setOpen(!open);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { text: question, sender: 'user' }];
    setMessages(newMessages);
    setQuestion('');

    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyCjkcwRHgwuhMoc0N4hJB_bgud9NV2fv-0';
      const model = 'gemini';

      const res = await axios.post('/api/chatbot', {
        question,
        model,
        apiKey,
      });

      const botResponse = res.data.answer || 'No se recibió una respuesta.';
      setMessages([...newMessages, { text: botResponse, sender: 'bot' }]);
    } catch (err) {
      setMessages([...newMessages, { text: 'Error al obtener respuesta.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón flotante para abrir/cerrar el chatbot */}
      <IconButton
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': { bgcolor: 'primary.dark' },
          zIndex: 1000,
        }}
      >
        <ChatIcon />
      </IconButton>

      {/* Ventana del chat desplegable */}
      {open && (
        <Paper
          elevation={5}
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 20,
            width: 300,
            maxHeight: 400,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 3,
            zIndex: 1000,
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
            <Typography variant="h6">Chatbot</Typography>
            <IconButton size="small" onClick={toggleChat}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Mensajes del chatbot */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: 'auto',
              maxHeight: 250,
              mb: 1,
              p: 1,
              border: '1px solid #ddd',
              borderRadius: 1,
              bgcolor: '#f9f9f9',
            }}
          >
            {messages.length === 0 ? (
              <Typography variant="body2" color="textSecondary" align="center">
                Pregunta lo que quieras...
              </Typography>
            ) : (
              messages.map((msg, index) => (
                <Typography
                  key={index}
                  sx={{
                    textAlign: msg.sender === 'user' ? 'right' : 'left',
                    bgcolor: msg.sender === 'user' ? '#007bff' : '#f1f1f1',
                    color: msg.sender === 'user' ? 'white' : 'black',
                    borderRadius: 1,
                    p: 1,
                    mb: 1,
                    maxWidth: '80%',
                    display: 'inline-block',
                  }}
                >
                  {msg.text}
                </Typography>
              ))
            )}
          </Box>

          {/* Input y botón de enviar */}
          <Box display="flex">
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Escribe tu pregunta..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAsk}
              disabled={loading}
              sx={{
                ml: 1,
                fontSize: '1.2rem',  // Aumenta el tamaño del texto
                padding: '10px 20px', // Aumenta el padding (espaciado interno)
                minWidth: '150px',  // Establece un ancho mínimo para el botón
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : 'Enviar'}
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default Chatbot;
