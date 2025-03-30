const request = require('supertest');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server');

const User = require('./user-model');


let mongoServer;
let app;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  process.env.MONGODB_URI = mongoUri;

  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

  app = require('./userservice'); 
});

afterAll(async () => {
    app.close();
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('User Service', () => {
  it('should add a new user on POST /api/register', async () => {
    const newUser = {
      name: 'testuser',
      email: 'testaaaaaa@test',
      password: 'testpassword',
    };

    const response = await request(app).post('/api/register').send(newUser);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message', 'Registro exitoso');

    // Check if the user is inserted into the database
    const userInDb = await User.findOne({ email: 'testaaaaaa@test' });

    // Assert that the user exists in the database
    expect(userInDb).not.toBeNull();
    expect(userInDb.name).toBe('testuser');

    // Assert that the password is encrypted
    const isPasswordValid = await bcrypt.compare('testpassword', userInDb.password);
    expect(isPasswordValid).toBe(true);
  });

  it('Should perform a login operation /login', async () => {
    await request(app).post('/api/register').send({
        name: 'testusercov',
        email: 'testcover@test',
        password: 'testpassword',
      });

    const user = {
        email: 'testcover@test',
        password: 'testpassword'
    }
    const response = await request(app).post('/api/login').send(user);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Login exitoso');
  });
});