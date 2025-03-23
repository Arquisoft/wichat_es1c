const express = require('express');
const axios = require('axios');
require('dotenv').config();

module.exports = function () {
  const router = express.Router();
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
            parts: [{ text: question }]
          }
        ],
        system_instruction: {
          role: "system",
          parts: [
            {
              text: systemMessage || "Eres un asistente experto en banderas de países. Tu tarea es dar pistas sobre la bandera mostrada sin revelar directamente el país. Habla SIEMPRE en español, y responde de forma clara, útil y amigable."
            }
          ]
        },
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

      const response = await axios.post(config.url, config.transformRequest(question, systemMessage), {
        headers: { 'Content-Type': 'application/json' }
      });

      return config.transformResponse(response);
    } catch (error) {
      console.error(`❌ Error en el chatbot (${model}):`, error.response?.data || error.message || error);
      return 'Lo siento, no puedo responder en este momento.';
    }
  }

  router.post('/', async (req, res) => {
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

  return router;
};
