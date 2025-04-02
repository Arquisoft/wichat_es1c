const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");
const cron = require('node-cron');
const fs = require('fs');
const jwt = require("jsonwebtoken");

const Question = require("./models/question-model.js");
const Template = require("./models/template-model.js");
const Score = require("./models/score-model.js");

//const data = require("./data/questions-templates.json");

const app = express();
const port = process.env.GAME_SERVICE_PORT || 8010;
const NUMBER_OF_WRONG_ANSWERS = 3;
const NUMBER_OF_QUESTIONS = 10

const templatesPath = "./data/questions-templates.json";
const templates = JSON.parse(fs.readFileSync(templatesPath, 'utf8'));
const endpoint = 'https://query.wikidata.org/sparql';

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
        .then(() => {return Template.insertMany(templates)});;
        console.log("✅ Conectado a MongoDB Atlas en GameService");
    } catch (error) {
        console.error("❌ Error al conectar a MongoDB Atlas:", error);
        process.exit(1); // Terminar el proceso si no puede conectarse
    }
}

/**
 * Generate a certain amount random IDs from a range to choose from.
 * @param {int} length Length of the original array 
 * @param {int} count Number of random IDs to generate
 * @returns {Array} Array containing the random IDs
 */
function genRandomIDs(length, count)
{
    let arr = Array.from({ length: length }, (v, k) => k);

    for (let i = arr.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count);
}

/**
 * Given an array, shuffle it and return it.
 * @param {Array} array Array to shuffle 
 * @returns {Array} Shuffled array
 */
function shuffleArray(array)
{
    for (let i = array.length - 1; i > 0; i--)
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    throw new TypeError("Invalid parameter type (expected int or string)");
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
            { $match: { category: 'Geografía' } },
            { $sample: { size: 1 } },
        ]);

        if (found.length == 0)
            throw new Error("No se han encontrado preguntas");
        
        let newQuestion = found[0];

        if (!newQuestion.title || !newQuestion.correctAnswer || !newQuestion.allAnswers)
        {
            console.error("Pregunta incompleta:", newQuestion);
            continue; // Skip this question
        }

        questions.push(newQuestion);
    }

    if (questions.length < NUMBER_OF_QUESTIONS)
        throw new Error("No se han encontrado preguntas suficientes");

    return questions;
}

/**
 * Given a full array of results and a question template, generates a question.
 * 
 * The returned question contains a title with the flag of the correct country
 * and a list of 4 shuffled answers - 1 correct and 3 incorrect.
 * @param {Array} results Array of Wikidata query results
 * @param {JSON} template Question template
 * @returns {JSON} Question data object
 */
async function generateQuestion(results, template)
{
    // Get 4 random answers - 1 correct and 3 incorrect
    const randomIDs = genRandomIDs(results.length, NUMBER_OF_WRONG_ANSWERS + 1);
        const correctID = randomIDs[0];           // Correct answer ID
        const incorrectIDs = randomIDs.slice(1);  // Incorrect answers IDs

    // Answers
    const correctAnswer = results[correctID];
    const incorrectAnswers = incorrectIDs.map(id => results[id]);

    // Shuffle answers
    const answers = shuffleArray([correctAnswer, ...incorrectAnswers]);

    // Compound returned JSON object
    const title = template.question.replace('*', correctAnswer.img);
    const newQuestion = new Question(
    {
        title: title,
        correctAnswer: correctAnswer.label,
        allAnswers: answers.map(ans => ans.label).join(',')
    });

    await newQuestion.save();
    return newQuestion;
}

// Fetch and store questions in MongoDB
async function fetchQuestions()
{
    console.log("[DEBUG] Fetching questions...");

    let allQuestions = [];

    // Fetch 50 questions for each template
    for (const template of templates)
    {
        console.log(`[DEBUG] Fetching questions for: ${template.type}`);
        
        try
        {
            // Send query to Wikidata
            const response = await axios.get(endpoint,
            {
                params : { query : template.query, format : "json" },
                headers : { Accept : "application/sparql-results+json" },
                timeout : 10000 // 10 seconds
            });

            // Extract questions from response
            const results = response.data.results.bindings.map( binding =>
            ({
                label : binding.label?.value || "Unknown",
                img : binding.img?.value || binding.element_img?.value || "",
            }));

            // Generate 50 questions for this template
            for (let i = 0; i < Math.min(50, results.length); i++)
            {
                const question = await generateQuestion(results, template);
                question.category = template.category;
                allQuestions.push(question);

                console.log(`[DEBUG] Question generated: ${question}`);
            }
        }
        catch (error)
        {
            // Note : Alternatively, log errors to a log file (Winston/Pino?)
            console.error( `Error fetching ${template.category} questions: ${error}` );
        }
    }

    // Save all questions to MongoDB
    await Question.deleteMany({}); // Remove old questions
    await Question.insertMany(allQuestions);
    console.log(`[DEBUG] ${allQuestions.length} questions saved successfully.`);
}

// Schedule task with node-cron
    // Fetch questions every day at 3:00 AM
    cron.schedule("0 3 * * *", fetchQuestions);

// Add API endpoint to trigger manually
// (Might disable this in final version)
app.get("/fetch-questions", async (req, res) =>
{
    console.log("Manual request received. Fetching questions...");
    await fetchQuestions();
    res.send("Questions fetched successfully.");
});

app.get('/test', (req, res) => {
    res.json({ status: 'OK' });
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
