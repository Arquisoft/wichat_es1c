import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQ from './Faq';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('FAQ Component', () => {
  it('renders the FAQ title', () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
    expect(screen.getByText(/Preguntas Frecuentes/i)).toBeInTheDocument();
  });

  it('renders all FAQ questions', () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
    const questions = [
      "¿Cómo jugar al juego?",
      "¿Puedo jugar más de una vez?",
      "¿Cómo sé si he respondido correctamente?",
      "¿Dónde puedo ver mi puntuacion?",
      "¿El juego es gratuito?",
      "¿Puedo cambiar mi respuesta después de seleccionarla?",
      "¿Qué sucede cuando termino el juego?",
    ];
    questions.forEach((question) => {
      expect(screen.getByText(question)).toBeInTheDocument();
    });
  });
});