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
    getPopularThreads,
    likeThread,
    unlikeThread,
    getUserLikedThreads
} = require('../controllers/threadController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createThread);
router.get('/tags-summary', getAllTagsWithCounts);
router.get('/user/threads', authMiddleware, getThreadsByUsername);
router.get('/tags/:tag', getThreadsByTag);
router.get('/popular-thread', getPopularThreads);

// Add a route for getting threads liked by the user, before the ID-based route
router.get('/liked', authMiddleware, getUserLikedThreads);

router.post('/:threadId/like', authMiddleware, likeThread);
router.post('/:threadId/unlike', authMiddleware, unlikeThread);
router.get('/:id', getThreadById); // Ensure this is placed after `/liked`
router.put('/:id', authMiddleware, updateThread);
router.delete('/:id', authMiddleware, deleteThread);
router.get('/', getAllThreads);

module.exports = router;
