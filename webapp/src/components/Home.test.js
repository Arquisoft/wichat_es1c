import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from './Home';

jest.mock('./OptionsDropdown', () => () => <div data-testid="options-dropdown">OptionsDropdown</div>);
jest.mock('./PersonalRanking', () => () => <div data-testid="personal-ranking">PersonalRanking</div>);

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders OptionsDropdown and PersonalRanking components', () => {
    render(<Home />);
    expect(screen.getByTestId('options-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('personal-ranking')).toBeInTheDocument();
  });

  test('displays welcome message when userName is in localStorage', () => {
    localStorage.setItem('userName', 'Alejandro');
    render(<Home />);
    expect(screen.getByText('¡Bienvenido de nuevo, Alejandro!')).toBeInTheDocument();
    expect(
      screen.getByText('Nos alegra verte de nuevo. Explora tus rankings y disfruta de la experiencia de WiChat.')
    ).toBeInTheDocument();
  });

  test('does not display welcome message when userName is not in localStorage', () => {
    render(<Home />);
    expect(screen.queryByText(/¡Bienvenido de nuevo,/)).not.toBeInTheDocument();
  });
});