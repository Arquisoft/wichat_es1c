const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoserver;
let userservice;
let authservice;
let llmservice;
let gatewayservice;
let gameservice

async function startServer() {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    userservice = await require("../../userservice/userservice");
   // authservice = await require("../../users/authservice/auth-service");
    llmservice = await require("../../llmservice/chatbot.js");
    gatewayservice = await require("../../gatewayservice/gateway-service");
    gameservice = await require("../../gameservice/questions-service.js");
}

startServer();
