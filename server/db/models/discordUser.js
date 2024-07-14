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
    mail: {
        type: String,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        required: false,
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