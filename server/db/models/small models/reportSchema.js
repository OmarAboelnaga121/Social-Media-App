const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reporterId: {
        type: String,
        required: true
    },
    reportReason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = reportSchema;