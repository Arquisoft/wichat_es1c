// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Mock de dependencias
jest.mock('axios');
jest.mock('../context/AuthContext');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn()
}));

describe('Login Component', () => {
  const mockLogin = jest.fn();

  beforeEach(() => {
    useAuth.mockReturnValue({ login: mockLogin });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el formulario de login', () => {
    render(<Login />, { wrapper: MemoryRouter });
  
    expect(screen.getByTestId('login-title')).toBeInTheDocument();
  
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('muestra error si se intenta enviar con campos vacíos', async () => {
    render(<Login />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    await waitFor(() => {
      expect(screen.getByText(/completa todos los campos/i)).toBeInTheDocument();
    });
  });

  it('realiza login exitoso y redirige', async () => {
    axios.post.mockResolvedValue({ data: { token: '123456' } });

    render(<Login />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@mail.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: '1234' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
      expect(localStorage.getItem('token')).toBe('123456');
    });
  });

  it('muestra mensaje de error si el login falla', async () => {
    axios.post.mockRejectedValue({ response: { data: { message: 'Credenciales inválidas' } } });

    render(<Login />, { wrapper: MemoryRouter });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@mail.com' } });
    fireEvent.change(screen.getByLabelText(/contraseña/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  it('permite mostrar y ocultar la contraseña', () => {
    render(<Login />, { wrapper: MemoryRouter });
    const toggleBtn = screen.getByTestId('toggle-password');
    const passwordInput = screen.getByLabelText(/contraseña/i);
  
    fireEvent.mouseDown(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  
    fireEvent.mouseUp(toggleBtn);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
  
});
