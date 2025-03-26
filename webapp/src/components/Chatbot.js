import React from 'react';
import ChatBot from 'react-chatbotify';
import axios from 'axios';

const GameChatbot = ({ currentAnswer }) => {
  const fetchGeminiResponse = async (userInput, streamMessage) => {
    try {
      const systemMessage = `
        Eres un asistente experto en banderas. El país correcto es "${currentAnswer}".
        NO digas el nombre directamente. Da pistas útiles sobre su cultura, historia, geografía o colores de la bandera.
        Responde siempre en español, de forma clara y amigable.
      `;

      const response = await axios.post('http://localhost:8000/api/chatbot', {
        question: userInput,
        model: 'gemini',
        systemMessage
      });
      
      console.log("➡️ Enviando país al chatbot:", response);
      console.log("➡️ Enviando país al chatbot:", currentAnswer);

      const reply = response.data.answer || 'No tengo una pista para eso.';
      streamMessage(reply);
    } catch (error) {
      console.error('Error al obtener respuesta del chatbot:', error);
      streamMessage('Hubo un error al obtener la pista.');
    }
  };

  const flow = {
    start: {
      message: '¡Hola! Soy tu asistente de banderas. ¿Necesitas una pista sobre alguna bandera? 🤔',
      path: 'await_user_input'
    },
    await_user_input: {
      message: async ({ userInput, streamMessage }) => {
        if (!currentAnswer) {
          streamMessage('⚠️ No tengo información sobre la bandera actual.');
          return;
        }

        await fetchGeminiResponse(userInput, streamMessage);
      },
      path: 'await_user_input'
    }
  };

  return (
    <ChatBot
      flow={flow}
      theme="light"
      title="Asistente de Banderas"
      subtitle="¿Necesitas una pista? ¡Pregúntame!"
      assistantIcon="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
      userInputPlaceholder="Escribe tu pregunta sobre la bandera..."
      style={{ bottom: 20, right: 20, zIndex: 1000 }}
    />
  );
};

export default GameChatbot;
