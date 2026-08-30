const request = require("supertest");
const app = require("../../app");

describe("404 Not Found", () => {

    test("Unknown API endpoint → 404", async () => {
        const response = await request(app)
            .get("/api/does-not-exist");

        expect(response.statusCode).toBe(404);

        expect(response.body).toEqual({
            success: false,
            message: "API endpoint not found"
        });
    });

    test("Unknown API POST endpoint → 404", async () => {
        const response = await request(app)
            .post("/api/unknown");

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("API endpoint not found");
    });
});