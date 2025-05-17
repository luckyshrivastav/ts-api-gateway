"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serviceRegistry_1 = require("../../services/serviceRegistry");
describe("Service Registry", () => {
    const service = {
        serviceName: "userservice",
        baseURL: "http://localhost:5000",
        healthCheckURL: "http://localhost:5000/health",
        healthy: true,
    };
    beforeEach(() => {
        serviceRegistry_1.serviceRegistry.deregister(service.serviceName);
    });
    it("registers a service", () => {
        serviceRegistry_1.serviceRegistry.register(service);
        const result = serviceRegistry_1.serviceRegistry.get(service.serviceName);
        expect(result).toEqual(service);
    });
    it("deregisters a service", () => {
        serviceRegistry_1.serviceRegistry.register(service);
        serviceRegistry_1.serviceRegistry.deregister(service.serviceName);
        expect(serviceRegistry_1.serviceRegistry.get(service.serviceName)).toBeUndefined();
    });
    it("lists all services", () => {
        serviceRegistry_1.serviceRegistry.register(service);
        const services = serviceRegistry_1.serviceRegistry.list();
        expect(services).toContainEqual(service);
    });
    it("marks service as unhealthy", () => {
        serviceRegistry_1.serviceRegistry.register(service);
        serviceRegistry_1.serviceRegistry.markHealthy(service.serviceName, false);
        const result = serviceRegistry_1.serviceRegistry.get(service.serviceName);
        expect(result?.healthy).toBe(false);
    });
});
