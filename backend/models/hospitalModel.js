const mongoose = require('mongoose');

// Define the hospital schema
const hospitalSchema = new mongoose.Schema({
    hospitalID: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hospitalName: {
        type: String,
        required: true,
        trim: true
    },
    doctorName: {
        type: String,
        required: true,
        trim: true
    },
    doctorID:{
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    state:{
        type: String,
        required: true,
        trim: true
    },
    district:{
        type: String,
        required: true,
        trim: true
    },
    town: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the hospital model
const hospital = mongoose.model('hospital', hospitalSchema);

module.exports = hospital;