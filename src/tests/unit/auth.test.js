"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../../middleware/auth");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "supersecretkey";
describe("JWT Auth Middleware", () => {
    let req;
    let res;
    let next;
    beforeEach(() => {
        req = {
            headers: {},
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });
    it("blocks requests without token", () => {
        (0, auth_1.jwtAuthMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
    });
    it("blocks requests with invalid token", () => {
        req.headers["authorization"] = "Bearer invalidtoken";
        (0, auth_1.jwtAuthMiddleware)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
    });
    it("attaches user info on valid token", () => {
        const token = jsonwebtoken_1.default.sign({ id: "user1" }, JWT_SECRET);
        req.headers["authorization"] = `Bearer ${token}`;
        (0, auth_1.jwtAuthMiddleware)(req, res, next);
        expect(req.user).toBeDefined();
        expect(req.user.id).toBe("user1");
        expect(next).toHaveBeenCalled();
    });
});
