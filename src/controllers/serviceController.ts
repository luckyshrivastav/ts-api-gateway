import { Request, Response } from "express";
import { serviceRegistry } from "../services/serviceRegistry";

export const registerService = (req: Request, res: Response): Response => {
  const { serviceName, baseURL, healthCheckURL } = req.body;

  if (!serviceName || !baseURL || !healthCheckURL) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    serviceRegistry.register({ serviceName, baseURL, healthCheckURL, healthy: true });
    return res.status(201).json({ message: "Service registered successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const listServices = (_req: Request, res: Response): Response => {
  try {
    const services = serviceRegistry.list();
    return res.status(200).json(services);
  } catch (error) {
    return res.status(500).json({ error: "Unable to list services" });
  }
};
