// apis/register.js
const express = require('express');
const router = express.Router();

// Endpoint de registro
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Se requieren nombre, email y password.' });
  }
  
  try {
    const db = req.app.locals.db;
    // Verificar si el usuario ya existe
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'El usuario ya existe.' });
    }
    
    // Insertar el nuevo usuario (texto plano para prototipo)
    const result = await db.collection('users').insertOne({ name, email, password });
    return res.status(201).json({ message: 'Registro exitoso', userId: result.insertedId });
  } catch (error) {
    console.error('Error en el registro:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
