const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const Question = require("./models/question-model.js");
const Template = require("./models/template-model.js");

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

/**
 * Aux. function to generate random IDs.
 * @param {int} length Length of the original array 
 * @param {int} count Number of random IDs to generate
 * @returns {Array} Array containing the random IDs
 */
function genRandomIDs(length, count)
{
    let arr = Array.from({length: length}, (v, k) => k);

    for ( let i = arr.length - 1; i > 0; i-- )
    {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0,count);
}


/**
 * Aux. function to shuffle an array.
 * @param {Array} array Array to shuffle 
 * @returns {Array} Shuffled array
 */
function shuffleArray(array)
{
    for ( let i = array.length - 1; i > 0; i-- )
    {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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
    const title = template.question.replace('*', correctAnswer.flag);
    const newQuestion = Question(
    {
        title: title,
        correctAnswer: correctAnswer.country,
        allAnswers: answers.map(ans => ans.country).join(',')
    });

    await newQuestion.save();
    return newQuestion;
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
        // Get a random template - Can paremeterize this for game modes
        const template = await getTemplate(0);

        // Send query and generate question
        const data = await sendQuery(template);
        const results = data.data.results.bindings.map(binding => {
            return {
                country: binding.pLabel.value,
                flag: binding.img.value
            }
        });
        const newQuestion = await generateQuestion(results, template);

        // Add question to the result list
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
    const questions = await generateQuestions()
    res.json(questions)
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
