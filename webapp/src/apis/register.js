// src/apis/register.js
module.exports = function({ jwt, bcrypt, express, ObjectId }) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Se requieren nombre, email y password.' });
    }

    try {
      const db = req.app.locals.db;
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'El usuario ya existe.' });
      }
      
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const result = await db.collection('users').insertOne({ name, email, password: hashedPassword });
      
      const tokenPayload = { userId: result.insertedId, email };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
      
      return res.status(201).json({ message: 'Registro exitoso', token });
    } catch (error) {
      console.error('Error en el registro:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  });

  return router;
};
