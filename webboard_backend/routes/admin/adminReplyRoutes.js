const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getAllReplies, deleteReply, updateReply } = require('../../controllers/admin/adminReplyController');

router.use(authMiddleware, adminMiddleware);

router.get('/replies', getAllReplies);
router.put('/replies/:id', updateReply);
router.delete('/replies/:id', deleteReply);

module.exports = router;