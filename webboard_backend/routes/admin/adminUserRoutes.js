const express = require('express');
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../../middleware/adminMiddleware');
const {
    getAllUsers,
    updateUserRole,
    deleteUser
} = require('../../controllers/admin/adminUserController');

router.use(authMiddleware, adminMiddleware); 

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;