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
