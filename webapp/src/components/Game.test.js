import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Game from '../components/Game';

global.crypto = {
  getRandomValues: (arr) => require('crypto').randomFillSync(arr),
};

const mockAxios = new MockAdapter(axios);

jest.mock('react-chatbotify', () => () => <div>Chatbot Mock</div>);

const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  const renderGameWithQuestions = (questions) => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, questions);
    render(<MemoryRouter><Game /></MemoryRouter>);
  };

  it('debería mostrar mensaje de carga y luego opciones', async () => {
    renderGameWithQuestions([
      { title: 'Pregunta|https://img', correctAnswer: 'Correcta', allAnswers: 'Correcta,Opción1,Opción2,Opción3' }
    ]);
    expect(screen.getByText(/Cargando preguntas/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Correcta')).toBeInTheDocument());
  });

  it('debería manejar respuesta correcta', async () => {
    renderGameWithQuestions([
      { title: 'Pregunta|https://img', correctAnswer: 'Correcta', allAnswers: 'Correcta,Opción1,Opción2,Opción3' }
    ]);
    await waitFor(() => screen.getByText('Correcta'));
    fireEvent.click(screen.getByText('Correcta'));
    await waitFor(() => expect(screen.getByText('¡Correcto!')).toBeInTheDocument());
    expect(screen.getByText('Correcta')).toHaveStyle('background-color: #4caf50');
  });

  it('debería manejar respuesta incorrecta', async () => {
    renderGameWithQuestions([
      { title: 'Pregunta|https://img', correctAnswer: 'Correcta', allAnswers: 'Correcta,Opción1,Opción2,Opción3' }
    ]);
    await waitFor(() => screen.getByText('Correcta'));
    fireEvent.click(screen.getByText('Opción1'));
    await waitFor(() => expect(screen.getByText('Incorrecto.')).toBeInTheDocument());
    expect(screen.getByText('Opción1')).toHaveStyle('background-color: #f44336');
    expect(screen.getByText('Correcta')).toHaveStyle('background-color: #4caf50');
  });

  it('debería mostrar el temporizador', async () => {
    renderGameWithQuestions([
      { title: 'Pregunta|https://img', correctAnswer: 'Correcta', allAnswers: 'Correcta,Opción1,Opción2,Opción3' }
    ]);
    await waitFor(() => screen.getByText('Correcta'));
    const timer = await screen.findByText((text) => /^\d+s$/.test(text));
    expect(timer).toBeInTheDocument();
  });

  it('debería completar partida y mostrar mensaje final', async () => {
    renderGameWithQuestions([
      { title: 'P1|img', correctAnswer: 'R1', allAnswers: 'R1,X,Y,Z' },
      { title: 'P2|img', correctAnswer: 'R2', allAnswers: 'R2,A,B,C' }
    ]);
    await waitFor(() => screen.getByText('R1'));
    fireEvent.click(screen.getByText('R1'));
    const next = await screen.findByText('R2', {}, { timeout: 3000 });
    fireEvent.click(next);
    await waitFor(() => expect(screen.getByText(/¡Juego terminado!/i)).toBeInTheDocument(), { timeout: 3000 });
  });


  it('debería manejar correctamente cuando no se reciben preguntas', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, []);
  
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );
  
    await waitFor(() =>
      expect(screen.getByText(/Cargando preguntas/i)).toBeInTheDocument()
    );
  });
  

});
