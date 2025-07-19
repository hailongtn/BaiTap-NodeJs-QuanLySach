const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900
    },
    category: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
