// src/apis/home.js
module.exports = function({ express, ObjectId, authenticateToken }) {
  const router = express.Router();

  // Aplica el middleware para proteger este endpoint
  router.get('/home', authenticateToken, async (req, res) => {
    try {
      const db = req.app.locals.db;
      const userId = req.user.userId;
      const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      return res.status(200).json({ message: `Bienvenido ${user.name}` });
    } catch (error) {
      console.error('Error en el endpoint home:', error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  });

  return router;
};
