const Thread = require('../models/threadModel');

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

// Get all threads
exports.getAllThreads = async (req, res) => {
    try {
        const threads = await Thread.find().exec(); // Removed populate
        res.json(threads);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving threads', error });
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

// Delete expired threads
exports.deleteExpiredThreads = async () => {
    try {
        // Get the current date
        const currentDate = new Date();

        // Find and delete threads where expire_at is less than the current date and not null
        const result = await Thread.deleteMany({
            expire_at: { $lt: currentDate, $ne: null } // $ne: null excludes threads with no expiration date
        });

        if (result.deletedCount > 0) {
            console.log(`Deleted ${result.deletedCount} expired thread(s).`);
        } else {
            console.log('There are no expired threads.');
        }
    } catch (error) {
        console.error('Error deleting expired threads:', error);
    }
};





