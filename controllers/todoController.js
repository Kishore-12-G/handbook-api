const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createTodo = async (req, res) => {
    try {
        const { activity, description, status, priority, dueDate } = req.body;

        const todo = await prisma.todo.create({
            data: {
                todoId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Generate unique todoId
                userId: req.user.userId,
                activity,
                description,
                status: status || "pending",
                priority: priority || "medium",
                dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        });

        res.status(201).json(
            {
                todoId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15), // Generate unique todoId
                userId: req.user.userId,
                activity,
                description,
                status: status || "pending",
                priority: priority || "medium",
                dueDate,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                message: 'Todo List Added'
            }
        );
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: { userId: req.user.userId }
        });
        res.status(200).json({
            todos,
            message:"All the todos are fetched successfully"
    });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTodoById = async (req, res) => {
    try {
        const todo = await prisma.todo.findFirst({
            where: {
                todoId: req.params.todoId,
                userId: req.user.userId
            }
        });
        
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({
            todo,
            message:'todo fetched successfully'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { activity, description, priority, dueDate } = req.body;

        // First check if the todo exists and belongs to the user
        const existingTodo = await prisma.todo.findFirst({
            where: {
                todoId: req.params.todoId,
                userId: req.user.userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const todo = await prisma.todo.update({
            where: {
                todoId: req.params.todoId
            },
            data: {
                activity,
                description,
                priority,
                dueDate,
                updatedAt: new Date().toISOString()
            }
        });

        res.status(200).json({
            todo,
            message:'Todo updated successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateTodoStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["pending", "in-progress", "completed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // First check if the todo exists and belongs to the user
        const existingTodo = await prisma.todo.findFirst({
            where: {
                todoId: req.params.todoId,
                userId: req.user.userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        const todo = await prisma.todo.update({
            where: {
                todoId: req.params.todoId
            },
            data: { 
                status,
                updatedAt: new Date().toISOString()
            }
        });

        res.status(200).json({
            todoId: todo.todoId,
            status: todo.status,
            updatedAt: todo.updatedAt,
            message:'Todo Status Updated Successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        // First check if the todo exists and belongs to the user
        const existingTodo = await prisma.todo.findFirst({
            where: {
                todoId: req.params.todoId,
                userId: req.user.userId
            }
        });

        if (!existingTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        await prisma.todo.delete({
            where: {
                todoId: req.params.todoId
            }
        });
        res.status(204).send({
            message:'Todo Deleted Successfully'
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};