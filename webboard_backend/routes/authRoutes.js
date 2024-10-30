const express = require('express');
const { register, login, deleteUser } = require('../controllers/authController');
const { deleteReply } = require('../controllers/replyController');
const { deleteThread } = require('../controllers/threadController');

const router = express.Router();

// User registration
router.post('/register', register);
// User login
router.post('/login', login);

module.exports = router;
