const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    email: { type: String, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
    question: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    givenAnswer: { type: String, required: true }
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;