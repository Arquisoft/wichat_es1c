const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./auth');

// authservice/auth.test.js

jest.mock('jsonwebtoken');

const app = express();
app.use(express.json());
app.get('/protected', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'Access granted', user: req.user });
});

describe('authenticateToken Middleware', () => {
  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Acceso denegado: No se proporcionó token');
  });

  it('should return 403 if token is invalid', async () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidToken');
    expect(response.statusCode).toBe(403);
    expect(response.body.message).toBe('Token inválido o expirado');
  });

  it('should call next if token is valid', async () => {
    const mockUserPayload = { id: 1, name: 'Test User' };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, mockUserPayload);
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer validToken');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user).toEqual(mockUserPayload);
  });
});