const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getAllThreads, deleteThread, updateThread, getPopularThreadsbyAdmin, getPopularTagsbyAdmin  } = require('../../controllers/admin/adminThreadController');

router.use(authMiddleware, adminMiddleware);

router.get('/threads', getAllThreads);
router.get('/threads/popular', getPopularThreadsbyAdmin);
router.get('/threads/popular/tags', getPopularTagsbyAdmin);
router.put('/threads/:id', updateThread);
router.delete('/threads/:id', deleteThread);

module.exports = router;