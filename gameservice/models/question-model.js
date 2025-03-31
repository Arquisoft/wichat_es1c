const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    title: String,
    correctAnswer: String,
    allAnswers: String,
    category: String
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question