const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config(); // Carga las variables de entorno desde .env

// Importamos los módulos de la API
const loginRoutes = require('./login');
const registerRoutes = require('./register');
const homeRoutes = require('./home');
const chatbotRoutes = require('./chatbot'); // Chatbot integrado
const authenticateToken = require('./auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = process.env.MONGO_URI || 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';

async function connectDB() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  console.log('✅ Conectado a la base de datos');
  return client.db('wichat-db');
}

async function startServer() {
  try {
    const db = await connectDB();
    app.locals.db = db;

    const deps = { jwt, bcrypt, express, ObjectId, authenticateToken, axios };

    app.use('/api', loginRoutes(deps));
    app.use('/api', registerRoutes(deps));
    app.use('/api', homeRoutes(deps));
    app.use('/api', chatbotRoutes()); // Se integra el chatbot

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
  }
}

startServer();
