import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

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
});