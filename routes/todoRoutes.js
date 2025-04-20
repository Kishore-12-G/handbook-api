// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const {
  createTodo,
  getAllTodos,
  getTodoById,
  updateTodo,
  updateTodoStatus,
  deleteTodo
} = require('../controllers/todoController');
const { protect } = require('../middleware/auth');

// Protect all routes
router.use(protect);

// Create TodoQ
router.post('/', createTodo);

// Get all Todos
router.get('/', getAllTodos);

// Get Todo by ID
router.get('/:todoId', getTodoById);

// Update Todo
router.put('/:todoId', updateTodo);

// Update Todo Status
router.put('/:todoId/status', updateTodoStatus);

// Delete Todo
router.delete('/:todoId', deleteTodo);

module.exports = router;