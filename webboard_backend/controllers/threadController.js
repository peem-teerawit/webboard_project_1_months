const Thread = require('../models/threadModel');
const Reply = require('../models/replyModel'); // Import the Reply model

// Create a new thread
exports.createThread = async (req, res) => {
    const { title, content, is_anonymous, tags, expire_at } = req.body;

    // Set expire_at to null if not provided
    const newThread = new Thread({
        title,
        content,
        user_id: req.user.id,
        user_name: req.user.username,
        is_anonymous,
        tags,
        expire_at: expire_at || null // Set to null if not provided
    });

    try {
        await newThread.save();
        res.status(201).json(newThread);
    } catch (error) {
        res.status(400).json({ message: 'Error creating thread', error });
    }
};

// Get all threads with reply counts
exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.aggregate([
            {
                $lookup: {
                    from: 'replies', // Ensure this matches your replies collection name
                    localField: '_id',
                    foreignField: 'thread_id',
                    as: 'replies'
                }
            },
            {
                $addFields: {
                    comments: { $size: "$replies" } // Add 'comments' as the count of replies
                }
            },
            {
                $project: { replies: 0 } // Optional: exclude the replies array itself if not needed
            }
        ]);

        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving threads with reply counts', error });
    }
};


// Get a thread by ID
exports.getThreadById = async (req, res) => {
    const thread = await Thread.findById(req.params.id).populate('user_id', 'username').exec();
    if (thread) {
        res.json(thread);
    } else {
        res.status(404).json({ message: 'Thread not found' });
    }
};

// Edit a thread
exports.updateThread = async (req, res) => {
    const { title, content, tags, is_anonymous, expire_at } = req.body;
    const thread = await Thread.findById(req.params.id);

    if (thread && String(thread.user_id) === req.user.id) {
        thread.title = title;
        thread.content = content;
        thread.tags = tags;
        thread.is_anonymous = is_anonymous;
        thread.expire_at = expire_at;
        await thread.save();
        res.json(thread);
    } else {
        res.status(403).json({ message: 'Unauthorized to edit this thread' });
    }
};

// Delete a thread
exports.deleteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (thread && String(thread.user_id) === req.user.id) {
            await Thread.findByIdAndDelete(req.params.id); // Use findByIdAndDelete
            res.json({ message: 'Thread deleted successfully' });
        } else {
            res.status(403).json({ message: 'Unauthorized to delete this thread' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting thread', error });
    }
};

// Get all threads by a specific username
exports.getThreadsByUsername = async (req, res) => {
    try {
        const username = req.user.username; // Assuming username is available in req.user (from JWT token)

        // Find all threads where the user_name matches the logged-in user's username
        const userThreads = await Thread.find({ user_name: username });

        res.json(userThreads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user threads', error });
    }
};

// Delete expired threads and their replies
exports.deleteExpiredThreads = async () => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Find threads where expire_at is less than the current date and not null
        const expiredThreads = await Thread.find({
            expire_at: { $lt: currentDate, $ne: null }
        });

        if (expiredThreads.length > 0) {
            const threadIds = expiredThreads.map(thread => thread._id); // Collect the thread IDs of expired threads

            // Delete the expired threads
            const threadResult = await Thread.deleteMany({
                _id: { $in: threadIds }
            });

            // Delete replies related to the expired threads
            const replyResult = await Reply.deleteMany({
                thread_id: { $in: threadIds }
            });

            console.log(`Deleted ${threadResult.deletedCount} expired thread(s) and ${replyResult.deletedCount} reply/replies.`);
        } else {
            console.log('There are no expired threads.');
        }
    } catch (error) {
        console.error('Error deleting expired threads and their replies:', error);
    }
};

// Get threads by tag
exports.getThreadsByTag = async (req, res) => {
    try {
        const tag = req.params.tag;
        console.log(`Searching for threads with tag: ${tag}`);

        // Find threads that contain the specified tag in the 'tags' array
        const threadsWithTag = await Thread.find({ tags: tag });

        if (threadsWithTag.length > 0) {
            res.json(threadsWithTag);
        } else {
            console.log(`No threads found for tag: ${tag}`);
            res.status(404).json({ message: 'No threads found with the specified tag' });
        }
    } catch (error) {
        console.error('Error retrieving threads by tag:', error);
        res.status(500).json({ message: 'Error retrieving threads by tag', error });
    }
};


// Get all tags and their counts
exports.getAllTagsWithCounts = async (req, res) => {
    try {
        // Use aggregation to unwind the tags array and count occurrences of each tag
        const tagsWithCounts = await Thread.aggregate([
            { $unwind: "$tags" }, // Decompose the tags array into individual tags
            { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by each tag and count occurrences
            { $sort: { count: -1 } } // Sort by count in descending order
        ]);

        // Check if no tags are found
        if (tagsWithCounts.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }

        // Return the tags with counts
        res.json(tagsWithCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tags with counts', error });
    }
};



