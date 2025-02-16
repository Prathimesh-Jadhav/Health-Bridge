const mongoose = require('mongoose');

// Define the request schema
const requestSchema = new mongoose.Schema({
    hospitalID: {
        type: String,
        required: true,
        trim: true
    },
    requestID: {
        type: String,
        required: true,
        trim: true
    },
    request: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'pending'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    quantity: {
        type: Number,
        required: true
    },
    createdBy: {
        type: String,
        required: true,
        trim: true
    }
});

const request = mongoose.model('Request', requestSchema);

module.exports = request;