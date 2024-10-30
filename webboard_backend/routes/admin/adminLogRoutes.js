const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getLogSummary, getUserLogs } = require('../../controllers/admin/adminLogController');

router.use(authMiddleware, adminMiddleware);

router.get('/logs', getLogSummary);
router.get('/user/:userId/logs', getUserLogs);

module.exports = router;
