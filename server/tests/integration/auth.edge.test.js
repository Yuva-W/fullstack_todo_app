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
let adminToken;
let userId;
let todoId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());

    const user = await User.create({
        name: "Test User",
        email: "user@test.com",
        password: "password123",
        role: "user"
    });

    const admin = await User.create({
        name: "Test Admin",
        email: "admin@test.com",
        password: "password123",
        role: "admin"
    });

    userId = user._id;
    adminId = admin._id;

    userToken = jwt.sign(
        {
            userId: user._id,
            role: "user"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    adminToken = jwt.sign(
        {
            userId: admin._id,
            role: "admin"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );

    const todo = await Todo.create({
        title: "Test Todo",
        description: "Test todo for authentication testing",
        user: user._id
    });

    todoId = todo._id;
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();

    await mongoServer.stop();
});

describe("Authentication Edge Cases", () => {

    // ==============================
    // AUTHENTICATION
    // ==============================

    test("GET /api/todos without token → 401", async () => {
        const response = await request(app)
            .get("/api/todos");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Authentication required"
        );
    });

    test("GET /api/todos with malformed Authorization → 401", async () => {
        const response = await request(app)
            .get("/api/todos")
            .set("Authorization", "Token abc123");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Authentication required"
        );
    });

    test("GET /api/todos with invalid token → 401", async () => {
        const response = await request(app)
            .get("/api/todos")
            .set("Authorization", "Bearer invalid-token");

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Invalid or expired token"
        );
    });

    test("GET /api/todos with expired token → 401", async () => {
        const expiredToken = jwt.sign(
            {
                userId,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "0s"
            }
        );

        const response = await request(app)
            .get("/api/todos")
            .set("Authorization", `Bearer ${expiredToken}`);

        expect(response.statusCode).toBe(401);

        expect(response.body.message).toBe(
            "Invalid or expired token"
        );
    });

    // ==============================
    // ADMIN AUTHORIZATION
    // ==============================

    test("User accessing /api/admin/users → 403", async () => {
        const response = await request(app)
            .get("/api/admin/users")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message).toBe(
            "Admin access required..!"
        );
    });

    test("Admin accessing /api/admin/users → 200", async () => {
        const response = await request(app)
            .get("/api/admin/users")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
    });

    test("User accessing admin todos → 403", async () => {
        const response = await request(app)
            .get("/api/admin/todos")
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message).toBe(
            "Admin access required..!"
        );
    });

    test("Admin accessing admin todos → 200", async () => {
        const response = await request(app)
            .get("/api/admin/todos")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
    });

    test("User accessing admin todo by ID → 403", async () => {
        const response = await request(app)
            .get(`/api/admin/todos/${todoId}`)
            .set("Authorization", `Bearer ${userToken}`);

        expect(response.statusCode).toBe(403);

        expect(response.body.message).toBe(
            "Admin access required..!"
        );
    });

    test("Admin accessing admin todo by ID → 200", async () => {
        const response = await request(app)
            .get(`/api/admin/todos/${todoId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
    });
});