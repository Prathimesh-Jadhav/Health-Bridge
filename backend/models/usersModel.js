const mongoose = require('mongoose');
const hospital = require('./hospitalModel');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    doctorID: {
        type: String,
        required: true,
        trim: true 
    },
    role: {
        type: String,
        enum: ['admin', 'doctor'],
        default: 'doctor'
    }
});


// Create the user model
const user = mongoose.model('user', userSchema);

module.exports = user;