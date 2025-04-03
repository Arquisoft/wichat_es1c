const request = require('supertest');
const express = require('express');
const { ObjectId } = require('mongodb');
const homeRoute = require('./home');

describe('GET /home', () => {
    let app, dbMock, authenticateTokenMock;

    beforeEach(() => {
        app = express();
        dbMock = {
            collection: jest.fn().mockReturnValue({
                findOne: jest.fn(),
            }),
        };
        authenticateTokenMock = jest.fn((req, res, next) => {
            req.user = { userId: '64b5f0c2f5d3c2a1b8e4d123' }; // Mock user ID
            next();
        });
        app.locals.db = dbMock;
        app.use(express.json());
        app.use('/api', homeRoute({ express, ObjectId, authenticateToken: authenticateTokenMock }));
    });

    it('should return 200 and welcome message if user is found', async () => {
        dbMock.collection().findOne.mockResolvedValue({ _id: new ObjectId('64b5f0c2f5d3c2a1b8e4d123'), name: 'John Doe' });

        const response = await request(app).get('/api/home');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Bienvenido John Doe' });
    });

    it('should return 404 if user is not found', async () => {
        dbMock.collection().findOne.mockResolvedValue(null);

        const response = await request(app).get('/api/home');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Usuario no encontrado' });
    });

    it('should return 500 if there is a server error', async () => {
        dbMock.collection().findOne.mockRejectedValue(new Error('Database error'));

        const response = await request(app).get('/api/home');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: 'Error interno del servidor' });
    });

    it('should call authenticateToken middleware', async () => {
        dbMock.collection().findOne.mockResolvedValue({ _id: new ObjectId('64b5f0c2f5d3c2a1b8e4d123'), name: 'John Doe' });

        await request(app).get('/api/home');

        expect(authenticateTokenMock).toHaveBeenCalled();
    });
});