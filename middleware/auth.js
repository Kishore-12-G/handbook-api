// middleware/auth.js
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();


const prisma = new PrismaClient();
exports.protect = async (req, res, next) => {
  let token;
  console.log('Auth middleware called');
  console.log('Authorization header:', req.headers.authorization);

  // Check for token in Authorization header with Bearer scheme
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Extract token from "Bearer <token>"
    token = req.headers.authorization.split(' ')[1];
    console.log('Token extracted:', token);
  }

  // Check if token exists
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    // Verify the token
    console.log('Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified. Decoded payload:', decoded);

    // Find user by userId from token using Prisma
    const user = await prisma.user.findUnique({
      where: { userId: decoded.userId },
      select: {
        userId: true,
        username: true,
        email: true,
        armyId: true,
        // Add other fields you need in routes
      }
    });
    
    if (!user) {
      console.log('User not found in database');
      return res.status(401).json({ message: 'User no longer exists' });
    }
    
    console.log('User found:', user.username);
    
    // Attach user to request object
    req.user = user;
    
    // Proceed to the route handler
    next();
  } catch (error) {
    console.log('Token verification error:', error.message);
    
    // Return appropriate error message based on error type
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please login again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    } else {
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  }
};

// Optional: Middleware to check if user has specific role
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'User role not authorized to access this route' 
      });
    }
    next();
  };
};