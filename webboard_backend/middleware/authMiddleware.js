const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });

    const tokenParts = authHeader.split(' ');
    if (tokenParts[0] !== 'Bearer' || !tokenParts[1]) {
        return res.status(403).json({ message: 'Invalid token format' });
    }
    const bearerToken = tokenParts[1];

    try {
        const decoded = jwt.verify(bearerToken, 'your_jwt_secret');
        console.log('Decoded JWT:', decoded);

        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

        return next(); // Add return here for safety
    } catch (error) {
        const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Unauthorized';
        return res.status(401).json({ message });
    }
};

const adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    return next();
};

module.exports = { authMiddleware, adminMiddleware };
