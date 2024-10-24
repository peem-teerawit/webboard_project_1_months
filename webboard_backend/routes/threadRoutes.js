const express = require('express');
const {
    createThread,
    getAllThreads,
    getThreadById,
    updateThread,
    deleteThread,
    getThreadsByUsername,
    getThreadsByTag,
    getAllTagsWithCounts
} = require('../controllers/threadController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createThread);
router.get('/tags-summary', getAllTagsWithCounts); // Specific route for tags summary before dynamic routes
router.get('/user/threads', authMiddleware, getThreadsByUsername);
router.get('/tags/:tag', getThreadsByTag);
router.get('/:id', getThreadById);
router.put('/:id', authMiddleware, updateThread);
router.delete('/:id', authMiddleware, deleteThread);
router.get('/', getAllThreads);

module.exports = router;
