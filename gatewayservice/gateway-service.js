const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle'); 
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

const app = express();
const port = process.env.GATEWAY_PORT || 8000;

// 🔹 URLs de los microservicios
const llmServiceUrl = process.env.LLM_SERVICE_URL || 'http://localhost:8003';
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8010';

app.use(cors({
  origin: ["http://172.187.128.128:3000", "http://localhost:3000"],
  credentials: true 
}));
app.use(express.json());

const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// 🔹 **Health Check**
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// 🔹 **Montamos el router de LLMService**
app.post('/api/chatbot', async (req, res) => {
  try {
    const response = await axios.post(`${llmServiceUrl}/`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error al contactar con el LLM Service' });
  }
});

// 🔹 **Login - Redirige al UserService**
app.post('/api/login', async (req, res) => {
  try {
    const authResponse = await axios.post(
      `${userServiceUrl}/api/login`,
      req.body,
      { withCredentials: true } 
    );
    res.json(authResponse.data);
  } catch (error) {
    console.error("❌ Error en /api/login:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error en el login'
    });
  }
});

/* 🔹 **Logout - Elimina la cookie de sesión y el token**
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'Strict' });
  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
});
 */

// 🔹 **Registro - Redirige al UserService**
app.post('/api/register', async (req, res) => {
  try {
    const userResponse = await axios.post(`${userServiceUrl}/api/register`, req.body);
    res.json(userResponse.data);
  } catch (error) {
    console.error("❌ Error en /api/register:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al registrar usuario'
    });
  }
});

// 🔹 **Generación de preguntas - Redirige a GameService**
app.get('/api/generate-questions', async (req, res) => {
  try {
    const { type } = req.query; 
    const questionGenerated = await axios.get(`${gameServiceUrl}/generateQuestions`, {
      params: { type }
    });
    res.json(questionGenerated.data);
  } catch (error) {
    console.error("❌ Error en /api/generate-questions:", error.response?.data || error.message);
    res.status(500).json({ error: 'Error al contactar con el Game Service' });
  }
});

app.post('/api/save-score', async (req, res) => {
  try {
    const token = req.headers['authorization'];
    const headers = {
      'Authorization': token,  
      'Content-Type': 'application/json'
    };
    const saveScored = await axios.post(`${gameServiceUrl}/saveScore`, req.body, { headers });
    res.json(saveScored.data);
  } catch (error) {
    if (error.response?.data?.error?.name === 'TokenExpiredError') {
      console.error("❌ Token expirado en /api/save-score:", error.response.data);
      return res.status(401).json({
        error: 'El token ha expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    console.error("❌ Error en /api/save-score:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al guardar resultados'
    });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await axios.get(`${gameServiceUrl}/ranking`);
    
    const sortedRanking = ranking.data.sort((a, b) => {
      if (a.correct === b.correct) {
        return a.totalTime - b.totalTime;
      }
      return b.correct - a.correct;
    });

    res.json(sortedRanking);
  } catch (error) {
    console.error("❌ Error en /api/ranking", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al cargar el ranking'
    });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const usersResponse = await axios.get(`${userServiceUrl}/users`);
    res.json(usersResponse.data);
  } catch (error) {
    console.error("❌ Error en /api/users:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al obtener la lista de usuarios'
    });
  }
});

app.put('/api/update-user', async (req, res) => {
  try {
    const updateResponse = await axios.put(`${userServiceUrl}/updateUser`, req.body, { withCredentials: true })
    res.json(updateResponse.data)
  } catch (error){
    res.status(500).json({ error: 'Error al cactualizar los datos' });
  }
});

// 🔹 **Carga de OpenAPI Docs (Swagger)**
app.get('/api-doc', (req, res) => {
  res.status(200).send('<html><body>Swagger UI</body></html>');
});

const openapiPath = './openapi.yaml';
if (fs.existsSync(openapiPath)) {
  const file = fs.readFileSync(openapiPath, 'utf8');
  const swaggerDocument = YAML.parse(file);
  app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("⚠️ No se encontró la configuración de OpenAPI (openapi.yaml).");
}

// 🔹 **Iniciar API Gateway**
const server = app.listen(port, () => {
  console.log(`🚀 API Gateway corriendo en: http://localhost:${port}`);
});

module.exports = server;
