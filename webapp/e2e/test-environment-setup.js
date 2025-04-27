const { MongoMemoryServer } = require('mongodb-memory-server');
const { addUserToDatabase } = require('./addTestUser');

let mongoserver;
let userservice;
let authservice;
let llmservice;
let gatewayservice;
let gameservice;

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    process.env.REACT_APP_API_ENDPOINT = "http://localhost:8000";

    userservice = await require("../../userservice/userservice");
    authservice = await require("../../authservice/auth");
    llmservice = await require("../../llmservice/chatbot");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    gameservice = await require("../../gameservice/questions-service");

    console.log('Esperando a que los servicios arranquen...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // pequeño delay para asegurar que levantan

    console.log('Añadiendo usuario test@test...');
    await addUserToDatabase('test@test', 'test');
    console.log('Usuario añadido.');
}

startServer();
