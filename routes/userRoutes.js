// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  deleteUser
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Register route moved to authRoutes.js
// Keeping these routes protected
router.get('/:userId', protect, getUserProfile);
router.put('/:userId', protect, updateUserProfile);
router.put('/:userId/password', protect, changePassword);
router.delete('/:userId', protect, deleteUser);

module.exports = router;