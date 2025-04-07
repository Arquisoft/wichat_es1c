// ProtectedRoute.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Mock del hook useAuth
jest.mock('../context/AuthContext');

describe('ProtectedRoute', () => {
  it('muestra los children si el usuario está autenticado', () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('redirige al inicio si el usuario no está autenticado', () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <ProtectedRoute>
          <div>Contenido protegido</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
  });
});
