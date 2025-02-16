const mongoose = require('mongoose');

// Define the disease schema
const diseaseSchema = new mongoose.Schema({
    diseaseName: {
        type: String,
        required: true,
        trim: true
    },
    diseaseID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    image:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the disease model
const disease = mongoose.model('allDiseases', diseaseSchema);

module.exports = disease;