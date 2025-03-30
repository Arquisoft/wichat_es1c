const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./user-model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// Importa rutas
const loginRoutes = require('./login');
const registerRoutes = require('./register');

const app = express();
const port = process.env.USER_SERVICE_PORT || 8001;
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/wichat-db';
mongoose.connect(mongoUri);

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

app.post('/api/login', async (req, res) => {
  // console.log("🔹 Request recibida en Login:", req.body);

  const { email, password } = req.body;
  if (!email || !password) {
    console.log("⚠️ Falta email o password");
    return res.status(400).json({ message: "Se requieren email y password." });
  }

  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ message: '❌ Error: No hay conexión con la base de datos.' });
    }

    console.log("🔹 Buscando usuario en la base de datos...");
    const user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ Usuario no encontrado:", email);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    console.log("🔹 Comparando contraseñas...");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("⚠️ Contraseña incorrecta para:", email);
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    console.log("✅ Generando token JWT...");
    const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });

    console.log("✅ Login exitoso para:", email);
    return res.status(200).json({ message: "Login exitoso", token });

  } catch (error) {
    console.error("❌ Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.post('/api/register', async (req, res) => {
  // console.log("🔹 Recibiendo solicitud de registro:", req.body);

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Se requieren nombre, email y password." });
  }

  try {
    const db = req.app.locals.db;
    if (!db) {
      return res.status(500).json({ message: "❌ Error: No hay conexión con la base de datos." });
    }

    console.log("🔹 Verificando si el usuario ya existe...");
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      console.log("⚠️ El usuario ya existe:", email);
      return res.status(409).json({ message: "El usuario ya existe." });
    }

    console.log("🔹 Hasheando la contraseña...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log("🔹 Registrando usuario...");

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
  });

    await newUser.save();

    console.log("✅ Registro exitoso:", newUser.email);
    const token = jwt.sign({ userId: newUser._id, email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });

    return res.status(201).json({ message: "Registro exitoso", token });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

// Endpoint de verificación de servicio
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Iniciar el servicio
const server = app.listen(port, () => {
  console.log(`🚀 User Service corriendo en: http://localhost:${port}`);
});

module.exports = server
