module.exports = function({ jwt, bcrypt, express, ObjectId }) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
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
      const result = await db.collection('users').insertOne({ name, email, password: hashedPassword });

      console.log("✅ Registro exitoso:", email);
      const token = jwt.sign({ userId: result.insertedId, email }, process.env.JWT_SECRET || "secretKey", { expiresIn: "1h" });

      return res.status(201).json({ message: "Registro exitoso", token });
    } catch (error) {
      console.error("❌ Error en el registro:", error);
      return res.status(500).json({ message: "Error interno del servidor." });
    }
  });

  return router;
};
