const Todo = require("../models/Todo");

const createTodo = async (req, res, next) => {
    try {
        const { title, description } = req.body;

        const todo = await Todo.create({
            title,
            description,
            user: req.user.userId
        });

        res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo
        });
    } catch (error) {
        next(error);
    }
};

const getTodos = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { search, completed } = req.query;

        const filter = {
            user: req.user.userId
        };

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            };
        }

        if (completed !== undefined) {
            filter.completed = completed === "true";
        }

        const skip = (page - 1) * limit;

        const todos = await Todo.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Todo.countDocuments(filter);

        res.status(200).json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            todos
        });
    } catch (error) {
        next(error);
    }
};

const getTodoById = async (req, res, next) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        res.status(200).json({
            success: true,
            todo
        });
    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const { title, description, completed } = req.body;

        const updates = {};

        if (title !== undefined) {
            updates.title = title;
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (completed !== undefined) {
            updates.completed = completed;
        }

        const todo = await Todo.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.userId
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        });
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.userId
        });

        if (!todo) {
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo
};