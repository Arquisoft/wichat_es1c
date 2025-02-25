const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Importa los routers de login y registro
const loginRoutes = require('./login');
const registerRoutes = require('./register');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Cadena de conexión a MongoDB Atlas (reemplaza con tus datos)
const uri = 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';

// Función que inicia la conexión y arranca el servidor
async function startServer() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Conectado a la base de datos');
    
    // Almacena la instancia de la DB en app.locals
    app.locals.db = client.db('wichat-db');
    
    // Monta los routers
    app.use('/api', loginRoutes);
    app.use('/api', registerRoutes);
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
}

startServer();
