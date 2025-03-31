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
            req.user = { userId: '507f1f77bcf86cd799439011' }; // Mock userId
            next();
        });

        app.locals.db = dbMock;
        app.use(express.json());
        app.use('/home', homeRoute({ express, ObjectId, authenticateToken: authenticateTokenMock }));
    });

    it('should return 200 and welcome message if user is found', async () => {
        dbMock.collection().findOne.mockResolvedValue({ _id: new ObjectId('507f1f77bcf86cd799439011'), name: 'John Doe' });

        const response = await request(app).get('/home');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Bienvenido John Doe' });
    });

    it('should return 404 if user is not found', async () => {
        dbMock.collection().findOne.mockResolvedValue(null);

        const response = await request(app).get('/home');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: 'Usuario no encontrado' });
    });
});