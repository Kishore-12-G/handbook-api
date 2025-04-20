const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs'); // Commented out bcrypt
require('dotenv').config();

const prisma = new PrismaClient();

// // Password hashing utility (commented out)
// const hashPassword = async (password) => {
//   const salt = await bcrypt.genSalt(10);
//   return await bcrypt.hash(password, salt);
// };

// @desc    Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, armyId } = req.body;

    // Skip hashing - use password directly
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password, // directly use plain password
        armyId
      }
    });

    res.status(201).json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      armyId: user.armyId,
      createdAt: user.createdAt,
      message:'User Registered Successfully'
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /users/{userId}
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.params.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      armyId: user.armyId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      message:'User Fetched Successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /users/{userId}
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email, armyId } = req.body;

    const user = await prisma.user.update({
      where: { userId: req.params.userId },
      data: {
        username,
        email,
        armyId,
        updatedAt: new Date().toISOString()
       
      }
    });

    res.status(200).json({
      userId: user.userId,
      username: user.username,
      email: user.email,
      armyId: user.armyId,
      updatedAt: user.updatedAt,
      message:'User Updated',
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    res.status(400).json({ message: error.message });
  }
};

// @desc    Change password
// @route   PUT /users/{userId}/password
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { userId: req.params.userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { currentPassword, newPassword } = req.body;

    // Direct password comparison instead of using bcrypt
    if (currentPassword !== user.password) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password with plain text
    await prisma.user.update({
      where: { userId: req.params.userId },
      data: { password: newPassword }
    });

    res.status(204).json({message:'Password Changed successfully'});
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /users/{userId}
// @access  Private
exports.deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({
      where: { userId: req.params.userId }
    });

    res.status(204).json({message:'User deleted successfully'});
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Direct password comparison instead of using bcrypt
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const expiresIn = parseInt(process.env.JWT_EXPIRE);

    const token = jwt.sign(
      { userId: user.userId },
      process.env.JWT_SECRET,
      { expiresIn }
    );

    res.status(200).json({
      token,
      expiresIn,
      userId: user.userId,
      username: user.username,
      message:'Login Successful'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};