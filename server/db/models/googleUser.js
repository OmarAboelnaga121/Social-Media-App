const mongoose = require('mongoose');

const GoogleUserSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true,
    },
    // Add other fields if needed
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoogleUser', GoogleUserSchema);