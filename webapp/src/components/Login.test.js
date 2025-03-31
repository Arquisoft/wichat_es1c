import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';
const mockAxios = new MockAdapter(axios);
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Login component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
    mockAxios.reset(); 
  });
  it('debería iniciar sesión y redirigir a /home', async () => {
    mockAxios.onPost('http://localhost:8000/api/login').reply(200, {
      token: 'fake-token',
    });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(emailInput, { target: { value: 'test@test2' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home'); // Verifica la redirección
    });
  });
  it('should handle error when logging in', async () => {
    mockAxios.onPost('http://localhost:8000/api/login').reply(401, { error: 'Unauthorized' });
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const usernameInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const loginButton = screen.getByRole('button', { name: /login/i });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.click(loginButton);
    await waitFor(() => {
      expect(screen.getByText(/Error al iniciar sesión/i)).toBeInTheDocument();
    });
    expect(screen.queryByText(/Hello testUser!/i)).toBeNull();
    expect(screen.queryByText(/Your account was created on/i)).toBeNull();
  });
});
