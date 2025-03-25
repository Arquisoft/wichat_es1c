const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    category : String,
    title : String,
    correctAnswer : String,
    allAnswers : String,
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question