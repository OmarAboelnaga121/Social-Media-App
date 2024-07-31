const mongoose = require('mongoose');
const FriendSchema = require('./small models/friendsSchema');

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
    postNumber: {
        type: Number,
        required: false,
        default: 0
    },
    mail: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: true,
        default: 'http://localhost:3000/uploads\\307ce493-b254-4b2d-8ba4-d12c080d6651.jpg',
    },
    postNumber: {
        type: Number,
        required: false,
        default: 0
    },
    friends: {
        type: [FriendSchema],
        required: true,
        default: []
    },
    // Add other fields if needed
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GoogleUser', GoogleUserSchema);