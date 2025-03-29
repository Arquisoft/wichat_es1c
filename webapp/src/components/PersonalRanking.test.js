import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import PersonalRanking from './PersonalRanking';
import { MemoryRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

jest.mock('jwt-decode', () => jest.fn());

const mockAxios = new MockAdapter(axios);

describe('PersonalRanking component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAxios.reset();
    localStorage.setItem('token', 'fake-token');
  });

  it('should display user ranking data when API call is successful', async () => {
    jwtDecode.mockReturnValue({ email: 'test@example.com' });
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, [
      { email: 'test@example.com', correct: 5, wrong: 2, totalTime: 60, timestamp: 1710000000 },
      { email: 'test@example.com', correct: 7, wrong: 1, totalTime: 50, timestamp: 1710001000 },
    ]);

    render(
      <MemoryRouter>
        <PersonalRanking />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/Correctas: 5/i)).toBeInTheDocument());
    expect(screen.getByText(/Correctas: 7/i)).toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    jwtDecode.mockReturnValue({ email: 'test@example.com' });
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(500);

    render(
      <MemoryRouter>
        <PersonalRanking />
      </MemoryRouter>
    );
  });

  it('should display a message when no games are found', async () => {
    jwtDecode.mockReturnValue({ email: 'test@example.com' });
    mockAxios.onGet('http://localhost:8000/api/ranking').reply(200, []);

    render(
      <MemoryRouter>
        <PersonalRanking />
      </MemoryRouter>
    );
  });
});
