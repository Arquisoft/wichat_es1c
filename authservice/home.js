// src/apis/home.js
module.exports = ({ express, ObjectId, authenticateToken }) => {
    const router = express.Router();

    router.get('/', authenticateToken, async (req, res) => {
        try {
            const db = req.app.locals.db;
            const userId = req.user.userId;

            if (!ObjectId.isValid(userId)) {
                return res.status(500).json({ message: 'Error interno del servidor' });
            }

            const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });

            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.status(200).json({ message: `Bienvenido ${user.name}` });
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    });

    return router;
};
