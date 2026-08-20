const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllTodos, getTodoById, deleteTodo } = require("../controllers/adminTodoController");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getAllTodos
);

router.get(
    "/:id",
    authMiddleware,
    adminMiddleware,
    getTodoById
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteTodo
);

module.exports = router;