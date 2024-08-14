const mongoose = require('mongoose');
const FriendSchema = require('./small models/friendsSchema');

const UserSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    photo: {
        type: String,
        required: false,
        default: `${process.env.theHost}/uploads\\307ce493-b254-4b2d-8ba4-d12c080d6651.jpg`,
    },
    postNumber: {
        type: Number,
        required: false,
        default: 0
    },
    friendNumber: {
        type: Number,
        required: false,
        default: 0
    },
    banned: {
        type: Boolean,
        default: false
    },
    mail: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: {
        type: [FriendSchema],
        required: true,
        default: []
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model("USER", UserSchema);