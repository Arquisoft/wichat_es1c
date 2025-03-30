import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import GameChatbot from './Chatbot';

jest.mock('axios');


jest.mock('react-chatbotify', () => ({
  __esModule: true,
  default: ({ flow }) => {
    const userInput = "Dame una pista";
    const streamMessage = jest.fn();

    
    flow.await_user_input.message({ userInput, streamMessage });

    return <div data-testid="chatbot-mock">Mock Chatbot</div>;
  }
}));

describe('GameChatbot', () => {
  it('envía la pregunta al backend y recibe una respuesta', async () => {
    axios.post.mockResolvedValueOnce({
      data: { answer: 'Tiene una bandera tricolor con un símbolo de rueda.' }
    });

    const { getByTestId } = render(<GameChatbot currentAnswer="India" />);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/chatbot', {
        question: 'Dame una pista',
        model: 'gemini',
        systemMessage: expect.stringContaining('India')
      });
    });

    expect(getByTestId('chatbot-mock')).toBeInTheDocument();
  });

  it('muestra mensaje de error si currentAnswer no está definido', async () => {
    const streamMessage = jest.fn();

    
    const { flow } = require('./Chatbot').default({ currentAnswer: '' }).props;

    await flow.await_user_input.message({ userInput: 'Hola', streamMessage });

    expect(streamMessage).toHaveBeenCalledWith('⚠️ No tengo información sobre la bandera actual.');
  });
});
