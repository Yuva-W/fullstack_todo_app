process.env.JWT_SECRET = "test-secret";

const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../app");
const User = require("../../models/user");

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

describe("Register Validation", () => {

    test("valid registration → 201", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
    });

    test("duplicate email → 409", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Another User",
                email: "test@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(409);
        expect(response.body.message).toBe(
            "Email already registered"
        );
    });

    test("missing name → 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: "new@example.com",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("missing email → 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("missing password → 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "new@example.com"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("short password → 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "short@example.com",
                password: "123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("invalid email → 400", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: "invalid-email",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("unknown field role is removed → 201", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Normal User",
                email: "normal@example.com",
                password: "password123",
                role: "admin"
            });

        expect(response.statusCode).toBe(201);

        const user = await User.findOne({
            email: "normal@example.com"
        });

        expect(user.role).toBe("user");
    });
});

describe("Login Validation", () => {

    beforeAll(async () => {
        await User.create({
            name: "Login User",
            email: "login@example.com",
            password: "$2b$10$abcdefghijklmnopqrstuu",
        });
    });

    test("missing email → 400", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("invalid email → 400", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "invalid-email",
                password: "password123"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });

    test("missing password → 400", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "login@example.com"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe(
            "Validation failed"
        );
    });
});