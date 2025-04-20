const express = require('express');
const router = express.Router();
const {
  getAllCourse,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/upskillCertificationController');
const { protect } = require('../middleware/auth');

router.get('/courses', getAllCourse);
router.get('/courses/:courseId', getCourseById);
router.post('/courses', protect, createCourse);
router.put('/courses/:courseId', protect, updateCourse);
router.delete('/courses/:courseId', protect, deleteCourse);

module.exports = router;
