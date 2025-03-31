import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import UserAccount from './UserAccount';
import { MemoryRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

jest.mock('axios');
jest.mock('jwt-decode');

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};


describe('UserAccount Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mocked_token');
    jwtDecode.mockReturnValue({
      name: 'Test User',
      email: 'test@example.com',
    });
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders user information correctly', async () => {
    axios.get.mockResolvedValue({ data: [
      { email: 'test@example.com', correct: 5, wrong: 3, timestamp: 1672531200 },
      { email: 'test@example.com', correct: 7, wrong: 2, timestamp: 1672617600 }
    ] });

    render(
      <MemoryRouter>
        <UserAccount />
      </MemoryRouter>
    );

    expect(await screen.findByText('Usuario: Test User')).toBeInTheDocument();
    expect(await screen.findByText('Correo: test@example.com')).toBeInTheDocument();
  });

  test('fetches and displays user statistics', async () => {
    axios.get.mockResolvedValue({ data: [
      { email: 'test@example.com', correct: 6, wrong: 4, timestamp: 1672531200 },
      { email: 'test@example.com', correct: 8, wrong: 2, timestamp: 1672617600 }
    ] });

    render(
      <MemoryRouter>
        <UserAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Total de partidas jugadas: 2')).toBeInTheDocument();
      expect(screen.getByText('Preguntas acertadas: 14')).toBeInTheDocument();
      expect(screen.getByText('Preguntas falladas: 6')).toBeInTheDocument();
      expect(screen.getByText('Total de preguntas: 20')).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Error al obtener los datos'));

    render(
      <MemoryRouter>
        <UserAccount />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Usuario: Test User')).toBeInTheDocument();
      expect(screen.getByText('Correo: test@example.com')).toBeInTheDocument();
    });
  });
  test('decodes token and sets user name and email', async () => {
    render(
        <MemoryRouter>
            <UserAccount />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText('Usuario: Test User')).toBeInTheDocument();
        expect(screen.getByText('Correo: test@example.com')).toBeInTheDocument();
    });
});

test('handles invalid token gracefully', async () => {
    localStorage.setItem('token', 'invalid_token');
    jwtDecode.mockImplementation(() => {
        throw new Error('Invalid token');
    });

    render(
        <MemoryRouter>
            <UserAccount />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.queryByText('Usuario:')).not.toBeInTheDocument();
        expect(screen.queryByText('Correo:')).not.toBeInTheDocument();
    });
});

test('renders the chart when last 10 games exist', async () => {
    axios.get.mockResolvedValue({
        data: [
            { email: 'test@example.com', correct: 6, wrong: 4, timestamp: 1672531200 },
            { email: 'test@example.com', correct: 8, wrong: 2, timestamp: 1672617600 }
        ]
    });

    render(
        <MemoryRouter>
            <UserAccount />
        </MemoryRouter>
    );
    await waitFor(() => {
        expect(screen.getByText('Resultados últimas 10 partidas')).toBeInTheDocument();
    });
});

test('does not render the chart when no game data is available', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(
        <MemoryRouter>
            <UserAccount />
        </MemoryRouter>
    );
    await waitFor(() => {
        expect(screen.queryByText('Resultados últimas 10 partidas')).not.toBeInTheDocument();
    });
});

});
