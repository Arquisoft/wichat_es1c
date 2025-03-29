const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const Question = require("./models/question-model.js");
const Template = require("./models/template-model.js");
const Score = require("./models/score-model.js");

const data = require("./data/questions-templates.json");

const app = express();
const port = process.env.GAME_SERVICE_PORT || 8010;
const NUMBER_OF_WRONG_ANSWERS = 3;
const NUMBER_OF_QUESTIONS = 10

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true  
  }));
app.use(express.json());


const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://fFFH8ALCgMl58vdLNovG:y122LzFpRq4LgpHfNRlJ@wichat.sz10z.mongodb.net/wichat-db';

// ✅ Conectar a MongoDB Atlas
async function connectDB() {
    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {return Template.deleteMany({})})
        .then(() => {return Template.insertMany(data)});;
        console.log("✅ Conectado a MongoDB Atlas en GameService");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB Atlas:", error);
        process.exit(1); // Terminar el proceso si no puede conectarse
    }
}

// ----------------------------------------------------------------------------

/**
 * Select a template based on given parameters:
 * - No parameter: Random template
 * - Integer parameter: Template by index
 * - String parameter: Template by category
 * @param {int|string} param - Optional parameter:
 *  - int : Index of the template to retrieve
 *  - string : Template category to filter
 * @returns {JSON} Found template
 * @throws {TypeError} If the parameter is not an integer or a string
 */
async function getTemplate(param)
{
    // No param -> Random template
    if (param === undefined)
        return await getRandomTemplate();

    // Param:int -> Template by index
    if (Number.isInteger(param))
        return await getTemplateByIndex(param);

    // Param:string -> Template by category
    if (typeof param === 'string')
        return await getTemplateByCategory(param);

    // No match -> Throw error
    throw new TypeError("Invalid parameter type. Expected int or string.");
}

/**
 * Select a random template from the entire collection of templates.
 * @returns {JSON} A random template from the database
 */
async function getRandomTemplate()
{
    const template = await Template.aggregate([{ $sample: { size: 1 } }]);
    return template[0];
}

/**
 * Select a specific template from the collection of templates, given its index
 * inside the `questions-templates.json` file.
 * @param {int} index Index of the template to retrieve
 * @returns {JSON} Template at the given index, null if index out of bounds
 */
async function getTemplateByIndex(index)
{
    const template = await Template.findOne().skip(index).exec();
    return template || null;
}

/**
 * Select a random template from the collection of templates, given a specific
 * category to filter.
 * @param {string} category Question category to filter
 * @returns {JSON} A random template from the database, null if no match
 */
async function getTemplateByCategory(category)
{
    const template = await Template.aggregate([
        { $match: { category: category } },
        { $sample: { size: 1 } }
    ]);
    return template[0] || null;
}

/**
 * Generate the full list of questions to be displayed in a game.
 * @returns {Array} List of generated questions
 */
async function generateQuestions()
{
    const questions = [];

    for ( let i = 0; i < NUMBER_OF_QUESTIONS; i++ )
    {
        // Get a random template of the specified category
        // 'undefined' category returns a random template
        const template = getTemplate(0);
        
        // Get question from DB and add it to the result list
        let found = await Question.aggregate([
            { $match: { category: template.category } },
            { $sample: { size: 1 } },
        ]);

        if (found.length == 0)
            throw new Error("No se han encontrado preguntas");
        
        let newQuestion = found[0];

        if (!found.title || !found.correctAnswer || !found.allAnswers)
        {
            console.error("Pregunta incompleta:", found);
            continue; // Skip this question
        }

        questions.push(newQuestion);
    }

    return questions;
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

app.get('/generateQuestions', async (req, res) => {
    try
    {
        const questions = await generateQuestions();
        res.json(questions);
    }
    catch (error)
    {
        console.error("❌ Error in /generateQuestions:", error);
        res.status(500).json({ error: "Error interno en el servicio de preguntas." });
    }
});

app.post('/saveScore', async (req, res) => {
    
    // Verificar si el usuario está autenticado
    const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del encabezado
    if (!token) {
        return res.status(401).json({ message: "No se proporcionó un token de autenticación" });
    }

    try {
        const decoded = jwt.verify(token, "secretKey");
        const email = decoded.email;

        // Crear una nueva entrada para cada partida
        const scoreEntry = new Score({
            email,
            correct: req.body.correct,
            wrong: req.body.wrong,
            totalTime: req.body.totalTime, // Asegurarse de guardar totalTime
            timestamp: new Date() // Agregar la fecha y hora actual
        });
        await scoreEntry.save();

        res.status(200).json({ message: "Puntuación guardada correctamente", score: scoreEntry });
    } catch (error) {
        res.status(500).json({ message: "Error al guardar la puntuación", error });
    }
});

app.get('/ranking', async (req, res) => {
    const ranking = await Score.find()
    res.json(ranking)
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
