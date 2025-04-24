import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./context/AuthContext', () => {
  return {
    AuthProvider: ({ children }) => children,
    useAuth: () => ({ user: { name: 'Test User' } }),
  };
});

describe('App Component', () => {
  test('renders correct link based on location.pathname', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/¿No tienes una cuenta\? Regístrate aquí\./i)).toBeInTheDocument();

    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/¿Ya tienes una cuenta\? Inicia sesión aquí\./i)).toBeInTheDocument();
  });

  test('renders Login component on "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  test('renders Register component on "/register" route', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/registrarse/i)).toBeInTheDocument();
  });

  test('has MUI baseline applied (CssBaseline)', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText(/¿No tienes una cuenta/i)).toBeInTheDocument();
  });
});
