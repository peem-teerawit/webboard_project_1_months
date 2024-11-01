const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Log = require('../models/logModel'); // Import Log model

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Admin middleware to check if the user is an admin
exports.adminMiddleware = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }

    // // Log admin access
    // const logEntry = new Log({
    //     action: 'admin_access',
    //     userId: req.user._id,
    // });

    try {
        await logEntry.save();
    } catch (error) {
        console.error('Error logging admin access:', error);
    }

    next();
};
