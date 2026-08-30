const express = require("express");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminTodoRoutes = require("./routes/adminTodoRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(express.json({limit: "40kb"}));
app.use(express.urlencoded({limit:"40kb", extended: true}));
app.use(cors());

app.get("/", (req, res) => {
    res.json({
        message: "TaskFlow API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/todos", adminTodoRoutes);

app.use("/api/users", userRoutes);

// Error middleware must be last
app.use(errorMiddleware);

module.exports = app;