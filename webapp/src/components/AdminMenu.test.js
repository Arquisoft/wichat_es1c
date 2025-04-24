import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import AdminMenu from './AdminMenu';
import axios from 'axios';

jest.mock('axios');
jest.mock('./OptionsDropdown', () => () => <div>OptionsDropdown</div>);

const mockUsers = [
  { id: 1, name: 'Usuario Uno', email: 'uno@test.com', role: 'user' },
  { id: 2, name: 'Usuario Dos', email: 'dos@test.com', role: 'user' },
  { id: 3, name: 'Usuario Tres', email: 'tres@test.com', role: 'user' },
  { id: 4, name: 'Usuario Cuatro', email: 'cuatro@test.com', role: 'user' },
  { id: 5, name: 'Usuario Cinco', email: 'cinco@test.com', role: 'user' },
  { id: 6, name: 'Usuario Seis', email: 'seis@test.com', role: 'user' },
];

describe('AdminMenu Component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockUsers });
    axios.post.mockResolvedValue({ status: 200 });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza la lista de usuarios', async () => {
    render(<AdminMenu />);
    expect(await screen.findByText('Lista de Usuarios')).toBeInTheDocument();
    expect(await screen.findByText('Usuario Uno')).toBeInTheDocument();
    expect(screen.getByText('OptionsDropdown')).toBeInTheDocument();
  });

  test('renderiza loading mientras carga los datos', () => {
    axios.get.mockReturnValueOnce(new Promise(() => {})); 
    render(<AdminMenu />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('elimina un usuario y muestra mensaje de éxito', async () => {
    render(<AdminMenu />);
    const deleteButtons = await screen.findAllByRole('button', { name: 'Eliminar' });

    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Usuario eliminado correctamente')).toBeInTheDocument();
    });
  });

  test('muestra mensaje de error si falla al eliminar', async () => {
    axios.post.mockRejectedValueOnce(new Error('Error'));
    render(<AdminMenu />);
    const deleteButtons = await screen.findAllByRole('button', { name: 'Eliminar' });

    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByText('Error al eliminar el usuario')).toBeInTheDocument();
    });
  });
});
