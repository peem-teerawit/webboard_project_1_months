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
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware'); // ตรวจสอบการนำเข้าด้วย
const router = express.Router();

router.post('/', authMiddleware, createThread);
router.get('/tags-summary', getAllTagsWithCounts);
router.get('/user/threads', authMiddleware, getThreadsByUsername);
router.get('/tags/:tag', getThreadsByTag);
router.get('/popular-thread', getPopularThreads);
router.get('/liked', authMiddleware, getUserLikedThreads);
router.post('/:threadId/like', authMiddleware, likeThread);
router.post('/:threadId/unlike', authMiddleware, unlikeThread);
router.get('/:id', getThreadById);
router.put('/:id', authMiddleware, updateThread);
router.delete('/:id', authMiddleware, deleteThread);
router.delete('/:id', authMiddleware, adminMiddleware, deleteThread); // อาจจะมีบรรทัดนี้ซ้ำให้ตรวจสอบ

// ย้ายบรรทัดนี้ไปที่จุดสิ้นสุด
router.get('/', getAllThreads);

module.exports = router;
