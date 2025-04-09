import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import Register from './Register'; 

const mockAxios = new MockAdapter(axios);
const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Register component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
  });

  it('should register user and redirect to /home', async () => {
    mockAxios.onPost('http://localhost:8000/api/register').reply(200, {
      token: 'fake-token',
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const nameInput = screen.getByLabelText(/nombre/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/^contraseña$/i); 
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const registerButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should show error if passwords do not match', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const passwordInput = screen.getByLabelText(/^contraseña$/i);
    const confirmPasswordInput = screen.getByLabelText(/confirmar contraseña/i);
    const registerButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument();
    });
  });

  it('should handle server error when registering user', async () => {
    mockAxios.onPost('http://localhost:8000/api/register').reply(500, {
      message: 'Error al registrarse',
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/^contraseña$/i), { target: { value: 'testPassword' } });
    fireEvent.change(screen.getByLabelText(/confirmar contraseña/i), { target: { value: 'testPassword' } });

    fireEvent.click(screen.getByRole('button', { name: /registrarse/i }));

    await waitFor(() => {
      expect(screen.getByText(/error al registrarse/i)).toBeInTheDocument();
    });
  });
});
