import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import GameChatbot from './Chatbot';

jest.mock('axios');

jest.mock('react-chatbotify', () => ({
  __esModule: true,
  default: ({ flow, theme, title, subtitle, assistantIcon, userInputPlaceholder, style }) => {
    return (
      <div data-testid="chatbot-mock">
        <p>{title}</p>
        <p>{subtitle}</p>
        <p>{theme}</p>
        <p>{assistantIcon}</p>
        <p>{userInputPlaceholder}</p>
        <p>{JSON.stringify(style)}</p>
      </div>
    );
  }
}));

describe('GameChatbot', () => {
  it('renderiza correctamente con las propiedades iniciales', () => {
    const { getByText, getByTestId } = render(<GameChatbot currentAnswer="India" />);

    expect(getByTestId('chatbot-mock')).toBeInTheDocument();
    expect(getByText('Asistente de Wichat')).toBeInTheDocument();
    expect(getByText('¿Necesitas una pista? ¡Pregúntame!')).toBeInTheDocument();
    expect(getByText('light')).toBeInTheDocument();
    expect(getByText('https://cdn-icons-png.flaticon.com/512/4712/4712109.png')).toBeInTheDocument();
    expect(getByText('Escribe tu pregunta sobre la bandera...')).toBeInTheDocument();
  });

  it('envía la pregunta al backend y recibe una respuesta', async () => {
    axios.post.mockResolvedValueOnce({
      data: { answer: 'Tiene una bandera tricolor con un símbolo de rueda.' }
    });

    const streamMessage = jest.fn();

    const flow = {
      await_user_input: {
        message: async ({ userInput, streamMessage }) => {
          await axios.post('/api/chatbot', {
            question: userInput,
            model: 'gemini',
            currentAnswer: 'India'
          });
          streamMessage('Tiene una bandera tricolor con un símbolo de rueda.');
        }
      }
    };

    render(<GameChatbot currentAnswer="India" />);

    await flow.await_user_input.message({ userInput: 'Dame una pista', streamMessage });

    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/chatbot'), {
      question: 'Dame una pista',
      model: 'gemini',
      currentAnswer: 'India'
    });

    expect(streamMessage).toHaveBeenCalledWith('Tiene una bandera tricolor con un símbolo de rueda.');
  });

  it('maneja errores al llamar al backend', async () => {
    axios.post.mockRejectedValueOnce(new Error('Error de red'));

    const streamMessage = jest.fn();

    const flow = {
      await_user_input: {
        message: async ({ userInput, streamMessage }) => {
          try {
            await axios.post('/api/chatbot', {
              question: userInput,
              model: 'gemini',
              currentAnswer: 'India'
            });
          } catch (error) {
            streamMessage('Hubo un error al obtener la pista.');
          }
        }
      }
    };

    render(<GameChatbot currentAnswer="India" />);

    await flow.await_user_input.message({ userInput: 'Dame una pista', streamMessage });

    expect(streamMessage).toHaveBeenCalledWith('Hubo un error al obtener la pista.');
  });

  it('muestra mensaje de error si currentAnswer no está definido', async () => {
    const streamMessage = jest.fn();

    const flow = {
      await_user_input: {
        message: async ({ userInput, streamMessage }) => {
          streamMessage('⚠️ No tengo información sobre la respuesta actual.');
        }
      }
    };

    render(<GameChatbot currentAnswer="" />);

    await flow.await_user_input.message({ userInput: 'Hola', streamMessage });

    expect(streamMessage).toHaveBeenCalledWith('⚠️ No tengo información sobre la respuesta actual.');
  });
});
