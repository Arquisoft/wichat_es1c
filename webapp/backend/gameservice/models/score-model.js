const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
    email: String,
    correct: Number,
    wrong: Number
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score