import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import userEvent from '@testing-library/user-event';

const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <p data-testid="auth-status">
        {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
      </p>
      <button onClick={login} data-testid="login-button">Login</button>
      <button onClick={logout} data-testid="logout-button">Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('debería mostrar "Not Authenticated" por defecto', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authStatus = screen.getByTestId('auth-status');
    expect(authStatus.textContent).toBe('Not Authenticated');
  });

  it('debería cambiar a "Authenticated" después de llamar a login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authStatus = screen.getByTestId('auth-status');
    const loginButton = screen.getByTestId('login-button');

    expect(authStatus.textContent).toBe('Not Authenticated');

    await userEvent.click(loginButton);

    expect(authStatus.textContent).toBe('Authenticated');
  });

  it('debería cambiar a "Not Authenticated" después de llamar a logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const authStatus = screen.getByTestId('auth-status');
    const loginButton = screen.getByTestId('login-button');
    const logoutButton = screen.getByTestId('logout-button');

    await userEvent.click(loginButton);
    expect(authStatus.textContent).toBe('Authenticated');

    await userEvent.click(logoutButton);
    expect(authStatus.textContent).toBe('Not Authenticated');
  });
});