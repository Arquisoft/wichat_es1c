import React from 'react';
import ChatBot from 'react-chatbotify';
import axios from 'axios';

const endpoint = process.env.REACT_APP_API_ENDPOINT || "http://localhost:8000";

/**
 * Componente del asistente de pistas del juego.
 * @param {string} currentAnswer - Respuesta correcta actual (nunca se revela).
 */
const GameChatbot = ({ currentAnswer }) => {
  /**
   * Envia la pregunta del usuario al backend y transmite la respuesta generada.
   */
  /* istanbul ignore next */
  const fetchGeminiResponse = async (userInput, streamMessage) => {
    try {
      const response = await axios.post(`${endpoint}/api/chatbot`, {
        question: userInput,
        model: 'gemini',
        currentAnswer  // El backend usará esto para construir el prompt
      });

      const reply = response.data.answer || 'No tengo una pista para eso.';
      streamMessage(reply);
    } catch (error) {
      console.error('Error al obtener respuesta del chatbot:', error);
      streamMessage('Hubo un error al obtener la pista.');
    }
  };

  /**
   * Define el flujo de conversación del chatbot.
   */
  const flow = {
    start: {
      message: '¡Hola! Soy Jack, un sabelotodo. ¿Necesitas una pista?',
      path: 'await_user_input'
    },
    await_user_input: {
      message: async ({ userInput, streamMessage }) => {
        /* istanbul ignore next */
        if (!currentAnswer) {
          streamMessage('⚠️ No tengo información sobre la respuesta actual.');
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
      title="Asistente de Wichat"
      subtitle="¿Necesitas una pista? ¡Pregúntame!"
      assistantIcon="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
      userInputPlaceholder="Escribe tu pregunta sobre la bandera..."
      style={{ bottom: 20, right: 20, zIndex: 1000 }}
    />
  );
};

export default GameChatbot;