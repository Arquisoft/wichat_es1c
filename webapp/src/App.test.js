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


