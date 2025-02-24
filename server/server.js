const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());


const uri = 'mongodb+srv://user:paswd@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';
let cachedClient = null;


async function connectDB() {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    return cachedClient;
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}


app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren email y password.' });
  }
  
  try {
    const client = await connectDB();
    const db = client.db('wichat-db');
    const user = await db.collection('users').findOne({ email });
    
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    return res.status(200).json({ message: 'Login exitoso', userId: user._id });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});


app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Se requieren nombre, email y password.' });
  }
  
  try {
    const client = await connectDB();
    const db = client.db('wichat-db');
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe.' });
    }
    
    
    const result = await db.collection('users').insertOne({ name, email, password });
    return res.status(201).json({ message: 'Registro exitoso', userId: result.insertedId });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
