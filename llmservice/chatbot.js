const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
require('dotenv').config();

const app = express();
const port = process.env.LLM_SERVICE_PORT || 8003;

const LLM_API_KEY = process.env.GEMINI_API_KEY;
if (!LLM_API_KEY) {
  console.error('⚠️ No se encontró la API Key de Gemini. Configúrala en .env');
}

// 🔹 Lee el prompt por defecto desde prompt.yaml
function getDefaultPrompt(answer) {
  try {
    const filePath = path.join(__dirname, 'prompt.yaml');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = yaml.parse(fileContent);
    return parsed.defaultPrompt.raw.replace(/{{ANSWER}}/g, answer);
  } catch (error) {
    console.error('⚠️ No se pudo leer prompt.yaml:', error);
    return 'Responde de forma amigable sobre cultura general.';
  }
}

// 🔹 Configuración para Gemini
const llmConfigs = {
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${LLM_API_KEY}`,
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

// 🔹 Enviar pregunta a Gemini
async function sendQuestionToLLM(question, model = 'gemini', systemMessage) {
  try {
    const config = llmConfigs[model];
    if (!config) throw new Error(`Modelo "${model}" no soportado.`);

    const payload = config.transformRequest(question, systemMessage);
    const response = await axios.post(config.url, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    return config.transformResponse(response);
  } catch (error) {
    console.error(`❌ Error en el chatbot (${model}):`, error.response?.data || error.message || error);
    return 'Lo siento, no puedo responder en este momento.';
  }
}

app.use(express.json());

// 🔹 Endpoint principal
app.post('/', async (req, res) => {
  try {
    const { question, model, systemMessage, currentAnswer } = req.body;

    if (!question || !model) {
      return res.status(400).json({ error: 'Faltan campos requeridos (question, model)' });
    }

    const finalSystemMessage = systemMessage || getDefaultPrompt(currentAnswer || '???');
    const answer = await sendQuestionToLLM(question, model, finalSystemMessage);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener respuesta del chatbot' });
  }
});

// 🔹 Iniciar el servidor si se ejecuta directamente
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🤖 LLM Service escuchando en http://localhost:${port}`);
  });
}

module.exports = app;
