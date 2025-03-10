module.exports = function({ jwt, bcrypt, express, ObjectId }) {
  const router = express.Router();

  router.post('/login', async (req, res) => {
    console.log("🔹 Request recibida en Login:", req.body);

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
      const user = await db.collection('users').findOne({ email });

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

  return router;
};
