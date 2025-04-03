import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

describe('App Component Tests', () => {
  test('renders welcome message', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const welcomeMessage = screen.getByText(/modo claro/i);
    expect(welcomeMessage).toBeInTheDocument();
  });

  test('renders Dark Mode', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const modeButton = screen.getByRole('button', { name: /modo claro/i });
    fireEvent.click(modeButton);
    
    expect(screen.getByText(/modo oscuro/i)).toBeInTheDocument();
  });

  test('toggles between Dark Mode and Light Mode', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    const modeButton = screen.getByRole('button', { name: /modo claro/i });
    
    fireEvent.click(modeButton);
    expect(screen.getByText(/modo oscuro/i)).toBeInTheDocument();
    
    fireEvent.click(modeButton);
    expect(screen.getByText(/modo claro/i)).toBeInTheDocument();
  });

  /*test('prevents navigation to /home without authentication', async () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Intentar acceder a la ruta protegida directamente
    window.history.pushState({}, '', '/home');

    // Verificar que se muestra un mensaje de redirección o la pantalla de login
    expect(await screen.findByText(/login/i)).toBeInTheDocument();
  });*/

});
