const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getAllThreads, deleteThread, updateThread, getPopularThreads, getPopularTags  } = require('../../controllers/admin/adminThreadController');

router.use(authMiddleware, adminMiddleware);

router.get('/threads', getAllThreads);
router.get('/threads/popular', getPopularThreads);
router.get('/threads/popular/tags', getPopularTags);
router.put('/threads/:id', updateThread);
router.delete('/threads/:id', deleteThread);

module.exports = router;