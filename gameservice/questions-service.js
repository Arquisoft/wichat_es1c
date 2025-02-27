const express = require("express")
const mongoose = require("mongoose")
const axios = require("axios")

const Question = require("./models/question-model.js")
const Template = require("./models/template-model.js")

const data = require("./data/questions-templates.json")

const app = express()
const port = 8010

const NUMBER_OF_WRONG_ANSWERS = 3

app.use(express.json())

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/questionsDb';
const endpoint = 'https://query.wikidata.org/sparql';

mongoose.connect(mongoUri)
    .then(() => {return Template.deleteMany({})})
    .then(() => {return Template.insertMany(data)});

async function getTemplate(){
    const template = await Template.aggregate([{ $sample: { size: 1 } }]);
    return template[0];
}

async function sendQuery(template) {
    try {
        const settings = {
            headers: { Accept: 'application/sparql-results+json' },
            params: { query: template.query }
        }
        const data = await axios.get(endpoint, settings)
        return data
    } catch (error) {
        console.error("Error al enviar la query", error);
    return null;
    }
}

async function generateQuestion(results, template){
    const paisCorrecto = results[Math.floor(Math.random() * results.length)]
    const respuestasIncorrectas = []
    while(respuestasIncorrectas.length < NUMBER_OF_WRONG_ANSWERS){
        const ranNumber = Math.floor(Math.random() * results.length)
        if(results[ranNumber].country != paisCorrecto.country && !respuestasIncorrectas.includes(results[ranNumber])){
            respuestasIncorrectas.push(results[ranNumber].country)
        }
    }
    const title = template.question.replace('*', paisCorrecto.flag)
    const answers = paisCorrecto.country + "," + respuestasIncorrectas[0] + "," + respuestasIncorrectas[1] + "," + respuestasIncorrectas[2]
    const newQuestion = Question({
        title: title,
        correctAnswer: paisCorrecto.country,
        allAnswers: answers
    })
    await newQuestion.save()
    return newQuestion
}

//Prueba para probar si el servicio está activo
app.get('/test', (req, res) => {
    res.json({ status: 'OK' });
})


app.get('/add-test', async (req, res) =>{
    const template = await getTemplate();
    const data = await sendQuery(template)
    const results = data.data.results.bindings.map(binding => {
        return {
            country: binding.countryLabel.value,
            flag: binding.flag_img.value
        }
    })
    const newQuestion = await generateQuestion(results, template)
    res.json(newQuestion)
});



const server = app.listen(port, () => {
    console.log(`Question Service listening at http://localhost:${port}`);
})

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
});

module.exports = server
