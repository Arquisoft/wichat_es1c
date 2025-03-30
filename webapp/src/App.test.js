import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

test('renders welcome message', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const welcomeMessage = screen.getByText(/Modo Claro/i);
  expect(welcomeMessage).toBeInTheDocument();
});

test('renders Dark Mode', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const modeButton = screen.getByRole('button', { name: /Modo Claro/i });
  fireEvent.click(modeButton);
  const welcomeMessage = screen.getByText(/Modo Oscuro/i);
  expect(welcomeMessage).toBeInTheDocument();
});

// Nueva prueba: Verifica que la navegación funciona correctamente
test('navigates to another page', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  // Busca el enlace de navegación
  const navLink = screen.getByRole('link', { name: /Ir a otra página/i }); // Ajusta el texto según el enlace real
  expect(navLink).toBeInTheDocument(); // Verifica que el enlace está presente

  // Simula el clic en el enlace
  fireEvent.click(navLink);

  // Espera a que el contenido de la nueva página se renderice
  const newPageContent = await screen.findByText(/Contenido de la nueva página/i); // Ajusta el texto según el contenido real
  expect(newPageContent).toBeInTheDocument();
});

// Nueva prueba: Verifica que el botón de modo claro/oscuro alterna correctamente
test('toggles between Dark Mode and Light Mode', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const modeButton = screen.getByRole('button', { name: /Modo Claro/i });
  fireEvent.click(modeButton);
  expect(screen.getByText(/Modo Oscuro/i)).toBeInTheDocument();

  fireEvent.click(modeButton);
  expect(screen.getByText(/Modo Claro/i)).toBeInTheDocument();
});


