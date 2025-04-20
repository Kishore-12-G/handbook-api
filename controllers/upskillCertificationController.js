const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all courses
exports.getAllCourse = async (req, res) => {
  try {
    const courses = await prisma.upskillCertification.findMany();
    res.status(200).json({
      success: true,
      data: courses,
      message: "All Courses Rendered successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to retrieve the courses",
      error: error.message
    });
  }
};

// Get course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await prisma.upskillCertification.findUnique({
      where: { certificationId: courseId }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      data: course,
      message: "Course rendered by ID"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve the course",
      error: error.message
    });
  }
};

// Create a new course
exports.createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    if (!courseData.course || !courseData.type || !courseData.price) {
      return res.status(400).json({
        success: false,
        message: "Course name, type, and price are required"
      });
    }

    const newCourse = await prisma.upskillCertification.create({
      data: courseData
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse
    });
  } catch (error) {
    console.error("Error creating course", error);
    res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message
    });
  }
};

// Update course by ID
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const courseData = req.body;

    const existingCourse = await prisma.upskillCertification.findUnique({
      where: { certificationId: courseId }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    const updatedCourse = await prisma.upskillCertification.update({
      where: { certificationId: courseId },
      data: courseData
    });

    res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Course updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update the course",
      error: error.message
    });
  }
};

// Delete course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const existingCourse = await prisma.upskillCertification.findUnique({
      where: { certificationId: courseId }
    });

    if (!existingCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found"
      });
    }

    await prisma.upskillCertification.delete({
      where: { certificationId: courseId }
    });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to delete the course",
      error: error.message
    });
  }
};
