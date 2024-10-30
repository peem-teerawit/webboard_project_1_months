const Reply = require('../../models/replyModel');

exports.getAllReplies = async (req, res) => {
    try {
        const replies = await Reply.find().populate('user_id', 'username');
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching replies', error });
    }
};

exports.updateReply = async (req, res) => {
    try {
        const { content } = req.body; 
        const reply = await Reply.findById(req.params.id);
        
        if (!reply) return res.status(404).json({ message: 'Reply not found' });

        reply.content = content || reply.content; 

        await reply.save(); 

        res.status(200).json({ message: 'Reply updated successfully', reply });
    } catch (error) {
        console.error("Error updating reply:", error);
        res.status(500).json({ message: 'Error updating reply', error: error.message || error });
    }
};

exports.deleteReply = async (req, res) => {
    try {
        const reply = await Reply.findByIdAndDelete(req.params.id);
        if (!reply) return res.status(404).json({ message: 'Reply not found' });
        res.status(200).json({ message: 'Reply deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting reply', error });
    }
};