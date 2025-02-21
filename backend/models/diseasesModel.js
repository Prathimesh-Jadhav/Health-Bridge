const mongoose = require('mongoose');

// Define the disease schema
const diseaseSchema = new mongoose.Schema({
    diseaseID: {
        type: String,
        required: true,
        trim: true
    },
    diseaseName: {
        type: String,
        required: true,
        trim: true
    },
    cases: {
        type: Number,
        required: true
    },
    region: {
        state:{
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        town: {
            type: String,
            required: true
        }
    },
    addedBy: {
        type: String,
        ref: 'users',
        required: true,
        trim: true
    },
    hospitalID: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the disease model
const disease = mongoose.model('disease', diseaseSchema);

module.exports = disease;