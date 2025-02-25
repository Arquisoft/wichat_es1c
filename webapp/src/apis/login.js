const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Cadena de conexión a MongoDB Atlas (reemplaza con tus datos)
const uri = 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';
let cachedClient = null;

/**
 * Conecta a la base de datos y reutiliza la conexión existente si ya está activa.
 */
async function connectDB() {
  if (cachedClient && cachedClient.topology && cachedClient.topology.isConnected()) {
    return cachedClient;
  }
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  cachedClient = client;
  return client;
}

// Endpoint de login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren email y password.' });
  }
  
  try {
    const client = await connectDB();
    const db = client.db('wichat-db'); // Asegúrate de que el nombre de tu base de datos sea el correcto
    const user = await db.collection('users').findOne({ email });
    
    // Validación simple en texto plano (para prototipos; en producción, utiliza hashing)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    return res.status(200).json({ message: 'Login exitoso', userId: user._id });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
