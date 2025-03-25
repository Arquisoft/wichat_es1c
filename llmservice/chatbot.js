const express = require('express');
const axios = require('axios');

const app = express();
const port = 8003;

app.use(express.json());

require('dotenv').config(); // Carga variables de entorno


const router = express.Router();
const GEMINI_API_KEY = "AIzaSyCjkcwRHgwuhMoc0N4hJB_bgud9NV2fv-0";

if (!GEMINI_API_KEY) {
  console.error('⚠️ No se encontró la API Key de Gemini. Configúrala en .env');
}

const llmConfigs = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    transformRequest: (question) => ({
      contents: [{ parts: [{ text: question }] }]
    }),
    transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text
  }
};

async function sendQuestionToLLM(question, model = 'gemini') {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Modelo "${model}" no soportado.`);
    }

    const response = await axios.post(config.url, config.transformRequest(question), {
      headers: { 'Content-Type': 'application/json' }
    });

    return config.transformResponse(response);
  } catch (error) {
    console.error(`❌ Error en el chatbot (${model}):`, error.message || error);
    return 'Lo siento, no puedo responder en este momento.';
  }
}

app.post('/ask', async (req, res) => {
  try {
    if (!req.body.question || !req.body.model) {
      return res.status(400).json({ error: 'Faltan campos requeridos (question, model)' });
    }

    const { question, model } = req.body;
    const answer = await sendQuestionToLLM(question, model);
    res.json({ answer });

  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuesta del chatbot' });
  }
});

const server = app.listen(port, () => {
  console.log(`LLM Service listening at http://localhost:${port}`);
});

module.exports = server
