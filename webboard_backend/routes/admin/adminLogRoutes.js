const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getLogSummary, getUserLogs, getAllUsernamesInLogs } = require('../../controllers/admin/adminLogController');

router.use(authMiddleware, adminMiddleware);

router.get('/logs', getLogSummary);
router.get('/user/:userId/logs', getUserLogs);
router.get('/get-all-user', getAllUsernamesInLogs);

module.exports = router;
