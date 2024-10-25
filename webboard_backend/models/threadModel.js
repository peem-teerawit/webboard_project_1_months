const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_name: {type: mongoose.Schema.Types.String, ref: 'User'},
    created_at: { type: Date, default: Date.now },
    is_anonymous: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    expire_at: { type: Date, required: false },
    likes: { type: Number, default: 0 }, // Add this line for likes
    liked_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Optional: to keep track of users who liked the thread
});

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;
