const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'No token provided' });

    // Split the token from the 'Bearer' prefix
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) return res.status(403).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(bearerToken, 'your_jwt_secret');
        
        // Log the decoded JWT
        console.log('Decoded JWT:', decoded);

        req.user = await User.findById(decoded.id);
        if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });   
    }
};

module.exports = authMiddleware;
