const express = require('express');
const {
    createReply,
    updateReply,
    deleteReply,
    getRepliesByThreadId // Import the new method
} = require('../controllers/replyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createReply);
router.put('/:id', authMiddleware, updateReply);
router.delete('/:id', authMiddleware, deleteReply);
router.get('/', getRepliesByThreadId); // Add this line for fetching replies

module.exports = router;
