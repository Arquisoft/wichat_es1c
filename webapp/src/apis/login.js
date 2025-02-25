// apis/login.js
const express = require('express');
const router = express.Router();

// Endpoint de login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Se requieren email y password.' });
  }
  
  try {
    // Usa la conexión compartida
    const db = req.app.locals.db;
    const user = await db.collection('users').findOne({ email });
    
    // Comparación en texto plano (para prototipos; en producción, utiliza hashing)
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    
    return res.status(200).json({ message: 'Login exitoso', userId: user._id });
  } catch (error) {
    console.error('Error en el login:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
});

module.exports = router;
