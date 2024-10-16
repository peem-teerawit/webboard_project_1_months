const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    thread_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_name: { type: mongoose.Schema.Types.String, ref: 'User'},
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    is_anonymous: { type: Boolean, default: false }
});

const Reply = mongoose.model('Reply', replySchema);
module.exports = Reply;
