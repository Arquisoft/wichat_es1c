const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    email: { type: String, required: true },
    correct: { type: Number, required: true },
    wrong: { type: Number, required: true },
    totalTime: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now } // Agregar campo timestamp
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;