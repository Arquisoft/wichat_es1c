import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Game from './Game';

// Mock de axios
jest.mock('axios');
jest.mock('./Chatbot', () => () => <div>Chatbot</div>);
jest.mock('./Timer', () => ({ onTimeOut }) => {
    // Simulamos el timeout manualmente
    return (
        <button data-testid="timeout-button" onClick={() => onTimeOut()}>
            Simular Timeout
        </button>
    );
});
jest.mock('./GameOptions', () => ({ onStartGame }) => (
    <div>
        <button data-testid="start-game" onClick={onStartGame}>Iniciar Juego</button>
    </div>
));

const mockQuestions = [
    {
        title: '¿Capital de Francia?|paris.jpg',
        correctAnswer: 'París',
        allAnswers: 'París,Londres,Berlín,Madrid'
    },
    {
        title: '¿Capital de España?|madrid.jpg',
        correctAnswer: 'Madrid',
        allAnswers: 'Roma,Madrid,Lisboa,Atenas'
    }
];

describe('Game component', () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: mockQuestions });
        axios.post.mockResolvedValue({ status: 200, data: { message: "Guardado" } });
        localStorage.setItem('token', 'fake-jwt-token');
    });

    it('muestra las opciones de juego inicialmente', () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        expect(screen.getByTestId('start-game')).toBeInTheDocument();
    });

    it('carga preguntas y muestra la primera', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);

        fireEvent.click(screen.getByTestId('start-game'));

        await waitFor(() => {
            expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
        });
    });

    it('selecciona respuesta correcta y muestra mensaje', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));

        await waitFor(() => screen.getByText('¿Capital de Francia?'));

        const correctBtn = screen.getByText('París');
        fireEvent.click(correctBtn);

        await waitFor(() => {
            expect(screen.getByText('¡Correcto!')).toBeInTheDocument();
        });
    });

    it('selecciona respuesta incorrecta y muestra mensaje', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));

        await waitFor(() => screen.getByText('¿Capital de Francia?'));

        const wrongBtn = screen.getByText('Londres');
        fireEvent.click(wrongBtn);

        await waitFor(() => {
            expect(screen.getByText('Incorrecto.')).toBeInTheDocument();
        });
    });

    it('cambia a la vista del juego cuando se inicia', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));
    
        await waitFor(() => {
            expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
        });
    });

    it('reproduce sonido correcto al seleccionar respuesta correcta', async () => {
        const audioMock = jest.spyOn(window.HTMLAudioElement.prototype, 'play').mockImplementation(() => {});
    
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));
    
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
    
        const correctBtn = screen.getByText('París');
    
        fireEvent.click(correctBtn);
    
        await waitFor(() => {
            expect(audioMock).toHaveBeenCalled();
            expect(audioMock).toHaveBeenCalledWith();
        });
    
        audioMock.mockRestore(); 
    });
    
});
