import { Request, Response } from "express";
import { serviceRegistry } from "../services/serviceRegistry";

export const registerService = (req: Request, res: Response) => {
  const { serviceName, baseURL, healthCheckURL } = req.body;

  if (!serviceName || !baseURL || !healthCheckURL) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  serviceRegistry.register({ serviceName, baseURL, healthCheckURL, healthy: true });
  return res.status(201).json({ message: "Service registered successfully" });
};

export const listServices = (_req: Request, res: Response) => {
  res.json(serviceRegistry.list());
};
