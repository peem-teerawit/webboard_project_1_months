const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const { getLogSummary } = require('../../controllers/admin/adminLogController');

router.use(authMiddleware, adminMiddleware);

router.get('/logs', getLogSummary);

module.exports = router;
