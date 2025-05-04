const request = require('supertest')
const User = require('./user-model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.mock('./user-model');

describe('User Service API', () => {
  beforeAll(async () => {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      process.env.MONGODB_URI = mongoUri;
      server = require('./userservice');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    server.close();
    await mongoServer.stop();
  });

  describe('POST /api/register', () => {
    it('should register a new user successfully', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({});
      const res = await request(server).post('/api/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userRole: 'user',
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Registro exitoso');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(server).post('/api/register').send({
        email: 'test@example.com',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Se requieren nombre, email y password.');
    });

    it('should return 409 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com' });
      const res = await request(server).post('/api/register').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userRole: 'user',
      });
      expect(res.status).toBe(409);
      expect(res.body.message).toBe('El usuario ya existe.');
    });
  });

  describe('POST /api/login', () => {
    it('should login successfully with valid credentials', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: hashedPassword, name: 'Test User', role: 'user', _id: '123' });
      const res = await request(server).post('/api/login').send({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login exitoso');
    });

    it('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(server).post('/api/login').send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Credenciales inválidas.');
    });

    it('should return 400 if required fields are missing', async () => {
      const res = await request(server).post('/api/login').send({
        email: 'test@example.com',
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Se requieren email y password.');
    });
  });

  describe('GET /users', () => {
    it('should fetch all users', async () => {
      User.find.mockResolvedValue([{ name: 'Test User', email: 'test@example.com' }]);
      const res = await request(server).get('/users');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ name: 'Test User', email: 'test@example.com' }]);
    });
  });

  describe('PUT /updateUser', () => {
    it('should update user successfully', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: hashedPassword, save: jest.fn() });
      const res = await request(server).put('/updateUser').send({
        email: 'test@example.com',
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuario actualizado correctamente');
    });

    it('should return 401 for incorrect current password', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      User.findOne.mockResolvedValue({ email: 'test@example.com', password: hashedPassword });
      const res = await request(server).put('/updateUser').send({
        email: 'test@example.com',
        currentPassword: 'wrongpassword',
        newPassword: 'newpassword123',
      });
      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Contraseña actual incorrecta');
    });

    it('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(server).put('/updateUser').send({
        email: 'nonexistent@example.com',
        currentPassword: 'password123',
        newPassword: 'newpassword123',
      });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('POST /deleteUser', () => {
    it('should delete user successfully', async () => {
      User.findOne.mockResolvedValue({ email: 'test@example.com', deleteOne: jest.fn() });
      const res = await request(server).post('/deleteUser').send({
        email: 'test@example.com',
      });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuario eliminado correctamente');
    });

    it('should return 404 if user is not found', async () => {
      User.findOne.mockResolvedValue(null);
      const res = await request(server).post('/deleteUser').send({
        email: 'nonexistent@example.com',
      });
      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Usuario no encontrado');
    });
  });

  describe('GET /health', () => {
    it('should return service health status', async () => {
      const res = await request(server).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('OK');
    });
  });
});