import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import Game from './Game';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter


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

    it('no guarda la puntuación si no hay token', async () => {
        localStorage.removeItem('token'); 
      
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));
      
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
      
        const correctBtn = screen.getByText('París');
        fireEvent.click(correctBtn);
        await act(async () => {
          jest.advanceTimersByTime(1750);
        });
      });
      
      it('no guarda la puntuación si faltan datos necesarios', async () => {
        localStorage.setItem('token', 'fake-jwt-token');
      
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));
      
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
      
        const wrongBtn = screen.getByText('Londres');
        fireEvent.click(wrongBtn);
        await act(async () => {
          jest.advanceTimersByTime(1750);
        });
      });
      
      it('maneja errores del servidor al guardar la puntuación', async () => {
        axios.post.mockRejectedValueOnce(new Error('Error del servidor'));
      
        render(<BrowserRouter><Game /></BrowserRouter>);
        fireEvent.click(screen.getByTestId('start-game'));
      
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
      
        const correctBtn = screen.getByText('París');
        fireEvent.click(correctBtn);
      
        await act(async () => {
          jest.advanceTimersByTime(1750);
        });
      });

      it('maneja el timeout correctamente', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        
        fireEvent.click(screen.getByTestId('start-game'));
    
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
        const timeoutButton = screen.getByTestId('timeout-button');
        fireEvent.click(timeoutButton);
    
        await waitFor(() => {
            expect(screen.getByText('Incorrecto.')).toBeInTheDocument();
        });
    });

    it('muestra las opciones de juego inicialmente y carga preguntas cuando comienza', async () => {
        render(<BrowserRouter><Game /></BrowserRouter>);
        expect(screen.getByTestId('start-game')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('start-game'));
        await waitFor(() => screen.getByText('¿Capital de Francia?'));
        expect(screen.getByText('¿Capital de Francia?')).toBeInTheDocument();
    });

    it('cambia el color de los botones dependiendo de la respuesta seleccionada', async () => {
    render(<BrowserRouter><Game /></BrowserRouter>);

    fireEvent.click(screen.getByTestId('start-game'));

    await waitFor(() => screen.getByText('¿Capital de Francia?'));

    const correctBtn = screen.getByText('París');
    fireEvent.click(correctBtn);

    await waitFor(() => {
        expect(screen.getByText('¡Correcto!')).toBeInTheDocument();
    });
    expect(correctBtn).toHaveStyle('background-color: rgb(76, 175, 80)');

    const wrongBtn = screen.getByText('Londres');
    expect(wrongBtn).toHaveStyle('background-color: rgb(25, 118, 210)');
});

it('muestra la respuesta correcta cuando el tiempo se acaba', async () => {
    render(<BrowserRouter><Game /></BrowserRouter>);

    fireEvent.click(screen.getByTestId('start-game'));

    await waitFor(() => screen.getByText('¿Capital de Francia?'));
    const timeoutButton = screen.getByTestId('timeout-button');
    fireEvent.click(timeoutButton);

    await waitFor(() => {
        expect(screen.getByText('Incorrecto.')).toBeInTheDocument();
    });
    expect(screen.getByText('París')).toBeInTheDocument();
});

it('muestra un mensaje de error si no se reciben preguntas del servidor', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<BrowserRouter><Game /></BrowserRouter>);

    fireEvent.click(screen.getByTestId('start-game'));
    await waitFor(() => screen.getByText('Cargando preguntas...'));
});


});
