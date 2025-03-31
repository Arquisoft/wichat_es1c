import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
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

});
