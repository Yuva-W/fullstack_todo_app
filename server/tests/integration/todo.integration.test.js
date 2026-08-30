process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../app");
const User = require("../../models/user");
const Todo = require("../../models/todo");

let mongoServer;

let userToken;
let otherUserToken;

let userId;
let otherUserId;
let todoId;
let otherTodoId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    // Create users
    const user = await User.create({
        name: "Test User",
        email: "user@test.com",
        password: "password123"
    });

    const otherUser = await User.create({
        name: "Other User",
        email: "other@test.com",
        password: "password123"
    });

    userId = user._id;
    otherUserId = otherUser._id;

    // Create tokens
    userToken = jwt.sign(
        {
            userId: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    otherUserToken = jwt.sign(
        {
            userId: otherUser._id,
            role: otherUser.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    // Create todos
    const todo = await Todo.create({
        title: "User Todo",
        description: "Todo belonging to user",
        user: user._id
    });

    const otherTodo = await Todo.create({
        title: "Other User Todo",
        description: "Todo belonging to another user",
        user: otherUser._id
    });

    todoId = todo._id;
    otherTodoId = otherTodo._id;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Todo Authentication", () => {

    test("Create todo without token → 401", async () => {
        const response = await request(app)
            .post("/api/todos")
            .send({
                title: "Test Todo"
            });

        expect(response.statusCode).toBe(401);
    });

    test("Get todos without token → 401", async () => {
        const response = await request(app)
            .get("/api/todos");

        expect(response.statusCode).toBe(401);
    });

    test("Get todo by ID without token → 401", async () => {
        const response = await request(app)
            .get(`/api/todos/${todoId}`);

        expect(response.statusCode).toBe(401);
    });
});

describe("Todo Creation", () => {

    test("Create valid todo → 201", async () => {
        const response = await request(app)
            .post("/api/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "New Todo",
                description: "Created during test"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.todo.title).toBe("New Todo");
        expect(response.body.todo.user).toBe(userId.toString());
    });

    test("Create todo without title → 400", async () => {
        const response = await request(app)
            .post("/api/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                description: "Missing title"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });

    test("Create todo with empty title → 400", async () => {
        const response = await request(app)
            .post("/api/todos")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "",
                description: "Empty title"
            });

        expect(response.statusCode).toBe(400);
    });
});

describe("Todo Reading", () => {

    test("User can get their todos → 200", async () => {
        const response = await request(app)
            .get("/api/todos")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.todos.length).toBeGreaterThan(0);
    });

    test("User can get their own todo → 200", async () => {
        const response = await request(app)
            .get(`/api/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.todo._id).toBe(todoId.toString());
    });

    test("User cannot get another user's todo → 404", async () => {
        const response = await request(app)
            .get(`/api/todos/${otherTodoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });
});

describe("Todo Update", () => {

    test("User can update their own todo → 200", async () => {
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Updated Todo",
                completed: true
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.todo.title).toBe("Updated Todo");
        expect(response.body.todo.completed).toBe(true);
    });

    test("User cannot update another user's todo → 404", async () => {
        const response = await request(app)
            .patch(`/api/todos/${otherTodoId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Hacked Todo"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });

    test("Update with empty body → 400", async () => {
        const response = await request(app)
            .patch(`/api/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`)
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe("Validation failed");
    });
});

describe("Todo Delete", () => {

    test("User cannot delete another user's todo → 404", async () => {
        const response = await request(app)
            .delete(`/api/todos/${otherTodoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });

    test("User can delete their own todo → 200", async () => {
        const response = await request(app)
            .delete(`/api/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("Deleted todo cannot be accessed → 404", async () => {
        const response = await request(app)
            .get(`/api/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.message).toBe("Todo not found");
    });
});

describe("Invalid Todo ID", () => {

    test("Get todo with invalid ID", async () => {
        const response = await request(app)
            .get("/api/todos/invalid-id")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("Update todo with invalid ID", async () => {
        const response = await request(app)
            .patch("/api/todos/invalid-id")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
                title: "Updated"
            });

        expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });

    test("Delete todo with invalid ID", async () => {
        const response = await request(app)
            .delete("/api/todos/invalid-id")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBeGreaterThanOrEqual(400);
    });
});