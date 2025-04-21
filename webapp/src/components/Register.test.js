import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register'; 
const mockAxios = new MockAdapter(axios);
const mockedNavigate = jest.fn();
import { BrowserRouter } from 'react-router-dom';

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
    const nameInput = screen.getByLabelText(/Nombre/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    const passwordInput_2 = screen.getByLabelText(/Confirmar/i);  
    const registerButton = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.change(nameInput, { target: { value: 'testUser' } });
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordInput_2, { target: { value: 'testPassword' } });
    fireEvent.click(registerButton);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should handle error when adding user', async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
      );
      const usernameInput = screen.getByLabelText(/Nombre/i);
      const passwordInput = screen.getByLabelText(/Contraseña/i);  
      const passwordInput_2 = screen.getByLabelText(/Confirmar/i);  
      const addUserButton = screen.getByRole('button', { name: /Registrarse/i });  
    mockAxios.onPost('http://localhost:8000/api/register').reply(500, { error: 'Internal Server Error' });
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });
    fireEvent.change(passwordInput_2, { target: { value: 'testPassword' } });
    fireEvent.click(addUserButton);
    await waitFor(() => {
      expect(screen.getByText(/Error al registrarse/i)).toBeInTheDocument();
    });
  });
});
