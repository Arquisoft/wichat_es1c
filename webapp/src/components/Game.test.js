import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Game from '../components/Game';

const mockAxios = new MockAdapter(axios);
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate, 
}));

describe('Game component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  it('debería mostrar un mensaje de carga mientras se obtienen las preguntas', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, []);
    
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando preguntas.../i)).toBeInTheDocument();
  });

  it('debería cargar y mostrar una pregunta con sus opciones', async () => {
    const mockQuestions = [
      { title: 'Pregunta 1|image1.jpg', allAnswers: 'A,B,C,D', correctAnswer: 'B' }
    ];
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, mockQuestions);

    render(<MemoryRouter><Game /></MemoryRouter>);

    await waitFor(() => expect(screen.getByRole('heading')).toBeInTheDocument());
    expect(screen.getAllByRole('button')).toHaveLength(5); // 4 opciones de respuesta
  });

});
