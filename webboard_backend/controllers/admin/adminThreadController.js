const Thread = require('../../models/threadModel');
const Reply = require('../../models/replyModel');
const User = require('../../models/userModel');

exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().populate('user_id', 'username');
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching threads', error });
    }
};

exports.updateThread = async (req, res) => {
    try {
        const { title, content } = req.body;
        const thread = await Thread.findById(req.params.id);
        
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        
        thread.title = title || thread.title;
        thread.content = content || thread.content;
        
        await thread.save();
        
        res.status(200).json({ message: 'Thread updated successfully', thread });
    } catch (error) {
        console.error("Error updating thread:", error);
        res.status(500).json({ message: 'Error updating thread', error: error.message || error });
    }
};

exports.deleteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (!thread) return res.status(404).json({ message: 'Thread not found' });
        
        // Delete related replies
        await Reply.deleteMany({ thread_id: thread._id });
        
        // Delete the thread itself
        await Thread.findByIdAndDelete(req.params.id);
        
        res.status(200).json({ message: 'Thread and replies deleted successfully' });
    } catch (error) {
        console.error("Error deleting thread:", error); 
        res.status(500).json({ message: 'Error deleting thread', error: error.message || error });
    }
};

exports.getPopularThreads = async (req, res) => {
    try {
        const threads = await Thread.aggregate([
            {
                $lookup: {
                    from: 'replies', 
                    localField: '_id', 
                    foreignField: 'thread_id', 
                    as: 'replies' 
                }
            },
            {
                $addFields: {
                    repliesCount: { $size: '$replies' } 
                }
            },
            {
                $sort: { repliesCount: -1 } 
            },
            {
                $lookup: {
                    from: 'users', 
                    localField: 'user_id', 
                    foreignField: '_id', 
                    as: 'user' 
                }
            },
            {
                $unwind: '$user'
            }
        ]).exec();

        res.status(200).json(threads);
    } catch (error) {
        console.error("Error fetching popular threads:", error);
        res.status(500).json({ message: 'Error fetching popular threads', error: error.message || error });
    }
};

exports.getPopularTags = async (req, res) => {
    try {
        const tags = await Thread.aggregate([
            { $unwind: '$tags' }, 
            {
                $group: {
                    _id: '$tags',
                    count: { $sum: 1 } 
                }
            },
            { $sort: { count: -1 } }, 
            { $limit: 10 } 
        ]).exec();

        res.status(200).json(tags);
    } catch (error) {
        console.error("Error fetching popular tags:", error);
        res.status(500).json({ message: 'Error fetching popular tags', error: error.message || error });
    }
};

