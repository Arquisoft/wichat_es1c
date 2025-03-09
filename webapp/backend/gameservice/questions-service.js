const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const Question = require("./models/question-model.js");
const Template = require("./models/template-model.js");

const data = require("./data/questions-templates.json");

const app = express();
const port = process.env.GAME_SERVICE_PORT || 8010;
const NUMBER_OF_WRONG_ANSWERS = 3;

app.use(express.json());

const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/?retryWrites=true&w=majority&appName=wichat';
const endpoint = 'https://query.wikidata.org/sparql';

// ✅ Conectar a MongoDB Atlas
async function connectDB() {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("✅ Conectado a MongoDB Atlas en GameService");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB Atlas:", error);
        process.exit(1); // Terminar el proceso si no puede conectarse
    }
}

// ✅ Obtener plantilla de pregunta aleatoria
async function getTemplate() {
    const template = await Template.aggregate([{ $sample: { size: 1 } }]);
    return template[0];
}

// ✅ Enviar consulta SPARQL a Wikidata
async function sendQuery(template) {
    try {
        const settings = {
            headers: { Accept: 'application/sparql-results+json' },
            params: { query: template.query }
        };
        const data = await axios.get(endpoint, settings);
        return data;
    } catch (error) {
        console.error("❌ Error al enviar la consulta SPARQL:", error);
        return null;
    }
}

// ✅ Generar IDs aleatorios para respuestas incorrectas
function genRandomIDs(length, count) {
    let arr = Array.from({ length: length }, (v, k) => k);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, count);
}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


async function generateQuestion(results, template) {
    const randomIDs = genRandomIDs(results.length, NUMBER_OF_WRONG_ANSWERS + 1);
    const correctID = randomIDs[0];
    const incorrectIDs = randomIDs.slice(1);

    const correctAnswer = results[correctID];
    const incorrectAnswers = incorrectIDs.map(id => results[id]);

    const answers = shuffleArray([correctAnswer, ...incorrectAnswers]);

    const title = template.question.replace('*', correctAnswer.flag);
    const newQuestion = new Question({
        title: title,
        correctAnswer: correctAnswer.country,
        allAnswers: answers.map(ans => ans.country).join(',')
    });

    await newQuestion.save();
    return newQuestion;
}


app.get('/test', (req, res) => {
    res.json({ status: 'OK' });
});


app.get('/add-test', async (req, res) => {
    try {
        const template = await getTemplate();
        const data = await sendQuery(template);

        if (!data || !data.data || !data.data.results || !data.data.results.bindings.length) {
            return res.status(500).json({ error: "No se encontraron datos en Wikidata." });
        }

        const results = data.data.results.bindings.map(binding => ({
            country: binding.countryLabel.value,
            flag: binding.flag_img.value
        }));

        const newQuestion = await generateQuestion(results, template);
        res.json(newQuestion);
    } catch (error) {
        console.error("❌ Error al generar la pregunta:", error);
        res.status(500).json({ error: "Error interno en el servicio de preguntas." });
    }
});


connectDB().then(() => {
    const server = app.listen(port, () => {
        console.log(`🎮 Question Service corriendo en http://localhost:${port}`);
    });

    
    server.on('close', () => {
        mongoose.connection.close();
    });

    module.exports = server;
});
