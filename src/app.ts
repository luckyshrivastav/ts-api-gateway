import express from "express";
import { registerService, listServices } from "./controllers/serviceRegistry";
import { jwtAuthMiddleware } from "./middleware/auth";
import { rateLimiterMiddleware } from "./services/rateLimiter";
import { loggingMiddleware } from "./middleware/logger";
import { proxyRequest } from "./proxy/proxyHandler";
import { startHealthChecks } from "./services/healthChecker";

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.post("/register", registerService);
app.get("/services", listServices);

app.use("/api/:serviceName", jwtAuthMiddleware, rateLimiterMiddleware, proxyRequest);

startHealthChecks();

export default app;
