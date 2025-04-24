const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const User = require('./user-model')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const port = process.env.USER_SERVICE_PORT || 8001;
const mongoUri = process.env.MONGODB_URI;


// Middleware
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    console.log("⚠️ Falta email o password");
    return res.status(400).json({ message: "Se requieren email y password." });
  }

  try {
    console.log("🔹 Buscando usuario en la base de datos...");

    if (typeof email !== 'string') {
      throw new Error('Invalid email format');
    }

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

    return res.status(200).json({ 
      message: "Login exitoso", 
      token, 
      name: user.name,
      email: email,
      role: user.role
    });

  } catch (error) {
    console.error("❌ Error en el login:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.post('/api/register', async (req, res) => {
  const { name, email, password, userRole } = req.body;

  // Verificar si faltan campos
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Se requieren nombre, email y password." });
  }

  try {
    // Verificar si el usuario ya existe con Mongoose
    console.log("🔹 Verificando si el usuario ya existe...");

    if (typeof email !== 'string') {
      throw new Error('Invalid email format');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ El usuario ya existe:", email);
      return res.status(409).json({ message: "El usuario ya existe." });
    }

    // Hashear la contraseña
    console.log("🔹 Hasheando la contraseña...");
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear un nuevo usuario con Mongoose
    console.log("🔹 Registrando usuario...");
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: userRole,
    });

    // Guardar el nuevo usuario
    await newUser.save();

    console.log("✅ Registro exitoso:", newUser.email);

    // Generar un token JWT
    const token = jwt.sign({ userId: newUser._id, email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });

    return res.status(201).json({ message: "Registro exitoso", token });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error("❌ Error al obtener la lista de usuarios:", error);
    res.status(500).json({ message: "Error interno del servidor." });
  }
});

app.put('/updateUser', async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;

  try {

      if (typeof email !== 'string') {
        throw new Error('Invalid email format');
      }

      const user = await User.findOne({email});

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Contraseña actual incorrecta' });

      if (name) user.name = name;
      if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

      await user.save();

      res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el usuario' });
  }
});

app.post('/deleteUser', async (req, res) => {
  const {email} = req.body;

  try {

    if (typeof email !== 'string') {
      throw new Error('Invalid email format');
    }

      const user = await User.findOne({email});

      if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

      await user.deleteOne()

      res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
});

// Endpoint de verificación de servicio
app.get('/health', (req, res) => res.json({ status: 'OK' }));

// Iniciar el servicio
const server = app.listen(port, () => {
  console.log(`🚀 User Service corriendo en: http://localhost:${port}`);
});

server.on('close', () => {
  // Close the Mongoose connection
  mongoose.connection.close();
});

module.exports = server
