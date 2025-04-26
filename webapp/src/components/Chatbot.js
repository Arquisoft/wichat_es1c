import React from 'react';
import ChatBot from 'react-chatbotify';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

const GameChatbot = ({ currentAnswer }) => {
  const fetchGeminiResponse = async (userInput, streamMessage) => {
    try {
      const systemMessage = `
        Eres el asistente de un juego, experto en cultura general. El juego muestra una imagen y diferentes opciones, el jugador 
        debe de seleccionar la respuesta correcta para pasar a la siguiente ronda. La respuesta correcta es "${currentAnswer}".
        NO digas el nombre directamente. Limitate a responer al jugar a sus preguntas o da pistas útiles sobre la cultura, historia, geografía o aspecto de la respuesta correcta.
        Responde siempre en español, de forma clara y amigable. NUNCA digas la respuesta correcta: "${currentAnswer}".
      `;

      const response = await axios.post(`${endpoint}/api/chatbot`, {
        question: userInput,
        model: 'gemini',
        systemMessage
      });
      
      console.log("Enviando país al chatbot:", response);
      console.log("Enviando país al chatbot:", currentAnswer);

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
