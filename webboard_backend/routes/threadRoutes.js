const express = require('express');
const {
    createThread,
    getAllThreads,
    getThreadById,
    updateThread,
    deleteThread,
    getThreadsByUsername,
    getThreadsByTag,
    getAllTagsWithCounts,
    getPopularThreads
} = require('../controllers/threadController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createThread);
router.get('/tags-summary', getAllTagsWithCounts);
router.get('/user/threads', authMiddleware, getThreadsByUsername);
router.get('/tags/:tag', getThreadsByTag);
router.get('/popular-thread', getPopularThreads);
router.get('/:id', getThreadById);
router.put('/:id', authMiddleware, updateThread);
router.delete('/:id', authMiddleware, deleteThread);
router.get('/', getAllThreads);

module.exports = router;
