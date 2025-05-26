// src/services/rateLimiter.ts
import { Request, Response, NextFunction } from "express";

export const rateLimiterStore = new Map<string, { count: number; resetTime: number }>();

const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || "2");
const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000");

const getKey = (req: Request): string => {
  const ip = req.ip;
  const userId = (req as any).user?.id || "anonymous";
  return `${userId}:${ip}`;
};

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const key = getKey(req);
    const now = Date.now();
    const entry = rateLimiterStore.get(key);

    if (!entry || entry.resetTime < now) {
      rateLimiterStore.set(key, { count: 1, resetTime: now + WINDOW_MS });
      return next();
    }

    if (entry.count >= MAX_REQUESTS) {
      return res.status(429).json({ error: "Rate limit exceeded" });
    }

    entry.count++;

    //console.log(`[RateLimiter] ${key} → ${entry?.count}`);
    return next();
    
  } catch (error) {
    return res.status(500).json({error:"Internal Server error"});
  }
  
};
