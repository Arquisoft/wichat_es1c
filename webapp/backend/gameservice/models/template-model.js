const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    question: String,
    query: String,
    category: String,
});

const Template = mongoose.model('TEmplate', templateSchema);

module.exports = Template