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

  it('debería navegar a "/home" cuando se presione el botón "Inicio"', async () => {
    renderWithRouter(<OptionsDropdown />);
    
    const homeButton = screen.getByText(/Inicio/i);
    fireEvent.click(homeButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('debería navegar a "/ranking" cuando se presione el botón "Ranking"', async () => {
    renderWithRouter(<OptionsDropdown />);
    
    const homeButton = screen.getByText(/Ranking/i);
    fireEvent.click(homeButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/ranking');
    });
  });

  it('debería navegar a "/user-account" cuando se presione el botón "Mi Cuenta"', async () => {
    renderWithRouter(<OptionsDropdown />);
    
    const homeButton = screen.getByText(/Mi cuenta/i);
    fireEvent.click(homeButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/user-account');
    });
  });

  it('debería navegar a "/game" cuando se presione el botón "Juego"', async () => {
    renderWithRouter(<OptionsDropdown />);
    
    const homeButton = screen.getByText(/Juego/i);
    fireEvent.click(homeButton);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/game');
    });
  });
  
});
