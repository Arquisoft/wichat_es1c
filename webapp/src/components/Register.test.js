import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
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
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByTestId('nombre-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('pass-input');
    const confirmPasswordInput = screen.getByTestId('confirm-pass-input');
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

  it('should handle error when user already exists', async () => {
    mockAxios.onPost('http://localhost:8000/api/register').reply(409, {
      message: 'El usuario ya existe',
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByTestId('nombre-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('pass-input');
    const confirmPasswordInput = screen.getByTestId('confirm-pass-input');
    const registerButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/el usuario ya existe/i)).toBeInTheDocument();
    });
  });

  it('should handle generic registration error', async () => {
    mockAxios.onPost('http://localhost:8000/api/register').reply(500, {
      message: 'Error al registrarse',
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    const nameInput = screen.getByTestId('nombre-input');
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('pass-input');
    const confirmPasswordInput = screen.getByTestId('confirm-pass-input');
    const registerButton = screen.getByRole('button', { name: /registrarse/i });

    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'testPassword' } });
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByText(/error al registrarse/i)).toBeInTheDocument();
    });
  });
});
