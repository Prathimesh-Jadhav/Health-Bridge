const mongoose = require('mongoose');

// Define the official contact schema
const officialContactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    designation: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the official contact model
const officialContact = mongoose.model('officialContact', officialContactSchema);

module.exports = officialContact;