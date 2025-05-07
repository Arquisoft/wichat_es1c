import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

jest.mock('react-dom/client', () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

jest.mock('./App', () => () => <div>Mocked App</div>);

describe('index.js', () => {
  it('renders the App component inside BrowserRouter', () => {
    const mockRoot = {
      render: jest.fn(),
    };
    ReactDOM.createRoot.mockReturnValue(mockRoot);

    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById('root');

    require('./index');

    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

    expect(mockRoot.render).toHaveBeenCalledWith(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  });
});