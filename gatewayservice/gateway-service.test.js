const request = require('supertest');
const axios = require('axios');
const app = require('./gateway-service'); 

afterAll(async () => {
    app.close();
  });

jest.mock('axios');

describe('Gateway Service', () => {
  // Mock responses from external services
  axios.post.mockImplementation((url, data) => {
    console.log('Called axios.post with URL:', url);
    if (url.endsWith('/api/login')) {
      return Promise.resolve({ data: { token: 'mockedToken' } });
    } else if (url.endsWith('/api/register')) {
      return Promise.resolve({ data: { userId: 'mockedUserId' } });
    } else if (url === 'http://localhost:8003/') {
      return Promise.resolve({ data: { answer: 'llmanswer' } });
    } else if (url.endsWith('/saveScore')) {
      return Promise.resolve({ data: { questions: 'questions' } });
    } 
  });

  axios.get.mockImplementation((url) => {
    console.log('Called axios.get with URL:', url);
    if (url.endsWith('/generateQuestions')) {
      return Promise.resolve({ data: { questions: 'questions' } });
    } else if (url.endsWith('/ranking')) {
      return Promise.resolve({
        data: [
          { username: 'user1', correct: 10, totalTime: 300 },
          { username: 'user2', correct: 8, totalTime: 250 },
          { username: 'user3', correct: 10, totalTime: 280 },
        ]
      });
    } else if (url.endsWith('/health')){
      return Promise.resolve({ data: { status: 'OK' } });
    }
  });

  // Test /health endpoint
  it('should say OK to the request', async () => {
    const response = await request(app)
      .get('/health')

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('OK');
  });

  // Test /login endpoint
  it('should forward login request to auth service', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: 'test@user', password: 'testpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.token).toBe('mockedToken');
  });

  // Test /adduser endpoint
  it('should forward add user request to user service', async () => {
    const response = await request(app)
      .post('/api/register')
      .send({ name: 'newuser', email: "newuser@newuser", password: 'newpassword' });

    expect(response.statusCode).toBe(200);
    expect(response.body.userId).toBe('mockedUserId');
  });


  // Test /api/chatbot endpoint
  it('should forward askllm request to the llm service', async () => {
    const response = await request(app)
      .post('/api/chatbot')
      .send({ question: 'question', model: 'gemini', systemMessage: "systemMessage" });

    expect(response.statusCode).toBe(200);
    expect(response.body.answer).toBe('llmanswer');
  });

  // Test /api/generate-questions endpoint
  it('should forward generate request to the game service', async () => {
    const response = await request(app)
      .get('/api/generate-questions')

    expect(response.statusCode).toBe(200);
    expect(response.body.questions).toBe('questions');
  });

  // Test /api/save-score endpoint
  it('should forward save-score request to the game service', async () => {
    const response = await request(app)
      .post('/api/save-score')
      .send({ username: 'user1', correct: 10, totalTime: 300 })

    expect(response.statusCode).toBe(200);
  });

    // Test /api/ranking endpoint
  it('should forward ranking request to the game service', async () => {
    const response = await request(app)
      .get('/api/ranking')

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        { username: 'user1', correct: 10, totalTime: 300 },
        { username: 'user2', correct: 8, totalTime: 250 },
        { username: 'user3', correct: 10, totalTime: 280 },
      ])
    );
  });

  it('should return an error when the ranking service fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error al cargar el ranking' }
      }
    }));
  
    const response = await request(app)
      .get('/api/ranking');
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error al cargar el ranking'
    });
  });

  it('should return an error when the chatbot fails', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error al contactar con el LLM Service' }
      }
    }));
  
    const response = await request(app)
    .post('/api/chatbot')
    .send({ question: 'question', model: 'gemini', systemMessage: "systemMessage" });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error al contactar con el LLM Service'
    });
  });

  it('should return an error when the login fails', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error en el login' }
      }
    }));
  
    const response = await request(app)
    .post('/api/login')
    .send({ email: 'test@user', password: 'testpassword' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error en el login'
    });
  });

  it('should return an error when the register fails', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error al registrar usuario' }
      }
    }));
  
    const response = await request(app)
    .post('/api/register')
    .send({ name: "test", email: 'test@user', password: 'testpassword' });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error al registrar usuario'
    });
  });

  it('should return an error when the generation service fails', async () => {
    axios.get.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error al contactar con el Game Service' }
      }
    }));
  
    const response = await request(app)
      .get('/api/generate-questions');
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error al contactar con el Game Service'
    });
  });

  it('should return an error when the save-score fails', async () => {
    axios.post.mockImplementationOnce(() => Promise.reject({
      response: {
        status: 500,
        data: { message: 'Error al guardar resultados' }
      }
    }));
  
    const response = await request(app)
    .post('/api/save-score')
    .send({ username: 'user1', correct: 10, totalTime: 300 });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'Error al guardar resultados'
    });
  });
  
});
