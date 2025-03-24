const expres = require('express');
const cron = require('node-cron');
const axios = require('axios');
const mongoose = require('mongoose');
const fs = require('fs');
const { Question } = require('../models/question-model');
const { generateQuestion, timeout } = require('../questions-service');

const app = express();
const PORT = process.env.PORT || 9081;

// Wikidata endpoint
const endpoint = 'https://query.wikidata.org/sparql';

// Load templates from templates JSON file
const templatesPath = "../data/questions-templates.json";
const templates = JSON.parse(fs.readFileSync(templatesPath, "utf8"));

// Connect to MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionsDb';
mongoose.connect(mongoUri)
    .then(() => { console.log("Connected to MongoDB"); })
    .catch(err => { console.error("Error connecting to MongoDB", err); });

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
                allQuestions.push(question);
            }
        }
        catch (error)
        {
            // Note : Alternatively, log errors to a log file (Winston/Pino?)
            console.error( `Error fetching ${template.category} questions: ${err}` );
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

// Start Express server
app.listen(PORT, () => { console.log(`Question Preload Service running on port ${PORT}`); });