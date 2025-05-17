import { serviceRegistry } from "../../services/serviceRegistry";

describe("Service Registry", () => {
  const service = {
    serviceName: "userservice",
    baseURL: "http://localhost:5000",
    healthCheckURL: "http://localhost:5000/health",
    healthy: true,
  };

  beforeEach(() => {
    serviceRegistry.deregister(service.serviceName);
  });

  it("registers a service", () => {
    serviceRegistry.register(service);
    const result = serviceRegistry.get(service.serviceName);
    expect(result).toEqual(service);
  });

  it("deregisters a service", () => {
    serviceRegistry.register(service);
    serviceRegistry.deregister(service.serviceName);
    expect(serviceRegistry.get(service.serviceName)).toBeUndefined();
  });

  it("lists all services", () => {
    serviceRegistry.register(service);
    const services = serviceRegistry.list();
    expect(services).toContainEqual(service);
  });

  it("marks service as unhealthy", () => {
    serviceRegistry.register(service);
    serviceRegistry.markHealthy(service.serviceName, false);
    const result = serviceRegistry.get(service.serviceName);
    expect(result?.healthy).toBe(false);
  });
});
