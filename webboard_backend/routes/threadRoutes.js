const express = require('express');
const {
    createThread,
    getAllThreads,
    getThreadById,
    updateThread,
    deleteThread,
    getThreadsByUsername
} = require('../controllers/threadController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createThread);
router.get('/', getAllThreads);
router.get('/:id', getThreadById);
router.put('/:id', authMiddleware, updateThread);
router.delete('/:id', authMiddleware, deleteThread);
router.get('/user/threads', authMiddleware, getThreadsByUsername);

module.exports = router;
