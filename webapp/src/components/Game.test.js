import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Game from '../components/Game';

global.crypto = {
  getRandomValues: (arr) => require('crypto').randomFillSync(arr),
};

const mockAxios = new MockAdapter(axios);

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('debería mostrar contenido del juego después de cargar', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: 'Pregunta simulada|https://via.placeholder.com/150',
        correctAnswer: 'OpciónCorrecta',
        allAnswers: 'OpciónCorrecta,Opción2,Opción3,Opción4'
      }
    ]);

    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando preguntas/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('OpciónCorrecta')).toBeInTheDocument();
    });
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
});
