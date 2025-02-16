const mongoose = require('mongoose');

// Define the patient schema
const patientSchema = new mongoose.Schema({
    patientName: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true
    },
    aadharNumber: {
        type: String,
        required: true,
        trim: true
    },
    sex: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    address: {
        state:{
            type: String,
            required: true,
            trim: true
        },
        district: {
            type: String,
            required: true,
            trim: true
        },
        town: {
            type: String,
            required: true,
            trim: true
        }
    },
    disease: {
        type: String,
        required: true,
        trim: true
    },
    doctorID:{
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the patient model
const patient = mongoose.model('patient', patientSchema);

module.exports = patient;