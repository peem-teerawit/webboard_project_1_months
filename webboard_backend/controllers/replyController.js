const Reply = require('../models/replyModel');

// Create a new reply
exports.createReply = async (req, res) => {
    const { thread_id, content, is_anonymous } = req.body;
    const newReply = new Reply({
        thread_id,
        user_id: req.user.id,
        user_name: req.user.username,
        content,
        is_anonymous
    });

    try {
        await newReply.save();
        res.status(201).json(newReply);
    } catch (error) {
        res.status(400).json({ message: 'Error creating reply', error });
    }
};

// Edit a reply
exports.updateReply = async (req, res) => {
    const reply = await Reply.findById(req.params.id);
    if (reply && String(reply.user_id) === req.user.id) {
        reply.content = req.body.content;
        await reply.save();
        res.json(reply);
    } else {
        res.status(403).json({ message: 'Unauthorized to edit this reply' });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findById(req.params.id);  // Find the reply by its ID
        if (reply && String(reply.user_id) === req.user.id) {  // Check if the reply belongs to the user
            await Reply.deleteOne({ _id: req.params.id });  // Use deleteOne to remove the reply
            res.json({ message: 'Reply deleted successfully' });  // Send success response
        } else {
            res.status(403).json({ message: 'Unauthorized to delete this reply' });  // If unauthorized, return 403
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reply', error });
    }
};

// Fetch replies by thread ID
exports.getRepliesByThreadId = async (req, res) => {
    const { thread_id } = req.query; // Get thread_id from query parameters
    try {
        const replies = await Reply.find({ thread_id }); // Find replies with the specified thread_id
        res.json(replies); // Return the replies
    } catch (error) {
        res.status(500).json({ message: 'Error fetching replies', error });
    }
};

