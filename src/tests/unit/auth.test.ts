import { jwtAuthMiddleware, AuthenticatedRequest } from "../../middleware/auth";
import {  Response } from "express";
import jwt from "jsonwebtoken";


const JWT_SECRET = "supersecretkey";

describe("JWT Auth Middleware", () => {
  let req: AuthenticatedRequest;
  let res: Partial<Response>;
  let next: jest.Mock;

beforeEach(() => {
  req = {
    headers: {
      authorization: "",
    },
    user: undefined,
  } as unknown as AuthenticatedRequest;

  res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  next = jest.fn();
});


  it("blocks requests without token", () => {
    jwtAuthMiddleware(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("blocks requests with invalid token", () => {
    req.headers["authorization"] = "Bearer invalidtoken";
    jwtAuthMiddleware(req as AuthenticatedRequest, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("attaches user info on valid token", () => {
    const token = jwt.sign({ id: "user1" }, JWT_SECRET);
    req.headers["authorization"] = `Bearer ${token}`;

    jwtAuthMiddleware(req as AuthenticatedRequest, res as Response, next);
    expect(req.user).toBeDefined();
    expect(req.user.id).toBe("user1");
    expect(next).toHaveBeenCalled();
  });
});
