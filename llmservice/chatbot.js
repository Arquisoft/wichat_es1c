const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.LLM_SERVICE_PORT || 8003;

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCjkcwRHgwuhMoc0N4hJB_bgud9NV2fv-0";

if (!GEMINI_API_KEY) {
  console.error('⚠️ No se encontró la API Key de Gemini. Configúrala en .env');
}

const llmConfigs = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    transformRequest: (question, systemMessage) => ({
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemMessage || ''}\n\n${question}` }]
        }
      ],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: 3 },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: 3 },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: 3 },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: 3 }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 256,
        stopSequences: []
      }
    }),
    transformResponse: (response) =>
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No se obtuvo respuesta del modelo."
  }
};

async function sendQuestionToLLM(question, model = 'gemini', systemMessage) {
  try {
    const config = llmConfigs[model];
    if (!config) {
      throw new Error(`Modelo "${model}" no soportado.`);
    }

    const payload = config.transformRequest(question, systemMessage);
    const response = await axios.post(config.url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log("📩 Pregunta:", question);
    console.log("🧠 Instrucción del sistema:", systemMessage);
    console.log("📨 Respuesta de Gemini:", JSON.stringify(response.data, null, 2));

    return config.transformResponse(response);
  } catch (error) {
    console.error(`❌ Error en el chatbot (${model}):`, error.response?.data || error.message || error);
    return 'Lo siento, no puedo responder en este momento.';
  }
}

app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const { question, model, systemMessage } = req.body;

    if (!question || !model) {
      return res.status(400).json({ error: 'Faltan campos requeridos (question, model)' });
    }

    const answer = await sendQuestionToLLM(question, model, systemMessage);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuesta del chatbot' });
  }
});

app.listen(port, () => {
  console.log(`🤖 LLM Service escuchando en http://localhost:${port}`);
});

module.exports = app;