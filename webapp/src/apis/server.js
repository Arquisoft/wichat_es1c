// src/apis/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Importa los módulos de API; cada uno exporta una función que recibe las dependencias
const loginRoutes = require('./login');
const registerRoutes = require('./register');
const homeRoutes = require('./home');
const authenticateToken = require('./auth'); // Se inyecta en deps si se desea

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Cadena de conexión a MongoDB Atlas (reemplaza con tus datos)
const uri = 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';

async function connectDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('Conectado a la base de datos');
  return client.db('wichat-db');
}

async function startServer() {
  try {
    const db = await connectDB();
    app.locals.db = db;
    
    // Objeto de dependencias a inyectar en los módulos
    const deps = {
      jwt,
      bcrypt,
      express,
      ObjectId,
      authenticateToken
    };
    
    // Monta los routers; cada uno usa la ruta base /api
    app.use('/api', loginRoutes(deps));
    app.use('/api', registerRoutes(deps));
    app.use('/api', homeRoutes(deps));
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();
