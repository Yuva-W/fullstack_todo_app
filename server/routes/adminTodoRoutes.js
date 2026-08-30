const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { getAllTodos, getTodoById, deleteTodo, getUserTodos } = require("../controllers/adminTodoController");

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

router.get(
    "/user/:id",
    authMiddleware,
    adminMiddleware,
    getUserTodos
);


module.exports = router;