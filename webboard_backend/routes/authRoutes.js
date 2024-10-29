const express = require('express');
const { register, login } = require('../controllers/authController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/admin', authMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Welcome Admin!' });
});

module.exports = router;
