const express = require("express");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "TaskFlow API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

// Error middleware must be last
app.use(errorMiddleware);

module.exports = app;