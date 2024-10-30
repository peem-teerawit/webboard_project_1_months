const Log = require('../../models/logModel');

exports.getLogSummary = async (req, res) => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    try {
        // Fetch logs for today
        const todayLogs = await Log.find({
            timestamp: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('userId', 'username').exec();

        // Calculate today's total views
        const todayTotalViews = todayLogs.filter(log => log.action === 'view_thread').length;

        // Calculate each user's views for today
        const userTodayViews = todayLogs.reduce((acc, log) => {
            if (log.action === 'view_thread') {
                const userId = log.userId ? log.userId.username : 'Unknown User';
                acc[userId] = (acc[userId] || 0) + 1;
            }
            return acc;
        }, {});

        // Fetch all logs to calculate total views
        const allLogs = await Log.find({
            action: 'view_thread'
        });

        // Calculate total views
        const totalViews = allLogs.length;

        // Prepare the response summary
        const summary = {
            totalViews,
            todayTotalViews,
            userTodayViews
        };

        res.status(200).json({ summary, logs: todayLogs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching log summary', error });
    }
};

// Function to get logs for a specific user
exports.getUserLogs = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    try {
        // Fetch logs for the specific user and populate fields
        const userLogs = await Log.find({ userId })
            .populate('userId', 'username') // Populate the username field
            .populate('threadId', 'title') // Populate the thread title
            .exec();

        // Extract the username from the populated data
        const username = userLogs.length > 0 ? userLogs[0].userId.username : 'Unknown User';

        // Calculate the total number of actions for each type
        const actionSummary = userLogs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});

        // Send response with userId, username, action summary, and logs
        res.status(200).json({ userId, username, actionSummary, logs: userLogs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user logs', error });
    }
};

// function to get all users's name in the logs 
exports.getAllUsernamesInLogs = async (req, res) => {
    try {
        // Aggregate logs to get unique user IDs and populate the username field
        const userNames = await Log.aggregate([
            {
                $group: {
                    _id: "$userId", // Group by userId
                },
            },
            {
                $lookup: { // Populate userId to get username
                    from: "users", // Name of the users collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "userInfo",
                },
            },
            {
                $unwind: "$userInfo", // Unwind the userInfo array to access the username field
            },
            {
                $project: {
                    _id: 0, // Remove the _id field
                    username: "$userInfo.username", // Only include username in results
                },
            },
        ]);

        // Extract only usernames into a list
        const usernames = userNames.map(user => user.username);

        res.status(200).json({ usernames });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching usernames from logs', error });
    }
};