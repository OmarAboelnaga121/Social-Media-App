const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    commenterId: {
        type: String,
        required: true
    },
    commentText: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = commentSchema;
