import React from 'react';
import { render } from '@testing-library/react';
import GameChatbot from './Chatbot';

jest.mock('react-chatbotify', () => ({
  __esModule: true,
  default: ({ flow }) => {
    return <div data-testid="chatbot-mock">Mock Chatbot</div>;
  }
}));

describe('GameChatbot', () => {
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
