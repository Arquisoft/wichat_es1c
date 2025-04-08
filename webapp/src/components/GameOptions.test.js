import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameOptions from './GameOptions';

describe('GameOptions', () => {
  const mockSetQuestionType = jest.fn();
  const mockSetResponseTime = jest.fn();
  const mockOnStartGame = jest.fn();

  const renderComponent = () => render(
    <GameOptions
      questionType="general"
      setQuestionType={mockSetQuestionType}
      responseTime={30}
      setResponseTime={mockSetResponseTime}
      onStartGame={mockOnStartGame}
    />
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe cambiar el tiempo de respuesta', () => {
    renderComponent();

    const input = screen.getByLabelText(/Tiempo por Pregunta/i);
    fireEvent.change(input, { target: { value: 45 } });

    expect(mockSetResponseTime).toHaveBeenCalledWith(45);
  });

  test('debe ejecutar onStartGame al hacer clic en "Iniciar Juego"', () => {
    renderComponent();

    const startButton = screen.getByText(/Iniciar Juego/i);
    fireEvent.click(startButton);

    expect(mockOnStartGame).toHaveBeenCalled();
  });

  test('debe volver al menú principal al hacer clic en el botón correspondiente', () => {
    delete window.history;
    window.history = { back: jest.fn() };

    renderComponent();

    const backButton = screen.getByText(/Volver al Menú Principal/i);
    fireEvent.click(backButton);

    expect(window.history.back).toHaveBeenCalled();
  });
});
