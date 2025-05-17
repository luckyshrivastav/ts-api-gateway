"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rateLimiter_1 = require("../../services/rateLimiter");
describe("Rate Limiter (In-Memory)", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        process.env.REDIS_ENABLED = "false";
        req = { ip: "127.0.0.1", user: { id: "user1" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it("allows request under the limit", async () => {
        for (let i = 0; i < 5; i++) {
            await (0, rateLimiter_1.rateLimiterMiddleware)(req, res, next);
        }
        expect(next).toHaveBeenCalledTimes(5);
    });
    it("blocks requests over the limit", async () => {
        const limit = 3;
        process.env.RATE_LIMIT_MAX = limit.toString();
        for (let i = 0; i < limit; i++) {
            await (0, rateLimiter_1.rateLimiterMiddleware)(req, res, next);
        }
        await (0, rateLimiter_1.rateLimiterMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(429);
        expect(res.json).toHaveBeenCalledWith({ error: "Rate limit exceeded" });
    });
});
