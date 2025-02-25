// src/apis/login.js
module.exports = function({ jwt, bcrypt, express, ObjectId }) {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Se requieren email y password.' });
    }

    try {
      const db = req.app.locals.db;
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }
      
      const tokenPayload = { userId: user._id, email: user.email };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'secretKey', { expiresIn: '1h' });
      
      return res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
      console.error('Error en el login:', error);
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }
  });

  return router;
};
