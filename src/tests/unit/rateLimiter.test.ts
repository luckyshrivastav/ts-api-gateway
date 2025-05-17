// src/tests/unit/rateLimiter.test.ts
jest.resetModules();

import { Request, Response, NextFunction } from "express";
import { rateLimiterMiddleware, rateLimiterStore } from "../../services/rateLimiter";

describe("Rate Limiter (In-Memory)", () => {
let req: Partial<AuthenticatedRequest>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    // ✅ Reset config + store
    process.env.REDIS_ENABLED = "false";
    process.env.RATE_LIMIT_MAX = "2";
    process.env.RATE_LIMIT_WINDOW_MS = "60000";
    rateLimiterStore.clear();

    // ✅ Mock request
    req = {
      ip: "127.0.0.1",
      headers: {},
      user: { id: "test-user" } as any,
    };

    // ✅ Mock response
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("blocks requests over the limit", async () => {
    await rateLimiterMiddleware(req as Request, res as Response, next as NextFunction); // 1
    await rateLimiterMiddleware(req as Request, res as Response, next as NextFunction); // 2

    // 3rd request → should be blocked
    await rateLimiterMiddleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: "Rate limit exceeded" });
  });
});



import { AuthenticatedRequest } from "../../types/AuthenticatedRequest";
