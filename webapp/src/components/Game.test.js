import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { MemoryRouter } from 'react-router-dom';
import Game from '../components/Game';

global.crypto = {
  getRandomValues: (arr) => require('crypto').randomFillSync(arr),
};

const mockAxios = new MockAdapter(axios);

jest.mock('react-chatbotify', () => () => <div>Chatbot Mock</div>);


const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

describe('Game component', () => {
  beforeEach(() => {
    mockAxios.reset();
  });

  it('debería mostrar contenido del juego después de cargar', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: 'Pregunta simulada|https://via.placeholder.com/150',
        correctAnswer: 'OpciónCorrecta',
        allAnswers: 'OpciónCorrecta,Opción2,Opción3,Opción4'
      }
    ]);

    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando preguntas/i)).toBeInTheDocument();

    await waitFor(() => {
      
      expect(screen.getByText('OpciónCorrecta')).toBeInTheDocument();
      expect(screen.getByText('Opción2')).toBeInTheDocument();
      expect(screen.getByText('Opción3')).toBeInTheDocument();
      expect(screen.getByText('Opción4')).toBeInTheDocument();
    });
  });

  it('debería mostrar un mensaje de carga mientras se obtienen las preguntas', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, []);
    
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );

    expect(screen.getByText(/Cargando preguntas.../i)).toBeInTheDocument();
  });

  it('debería mostrar un mensaje de carga mientras se obtienen las preguntas', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: '¿De qué país es esta bandera?|https://via.placeholder.com/150',
        correctAnswer: 'España',
        allAnswers: 'España,Francia,Italia,Alemania'
      }
    ]);
  
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );
  
    expect(screen.getByText(/Cargando preguntas.../i)).toBeInTheDocument();
  
    await waitFor(() =>
      expect(screen.getByText(/¿De qué país es esta bandera\?/i)).toBeInTheDocument()
    );
  });
  
  it('debería renderizar correctamente el contenido del juego y manejar respuesta correcta', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: '¿De qué país es esta bandera?|https://via.placeholder.com/150',
        correctAnswer: 'España',
        allAnswers: 'España,Francia,Alemania,Italia'
      }
    ]);
  
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );
  
    await waitFor(() =>
      expect(screen.queryByText(/Cargando preguntas/i)).not.toBeInTheDocument()
    );
  
    
    expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://via.placeholder.com/150');
    expect(screen.getByText('España')).toBeInTheDocument();
  
   
    const correctButton = screen.getByText('España');
    fireEvent.click(correctButton);
  
    
    await waitFor(() =>
      expect(screen.getByText('¡Correcto!')).toBeInTheDocument()
    );
  
    
    expect(correctButton).toHaveStyle('background-color: #4caf50');
  });
  


  it('debería renderizar correctamente el contenido del juego y manejar respuesta incorrecta', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: '¿De qué país es esta bandera?|https://via.placeholder.com/150',
        correctAnswer: 'España',
        allAnswers: 'España,Francia,Alemania,Italia'
      }
    ]);
  
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );
  
    await waitFor(() =>
      expect(screen.queryByText(/Cargando preguntas/i)).not.toBeInTheDocument()
    );
  
    expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
  
    const correctButton = screen.getByText('España');
    const wrongButton = screen.getByText('Francia');
  
    
    fireEvent.click(wrongButton);
  
   
    await waitFor(() =>
      expect(screen.getByText('Incorrecto.')).toBeInTheDocument()
    );
  
    
    expect(wrongButton).toHaveStyle('background-color: #f44336');
    expect(correctButton).toHaveStyle('background-color: #4caf50');
  });
  
  

  it('debería mostrar el contador del temporizador al iniciar el juego', async () => {
    mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
      {
        title: '¿De qué país es esta bandera?|https://via.placeholder.com/150',
        correctAnswer: 'España',
        allAnswers: 'España,Francia,Alemania,Italia'
      }
    ]);
  
    render(
      <MemoryRouter>
        <Game />
      </MemoryRouter>
    );
  
    
    await waitFor(() =>
      expect(screen.queryByText(/Cargando preguntas/i)).not.toBeInTheDocument()
    );
  
    
    const timer = await screen.findByText((text) => /^\d+s$/.test(text));
    expect(timer).toBeInTheDocument();
  });
  
  it('debería renderizar correctamente el contenido del juego y manejar respuesta correcta', async () => {
  mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
    {
      title: '¿De qué país es esta bandera?|https://via.placeholder.com/150',
      correctAnswer: 'España',
      allAnswers: 'España,Francia,Alemania,Italia'
    }
  ]);

  render(
    <MemoryRouter>
      <Game />
    </MemoryRouter>
  );

  await waitFor(() =>
    expect(screen.queryByText(/Cargando preguntas/i)).not.toBeInTheDocument()
  );

  
  expect(screen.getByText('¿De qué país es esta bandera?')).toBeInTheDocument();
  expect(screen.getByRole('img')).toHaveAttribute('src', 'https://via.placeholder.com/150');
  expect(screen.getByText('España')).toBeInTheDocument();

  
  const correctButton = screen.getByText('España');
  fireEvent.click(correctButton);

  
  await waitFor(() =>
    expect(screen.getByText('¡Correcto!')).toBeInTheDocument()
  );

  
  expect(correctButton).toHaveStyle('background-color: #4caf50');
});


it('debería completar una partida y mostrar el mensaje de juego terminado', async () => {
  mockAxios.onGet('http://localhost:8000/api/generate-questions').reply(200, [
    {
      title: 'Pregunta 1|https://via.placeholder.com/150',
      correctAnswer: 'Correcta1',
      allAnswers: 'Correcta1,OpciónA,OpciónB,OpciónC'
    },
    {
      title: 'Pregunta 2|https://via.placeholder.com/150',
      correctAnswer: 'Correcta2',
      allAnswers: 'Correcta2,OpciónX,OpciónY,OpciónZ'
    }
  ]);

  render(
    <MemoryRouter>
      <Game />
    </MemoryRouter>
  );

  
  await waitFor(() =>
    expect(screen.queryByText(/Cargando preguntas/i)).not.toBeInTheDocument()
  );

  
  fireEvent.click(screen.getByText('Correcta1'));

 
  const secondAnswer = await screen.findByText('Correcta2', {}, { timeout: 3000 });
  expect(secondAnswer).toBeInTheDocument();

  
  fireEvent.click(secondAnswer);

  
  await waitFor(() => {
    expect(screen.getByText(/¡Juego terminado!/i)).toBeInTheDocument();
    expect(screen.getByText(/Puntuación:/i)).toBeInTheDocument();
    expect(screen.getByText('Volver a Inicio')).toBeInTheDocument();
  }, { timeout: 3000 });
});






});
