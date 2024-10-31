const Log = require('../../models/logModel');

// Get log summary for today, this month, and this year
exports.getLogSummary = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    // Start of this month
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    // Start of this year
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    try {
        // Fetch logs for today
        const todayLogs = await Log.find({
            timestamp: {
                $gte: today,
                $lt: tomorrow
            }
        }).populate('userId', 'username').lean().exec();

        // Fetch logs for this month
        const monthlyLogs = await Log.find({
            timestamp: {
                $gte: startOfMonth,
                $lt: tomorrow // Use tomorrow to include all of today
            }
        }).populate('threadId').lean().exec();

        // Fetch logs for this year
        const yearlyLogs = await Log.find({
            timestamp: {
                $gte: startOfYear,
                $lt: tomorrow // Use tomorrow to include all of today
            }
        }).populate('threadId').lean().exec();

        const todayTotalViews = todayLogs.filter(log => log.action === 'view_thread').length;

        // Unique thread IDs for today, this month, and this year
        const todayBoardsViewed = [...new Set(todayLogs.map(log => log.threadId))].length;
        const monthlyBoardsViewed = [...new Set(monthlyLogs.map(log => log.threadId))].length;
        const yearlyBoardsViewed = [...new Set(yearlyLogs.map(log => log.threadId))].length;

        // Count of boards created today, this month, and this year
        const todayBoardsCreated = todayLogs.filter(log => log.action === 'create_thread').length;
        const monthlyBoardsCreated = monthlyLogs.filter(log => log.action === 'create_thread').length;
        const yearlyBoardsCreated = yearlyLogs.filter(log => log.action === 'create_thread').length;

        // Get unique usernames of users who viewed threads today
        const todayUsernames = [...new Set(todayLogs.map(log => log.userId.username))];

        const summary = {
            today: {
                totalViews: todayTotalViews,
                boardsViewed: todayBoardsViewed,
                boardsCreated: todayBoardsCreated,
                userViews: todayUsernames // Include the usernames of users
            },
            month: {
                totalViews: monthlyLogs.filter(log => log.action === 'view_thread').length,
                boardsViewed: monthlyBoardsViewed,
                boardsCreated: monthlyBoardsCreated,
            },
            year: {
                totalViews: yearlyLogs.filter(log => log.action === 'view_thread').length,
                boardsViewed: yearlyBoardsViewed,
                boardsCreated: yearlyBoardsCreated,
            },
        };

        res.status(200).json({ summary, logs: todayLogs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching log summary', error: error.message });
    }
};



// Get logs for a specific user
exports.getUserLogs = async (req, res) => {
    const { userId } = req.params; // Get userId from request parameters

    // Validate userId format (you can customize this as needed)
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ message: 'Invalid user ID format' });
    }

    try {
        // Fetch logs for the specific user and populate fields
        const userLogs = await Log.find({ userId })
            .populate('userId', 'username') // Populate the username field
            .populate('threadId', 'title') // Populate the thread title
            .lean().exec();

        const username = userLogs.length > 0 ? userLogs[0].userId.username : 'Unknown User';

        // Calculate the total number of actions for each type
        const actionSummary = userLogs.reduce((acc, log) => {
            acc[log.action] = (acc[log.action] || 0) + 1;
            return acc;
        }, {});

        // Send response with userId, username, action summary, and logs
        res.status(200).json({ userId, username, actionSummary, logs: userLogs });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user logs', error: error.message });
    }
};

// Get all usernames in the logs
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
        ]).lean(); // Use lean() for better performance

        // Extract only usernames into a list
        const usernames = userNames.map(user => user.username);

        res.status(200).json({ usernames });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching usernames from logs', error: error.message });
    }
};
