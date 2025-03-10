const express = require('express');
const axios = require('axios');
const cors = require('cors');
const promBundle = require('express-prom-bundle'); 
const swaggerUi = require('swagger-ui-express');
const fs = require("fs");
const YAML = require('yaml');

// 🔹 Importamos los routers de cada servicio
const chatbotRoutes = require('../llmservice/chatbot');

const app = express();
const port = process.env.GATEWAY_PORT || 8000;

// 🔹 URLs de los microservicios
const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8002';
const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:8001';
const gameServiceUrl = process.env.GAME_SERVICE_URL || 'http://localhost:8010';

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true 
}));
app.use(express.json());

const metricsMiddleware = promBundle({ includeMethod: true });
app.use(metricsMiddleware);

// 🔹 **Health Check**
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 🔹 **Montamos el router de LLMService**
app.use('/api/chatbot', chatbotRoutes());

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
app.get('/api/generate-question', async (req, res) => {
  try {
    const questionGenerated = await axios.get(`${gameServiceUrl}/add-test`);
    res.json(questionGenerated.data);
  } catch (error) {
    console.error("❌ Error en /api/generate-question:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al generar pregunta'
    });
  }
});

app.get('/api/generate-questions', async (req, res) => {
  try {
    const questionGenerated = await axios.get(`${gameServiceUrl}/generateQuestions`);
    res.json(questionGenerated.data);
  } catch (error) {
    console.error("❌ Error en /api/generate-questions:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al generar pregunta'
    });
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
    console.error("❌ Error en /api/save-score:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al guardar resultados'
    });
  }
});

app.get('/api/ranking', async (req, res) => {
  try {
    const ranking = await axios.get(`${gameServiceUrl}/ranking`);
    res.json(ranking.data);
  } catch (error) {
    console.error("❌ Error en /api/ranking", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Error al cargar el ranking'
    });
  }
});

// 🔹 **Carga de OpenAPI Docs (Swagger)**
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
