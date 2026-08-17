const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const validate = require("../middleware/validationMiddleware");

const {
    createTodoSchema,
    updateTodoSchema,
    getTodosQuerySchema
} = require("../middleware/validationSchemas");

const {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo
} = require("../controllers/todoController");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validate(createTodoSchema),
    createTodo
);

router.get(
    "/",
    authMiddleware,
    validate(getTodosQuerySchema, "query"),
    getTodos
);

router.get(
    "/:id",
    authMiddleware,
    getTodoById
);

router.patch(
    "/:id",
    authMiddleware,
    validate(updateTodoSchema),
    updateTodo
);

router.delete(
    "/:id",
    authMiddleware,
    deleteTodo
);

module.exports = router;