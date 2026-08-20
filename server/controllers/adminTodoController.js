const Todo = require("../models/Todo");

const getAllTodos = async (req, res, next) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const { search, completed } = req.query;

        const filter = {};

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
            .populate("user", "name email")
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
        const todo = await Todo.findById(req.params.id)
            .populate("user", "name email");

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

const deleteTodo = async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);

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
    getAllTodos,
    getTodoById,
    deleteTodo
};