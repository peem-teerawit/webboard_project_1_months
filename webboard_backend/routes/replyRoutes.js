const express = require('express');
const {
    createReply,
    updateReply,
    deleteReply
} = require('../controllers/replyController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createReply);
router.put('/:id', authMiddleware, updateReply);
router.delete('/:id', authMiddleware, deleteReply);

module.exports = router;
