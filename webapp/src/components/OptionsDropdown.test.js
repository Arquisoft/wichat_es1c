import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OptionsDropdown from './OptionsDropdown'; 
import { BrowserRouter } from 'react-router-dom';

const renderWithRouter = (ui) => {
  return render(
    <BrowserRouter
      future={{
        v7_startTransition: true, // Activa la transición de estado de v7
        v7_relativeSplatPath: true, // Activa la resolución de rutas relativas para v7
      }}
    >
      {ui}
    </BrowserRouter>
  );
};

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('OptionsDropdown Component', () => {
  it('debería renderizar correctamente con el botón "HELP"', async () => {
    renderWithRouter(<OptionsDropdown />);
    const helpButton = screen.getByText(/HELP/i);
    await waitFor(() => {
      expect(helpButton).toBeInTheDocument();
    });
  });

  it('debería abrir el menú al hacer clic en el botón "HELP"', async () => {
    renderWithRouter(<OptionsDropdown />);
    const helpButton = screen.getByText(/HELP/i);
    fireEvent.click(helpButton);
    await waitFor(() => {
      const faqOption = screen.getByText(/FAQ/i);
      expect(faqOption).toBeInTheDocument();
    });
  });

  it('debería navegar a la ruta "/faq" al hacer clic en la opción FAQ', async () => {
    renderWithRouter(<OptionsDropdown />);
    const helpButton = screen.getByText(/HELP/i);
    fireEvent.click(helpButton);
    const faqOption = screen.getByText(/FAQ/i);
    fireEvent.click(faqOption);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/faq');
    });
  });

  it('debería mostrar un mensaje de confirmación y luego navegar a "/login" al cerrar sesión', async () => {
    // Simula la respuesta del mensaje de confirmación (el usuario elige "OK")
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  
    renderWithRouter(<OptionsDropdown />);
    const logoutButton = screen.getByText(/Cerrar sesión/i);
  
    // Simula clic en el botón de cerrar sesión
    fireEvent.click(logoutButton);
  
    // Espera a que se llame a navigate con "/login" después de confirmar
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  
    // Restaurar la implementación original de window.confirm
    window.confirm.mockRestore();
  });
  

  it('debería navegar a "/home" cuando se presione el botón "Inicio"', async () => {
    renderWithRouter(<OptionsDropdown />);
    
    const homeButton = screen.getByText(/Inicio/i);
    fireEvent.click(homeButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });
  
});
