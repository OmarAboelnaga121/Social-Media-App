const mongoose = require('mongoose');
const FriendSchema = require('./small models/friendsSchema');

const DiscordUserSchema = new mongoose.Schema({
    discordId: {
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
        required: false,
        default: 'http://localhost:8001/uploads\\307ce493-b254-4b2d-8ba4-d12c080d6651.jpg',
    },
    friends: {
        type: [FriendSchema],
        required: true,
        default: []
    },
    // Add other fields if needed
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiscordUser', DiscordUserSchema);