import axios from "axios";
import { serviceRegistry } from "./serviceRegistry";

const INTERVAL_MS = parseInt(process.env.HEALTH_CHECK_INTERVAL_MS || "30000");

export function startHealthChecks() {
  setInterval(async () => {
    const services = serviceRegistry.list();
    for (const service of services) {
      try {
        const response = await axios.get(service.healthCheckURL, { timeout: 5000 });
        if (response.status === 200) {
          if (!service.healthy) {
            console.log(`Service ${service.serviceName} recovered`);
            serviceRegistry.markHealthy(service.serviceName, true);
          }
        } else {
          throw new Error(`Health check failed with status ${response.status}`);
        }
      } catch (err) {
        if (service.healthy) {
          console.warn(`Service ${service.serviceName} is unhealthy, marking unhealthy`);
          serviceRegistry.markHealthy(service.serviceName, false);
        }
      }
    }
  }, INTERVAL_MS);
}
