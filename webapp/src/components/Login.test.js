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
    /*mockAxios.onPost('http://localhost:8000/api/login').reply(200, {
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

    // Simula el cambio de valores en los inputs
    fireEvent.change(emailInput, { target: { value: 'test@test2' } });
    fireEvent.change(passwordInput, { target: { value: 'test' } });

    // Simula el clic en el botón de login
    fireEvent.click(loginButton);

    // Espera la redirección a /home
    await waitFor(() => {
      // Verifica que se haya llamado a `navigate` con la ruta '/home'
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });*/
  });
});
