// UserAccount.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter } from 'react-router-dom';
import UserAccount from './UserAccount';

const mockAxios = new MockAdapter(axios);

describe('UserAccount component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
    localStorage.clear();
    localStorage.setItem('token', 'fake-token');
    localStorage.setItem('userName', 'Test User');
    localStorage.setItem('userEmail', 'test@example.com');
  });

  it('should render user data', async () => {
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, []);

    render(
      <BrowserRouter>
        <UserAccount />
      </BrowserRouter>
    );

    expect(await screen.findByText(/datos del usuario/i)).toBeInTheDocument();
    expect(screen.getByText(/usuario: test user/i)).toBeInTheDocument();
    expect(screen.getByText(/correo: test@example\.com/i)).toBeInTheDocument();
  });

  it('should allow editing and saving user profile', async () => {
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, []);
    mockAxios.onPut('http://localhost:8000/api/update-user').reply(200);

    render(
      <BrowserRouter>
        <UserAccount />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /editar perfil/i }));

    const nameInput = screen.getByLabelText(/nombre/i);
    const passwordInput = screen.getByLabelText(/contraseña actual/i);
    const saveButton = screen.getByRole('button', { name: /guardar/i });

    fireEvent.change(nameInput, { target: { value: 'Updated User' } });
    fireEvent.change(passwordInput, { target: { value: 'currentPassword' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/usuario: updated user/i)).toBeInTheDocument();
    });
  });

  it('should show error if password is missing on save', async () => {
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, []);

    render(
      <BrowserRouter>
        <UserAccount />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /editar perfil/i }));

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/debes ingresar tu contraseña actual/i)).toBeInTheDocument();
  });

  it('should show error if update fails', async () => {
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, []);
    mockAxios.onPut('http://localhost:8000/api/update-user').reply(500, {
      message: 'Error al actualizar el perfil.',
    });

    render(
      <BrowserRouter>
        <UserAccount />
      </BrowserRouter>
    );

    fireEvent.click(await screen.findByRole('button', { name: /editar perfil/i }));

    const passwordInput = screen.getByLabelText(/contraseña actual/i);
    fireEvent.change(passwordInput, { target: { value: 'wrongPassword' } });

    const saveButton = screen.getByRole('button', { name: /guardar/i });
    fireEvent.click(saveButton);

    expect(await screen.findByText(/error al actualizar el perfil/i)).toBeInTheDocument();
  });

});
