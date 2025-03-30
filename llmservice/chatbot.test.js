process.env.GEMINI_API_KEY = 'fake-api-key';

const request = require('supertest');
const axios = require('axios');
const express = require('express');


const app = require('./chatbot'); 

jest.mock('axios');

describe('Chatbot Service', () => {
  afterAll(() => {
    if (app?.close) app.close(); 
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('responde correctamente con el modelo gemini', async () => {
   
    axios.post.mockResolvedValue({
      data: {
        candidates: [
          {
            content: {
              parts: [
                { text: 'Esta es una pista sobre el país.' }
              ]
            }
          }
        ]
      }
    });

    const res = await request(app)
      .post('/')
      .send({
        question: '¿Cuál es la pista?',
        model: 'gemini',
        systemMessage: 'Eres un asistente de prueba'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.answer).toBe('Esta es una pista sobre el país.');
  });

  it('retorna error 400 si faltan parámetros', async () => {
    const res = await request(app)
      .post('/')
      .send({ question: 'Hola' }); 

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Faltan campos requeridos/);
  });

  it('maneja errores internos y responde con mensaje por defecto', async () => {
    axios.post.mockRejectedValue(new Error('Algo fue mal'));

    const res = await request(app)
      .post('/')
      .send({
        question: '¿Qué pasa si falla?',
        model: 'gemini'
      });

    expect(res.statusCode).toBe(200); 
    expect(res.body.answer).toBe('Lo siento, no puedo responder en este momento.');
  });
});
