const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Importa rutas
const loginRoutes = require('./login');
const registerRoutes = require('./register');

const app = express();
const port = process.env.USER_SERVICE_PORT || 8001;
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/wichat-db';

// Inicializa la conexión a MongoDB
let db = null;
async function connectDB() {
  if (!db) {
    try {
      const client = new MongoClient(mongoUri);
      await client.connect();
      db = client.db('wichat-db');
      console.log('✅ Conectado a MongoDB en User Service');
      app.locals.db = db;
    } catch (error) {
      console.error('❌ Error al conectar con MongoDB:', error);
      process.exit(1); // Detiene el servicio si la conexión falla
    }
  }
}
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Dependencias que pasan a los routers
const deps = { jwt, bcrypt, express, ObjectId };

// Montar rutas
app.use('/api', loginRoutes(deps));
app.use('/api', registerRoutes(deps));

// Endpoint de verificación de servicio
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Iniciar el servicio
app.listen(port, () => console.log(`🚀 User Service corriendo en: http://localhost:${port}`));
