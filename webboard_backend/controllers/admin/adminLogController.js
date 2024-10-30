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
