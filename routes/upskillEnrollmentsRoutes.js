const express = require('express');
const router = express.Router();
const {
  CreateEnrollments,
  getEnrollmentsById,
  updateEnrollment,
  getUserEnrollments
} = require("../controllers/upskillEnrollmentsController");
const { protect } = require('../middleware/auth');

// POST /upskill/enrollments
router.post('/', protect, CreateEnrollments);

// GET /upskill/enrollments/:enrollmentId
router.get('/:enrollmentId', getEnrollmentsById);

// PUT /upskill/enrollments/:enrollmentId
router.put('/:enrollmentId', updateEnrollment);

// GET /upskill/enrollments/users/:userId
router.get('/users/:userId', protect, getUserEnrollments);

module.exports = router;
