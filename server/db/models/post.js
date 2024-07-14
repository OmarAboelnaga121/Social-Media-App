const mongoose = require('mongoose');
const commentSchema = require('./small models/commentSchema');
const reportSchema = require('./small models/reportSchema');

const PostSchema = new mongoose.Schema({
    CreatorId: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    Likes: {
        type: Number,
        required: false,
        default: 0
    },
    Comments: {
        type: [commentSchema],
        required: false,
        default: []
    },
    CommentsNumber: {
        type: Number,
        default: 0
    },
    Report: {
        type: [reportSchema],
        required: false,
        default: []
    },
    ReportsNumber: {
        type: Number,
        required: false,
        default: 0
    }
});

module.exports = mongoose.model("POST", PostSchema);
