import { Request, Response } from "express";
import httpProxy from "http-proxy";
import { serviceRegistry } from "../services/serviceRegistry";

const proxy = httpProxy.createProxyServer();

export const proxyRequest = (req: Request, res: Response) => {
  const pathParts = req.path.split("/").filter(Boolean); // e.g., ["api", "serviceName", ...]
  if (pathParts.length < 2) {
    return res.status(400).json({ error: "Invalid service path" });
  }

  const serviceName = pathParts[1];
  const service = serviceRegistry.get(serviceName);

  if (!service || !service.healthy) {
    return res.status(502).json({ error: `Service ${serviceName} unavailable` });
  }

  const targetURL = service.baseURL;

  // Remove /api/{serviceName} prefix from path
  req.url = req.url!.replace(`/api/${serviceName}`, "") || "/";

  proxy.web(req, res, { target: targetURL, changeOrigin: true }, (err) => {
    console.error(`Proxy error for service ${serviceName}:`, err);
    res.status(502).json({ error: "Proxy error" });
  });
};
