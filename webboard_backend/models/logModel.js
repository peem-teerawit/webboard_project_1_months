const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: { type: String, required: true }, 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    username: {type: mongoose.Schema.Types.String, ref: 'User'},
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' }, 
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);
