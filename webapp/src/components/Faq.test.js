import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FAQ from './Faq';
import { useNavigate } from 'react-router-dom';
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('FAQ component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  it('should render the FAQ section correctly', () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
    expect(screen.getByText(/Preguntas Frecuentes/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Cómo jugar al juego?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Puedo jugar más de una vez?/i)).toBeInTheDocument();
    expect(screen.getByText(/¿Cómo sé si he respondido correctamente?/i)).toBeInTheDocument();
  });

  it('should navigate to /home when the "Volver a Inicio" button is clicked', async () => {
    const mockedNavigate = jest.fn();
    useNavigate.mockImplementation(() => mockedNavigate);

    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
    const goHomeButton = screen.getByRole('button', { name: /Volver a Inicio/i });
    fireEvent.click(goHomeButton);
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('should expand and collapse an FAQ item when clicked', () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
    const question = screen.getByText(/¿Cómo jugar al juego?/i);
    const answer = screen.getByText(/Solo selecciona la respuesta correcta/i);
    expect(question.closest('div[aria-expanded="false"]')).toBeInTheDocument();
    fireEvent.click(question);
    expect(question.closest('div[aria-expanded="true"]')).toBeInTheDocument();
    expect(answer).toBeVisible(); 
    fireEvent.click(question);
    expect(question.closest('div[aria-expanded="false"]')).toBeInTheDocument();
  });

  it('should change button style on hover', async () => {
    render(
      <MemoryRouter>
        <FAQ />
      </MemoryRouter>
    );
  
    const goHomeButton = screen.getByRole('button', { name: /Volver a Inicio/i });
    fireEvent.mouseEnter(goHomeButton);
    expect(goHomeButton).toHaveStyle('transform: scale(1.1)');
    expect(goHomeButton).toHaveStyle('background-color: #3b82f6');
    fireEvent.mouseLeave(goHomeButton);
    expect(goHomeButton).toHaveStyle('transform: scale(1)');
    expect(goHomeButton).toHaveStyle('background-color: #1976d2');
  });
  
  
});
