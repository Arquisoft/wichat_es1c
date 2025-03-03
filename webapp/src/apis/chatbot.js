// src/apis/chatbot.js
module.exports = function ({ express, axios }) {
    const router = express.Router();
  
    // Configuración de los modelos de LLM soportados
    const llmConfigs = {
      gemini: {
        url: (apiKey) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        transformRequest: (question) => ({
          contents: [{ parts: [{ text: question }] }]
        }),
        transformResponse: (response) => response.data.candidates[0]?.content?.parts[0]?.text
      },
      empathy: {
        url: () => 'https://empathyai.staging.empathy.co/v1/chat/completions',
        transformRequest: (question) => ({
          model: "qwen/Qwen2.5-Coder-7B-Instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: question }
          ]
        }),
        transformResponse: (response) => response.data.choices[0]?.message?.content,
        headers: (apiKey) => ({
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        })
      }
    };
  
    // Función para validar campos en la solicitud
    function validateRequiredFields(req, requiredFields) {
      for (const field of requiredFields) {
        if (!(field in req.body)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
    }
  
    // Función para enviar preguntas al modelo LLM
    async function sendQuestionToLLM(question, apiKey, model = 'gemini') {
      try {
        const config = llmConfigs[model];
        if (!config) {
          throw new Error(`Model "${model}" is not supported.`);
        }
  
        const url = config.url(apiKey);
        const requestData = config.transformRequest(question);
        const headers = {
          'Content-Type': 'application/json',
          ...(config.headers ? config.headers(apiKey) : {})
        };
  
        const response = await axios.post(url, requestData, { headers });
  
        return config.transformResponse(response);
  
      } catch (error) {
        console.error(`Error sending question to ${model}:`, error.message || error);
        return null;
      }
    }
  
    // Endpoint para interactuar con el chatbot
    router.post('/chatbot', async (req, res) => {
      try {
        validateRequiredFields(req, ['question', 'model', 'apiKey']);
        const { question, model, apiKey } = req.body;
        const answer = await sendQuestionToLLM(question, apiKey, model);
        res.json({ answer });
  
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    });
  
    return router;
  };
  