const Thread = require('../models/threadModel');
const Reply = require('../models/replyModel'); // Import the Reply model
const Log = require('../models/logModel');
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
        // Create a log entry
        await Log.create({ 
            action: 'create_thread', 
            userId: req.user.id,
            username: req.user.username,
            threadId: newThread._id 
        });
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

// Get popular threads
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
                    comments: { $size: "$replies" }
                }
            },
            {
                $sort: { comments: -1 } // Sort by most comments
            },
            {
                $limit: 5 // Limit the result to top 5 threads
            },
            {
                $project: { replies: 0 }
            }
        ]);
        
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving popular threads', error });
    }
};

exports.getThreadById = async (req, res) => {
    try {
        // Fetch the thread by ID, populating user_id if available
        const thread = await Thread.findById(req.params.id).populate('user_id', 'username').exec();
        if (!thread) {
            console.log('Thread not found');
            return res.status(404).json({ message: 'Thread not found' });
        }

        // Prepare response data
        const response = {
            id: thread._id,
            title: thread.title,
            content: thread.content,
            user_id: thread.user_id, // Always include user_id from the thread
            user_name: thread.user_id ? thread.user_id.username : null, // Include username if available
            is_anonymous: thread.is_anonymous,
            tags: thread.tags,
            expire_at: thread.expire_at,
            likes: thread.likes,
            liked_by: thread.liked_by,
            created_at: thread.created_at // Include created_at if you need it
        };

        // If the user is logged in, log the action
        if (req.user) {
            const logEntry = new Log({
                action: 'view_thread',
                userId: req.user.id,
                username: req.user.username,
                threadId: thread._id,
            });
            await logEntry.save(); // Save the log entry
        }

        res.json(response); // Send the structured response
    } catch (error) {
        console.error('Error retrieving thread:', error); // Log the error
        res.status(500).json({ message: 'Error retrieving thread', error });
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
        // Log successful update
        await Log.create({
            action: 'thread_updated',
            userId: req.user.id,
            username: req.user.username, // Include username
            threadId: thread._id,
        });
        res.json(thread);
    } else {
        res.status(403).json({ message: 'Unauthorized to edit this thread' });
    }
};

// Delete a thread and its related replies
exports.deleteThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.id);
        if (thread && String(thread.user_id) === req.user.id) {
            // First, delete the replies related to this thread
            await Reply.deleteMany({ thread_id: thread._id });

            // Then, delete the thread itself
            await Thread.findByIdAndDelete(req.params.id);

            await Log.create({ 
                action: 'thread_deleted', 
                userId: req.user.id, 
                username: req.user.username,
                threadId: thread._id 
            });
            res.json({ message: 'Thread and its replies deleted successfully' });
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
        const username = req.user.username;

        const userThreads = await Thread.find({ user_name: username });
        res.json(userThreads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user threads', error });
    }
};

// Delete expired threads and their replies
exports.deleteExpiredThreads = async () => {
    try {
        const currentDate = new Date();

        const expiredThreads = await Thread.find({
            expire_at: { $lt: currentDate, $ne: null }
        });

        if (expiredThreads.length > 0) {
            const threadIds = expiredThreads.map(thread => thread._id);

            const threadResult = await Thread.deleteMany({
                _id: { $in: threadIds }
            });

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
        const tagsWithCounts = await Thread.aggregate([
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        if (tagsWithCounts.length === 0) {
            return res.status(404).json({ message: 'No tags found' });
        }
        res.json(tagsWithCounts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tags with counts', error });
    }
};

// Like a thread
exports.likeThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        if (!thread.liked_by.includes(req.user.id)) {
            thread.likes++;
            thread.liked_by.push(req.user.id);
            await thread.save();
            return res.status(200).json(thread);
        }

        res.status(400).json({ message: 'User already liked this thread' });
    } catch (error) {
        res.status(500).json({ message: 'Error liking thread', error });
    }
};

// Unlike a thread
exports.unlikeThread = async (req, res) => {
    try {
        const thread = await Thread.findById(req.params.threadId);
        if (!thread) {
            return res.status(404).json({ message: 'Thread not found' });
        }

        if (thread.liked_by.includes(req.user.id)) {
            thread.likes--;
            thread.liked_by = thread.liked_by.filter(userId => userId.toString() !== req.user.id);
            await thread.save();
            return res.status(200).json(thread);
        }

        res.status(400).json({ message: 'User has not liked this thread' });
    } catch (error) {
        res.status(500).json({ message: 'Error unliking thread', error });
    }
};

// Get liked threads for the current user
exports.getUserLikedThreads = async (req, res) => {
    try {
        const threads = await Thread.find({ liked_by: req.user.id });
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving liked threads', error });
    }
};