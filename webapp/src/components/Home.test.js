import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Home from './Home';
import { MemoryRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

// Mock de crypto y de react-chatbotify
global.crypto = {
  getRandomValues: jest.fn(() => new Uint8Array(1)),
};

jest.mock('react-chatbotify', () => () => <div>Chatbot Mock</div>);
jest.mock('jwt-decode');

describe('Home component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render welcome message and username if token is valid', async () => {
    const fakeToken = 'fake-token';
    const decodedToken = { name: 'Test User' };
    localStorage.setItem('token', fakeToken);
    jwtDecode.mockReturnValue(decodedToken);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido de nuevo, Test User/i)).toBeInTheDocument();
    });
  });

  it('should render welcome message and extract username from email if no name in token', async () => {
    const fakeToken = 'fake-token';
    const decodedToken = { email: 'testuser@example.com' };
    localStorage.setItem('token', fakeToken);
    jwtDecode.mockReturnValue(decodedToken);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido de nuevo, testuser/i)).toBeInTheDocument();
    });
  });

  it('should not display username if token is invalid or not present', async () => {
    localStorage.removeItem('token');

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Aquí verificaríamos que no haya mensaje de bienvenida ni nombre de usuario
    await waitFor(() => {
      expect(screen.queryByText(/Bienvenido de nuevo/i)).not.toBeInTheDocument();
    });
  });

  it('should handle error in token decoding gracefully', async () => {
    const fakeToken = 'fake-token';
    localStorage.setItem('token', fakeToken);
    jwtDecode.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Verificamos que se muestre el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/Error al obtener los datos del usuario/i)).toBeInTheDocument();
    });
  });

  it('should render PersonalRanking and Chatbot components', async () => {
    const fakeToken = 'fake-token';
    const decodedToken = { name: 'Test User' };
    localStorage.setItem('token', fakeToken);
    jwtDecode.mockReturnValue(decodedToken);

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Bienvenido de nuevo, Test User/i)).toBeInTheDocument();
      expect(screen.getByText(/Ranking Personal/i)).toBeInTheDocument();
    });
  });
});
