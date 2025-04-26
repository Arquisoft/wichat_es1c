import { render, screen, fireEvent } from '@testing-library/react';
import UserAccount from './UserAccount';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

jest.mock('axios');
jest.mock('jwt-decode', () => jest.fn());
jest.mock('./OptionsDropdown', () => () => <div>OptionsDropdown</div>);

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('UserAccount Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userName', 'Usuario');
    localStorage.setItem('userEmail', 'test@testing');

    jwtDecode.mockReturnValue({ sub: '123' });

    axios.get.mockResolvedValue({
      data: [
        { email: 'test@testing', correct: 8, wrong: 2, timestamp: Date.now() },
        { email: 'test@testing', correct: 7, wrong: 3, timestamp: Date.now() - 1000 },
      ]
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders user info correctly', async () => {
    render(<UserAccount />);
    expect(await screen.findByText(/Usuario: Usuario/)).toBeInTheDocument();
    expect(screen.getByText(/Correo: test@testing/)).toBeInTheDocument();
  });

  test('muestra estadísticas del usuario correctamente', async () => {
    render(<UserAccount />);
    expect(await screen.findByText(/Total de partidas jugadas: 2/)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas acertadas: 15/)).toBeInTheDocument();
    expect(screen.getByText(/Preguntas falladas: 5/)).toBeInTheDocument();
    expect(screen.getByText(/Total de preguntas: 20/)).toBeInTheDocument();
    expect(screen.getByText(/Porcentaje de aciertos: 75.00%/)).toBeInTheDocument();
  });

  test('muestra el componente OptionsDropdown', async () => {
    render(<UserAccount />);
    expect(await screen.findByText('OptionsDropdown')).toBeInTheDocument();
  });

  test('renderiza el gráfico correctamente', async () => {
    render(<UserAccount />);
    expect(await screen.findByText(/Total de partidas jugadas: 2/)).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument(); 
  }); 

  test('permite editar el perfil y cancelar los cambios', async () => {
    render(<UserAccount />);
    expect(await screen.findByText(/Usuario: Usuario/)).toBeInTheDocument();
  
    const editButton = screen.getByText(/Editar Perfil/i);
    editButton.click();
  
    const cancelButton = await screen.findByText(/Cancelar/i);
    cancelButton.click();
    
    expect(await screen.findByText(/Usuario: Usuario/)).toBeInTheDocument();
    expect(screen.getByText(/Correo: test@testing/)).toBeInTheDocument();
  });

  test('carga correctamente las estadísticas del usuario', async () => {
    localStorage.setItem('userEmail', 'test@testing');
    render(<UserAccount />);
  
    expect(await screen.findByText(/Total de partidas jugadas: 2/)).toBeInTheDocument();
  });
  test('renderiza correctamente el gráfico de estadísticas', async () => {
    render(<UserAccount />);
  
    expect(await screen.findByText(/Total de partidas jugadas: 2/)).toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument(); 
  });
  test('muestra datos del tooltip del gráfico', async () => {
    render(<UserAccount />);
    expect(await screen.findByText(/75.00%/)).toBeInTheDocument(); // Uno de los puntos del gráfico
  });
  
  test('permite editar y guardar cambios del perfil', async () => {
    render(<UserAccount />);
    const editButton = await screen.findByText(/Editar Perfil/);
    fireEvent.click(editButton);
  
    // Espera que aparezca el input
    const nameInput = await screen.findByLabelText(/Nombre/i);
    fireEvent.change(nameInput, { target: { value: 'Nuevo Nombre' } });
  
    const currentPasswordInput = screen.getByLabelText(/Contraseña actual/i);
    fireEvent.change(currentPasswordInput, { target: { value: '123456' } });
  
    const saveButton = screen.getByText(/Guardar/i);
  
    axios.put.mockResolvedValueOnce({}); // mockeamos éxito
    fireEvent.click(saveButton);
  
    expect(axios.put).toHaveBeenCalled();
  });

  test('maneja error al decodificar token', async () => {
    jwtDecode.mockImplementation(() => { throw new Error('Token inválido'); });
    render(<UserAccount />);
    expect(screen.queryByText(/Usuario/)).not.toBeInTheDocument();
  });
  
  test('no muestra estadísticas si no hay partidas', async () => {
  axios.get.mockResolvedValueOnce({ data: [] });
  
  render(<UserAccount />);
  
  expect(await screen.queryByText(/Total de partidas jugadas/)).not.toBeInTheDocument();
});

});
