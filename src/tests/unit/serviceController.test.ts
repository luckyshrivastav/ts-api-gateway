import { registerService, listServices } from "./../../controllers/serviceController";
import { serviceRegistry } from "./../../services/serviceRegistry";
import { Request, Response } from "express";

jest.mock("./../../services/serviceRegistry");

const mockResponse = () => {
  const res = {} as Partial<Response>;
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn().mockReturnThis();
  return res as Response;
};

describe("Service Controller (Unit Tests)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test cases for register service
  describe("registerService", () => {
    it("should return 400 if any field is missing", () => {
      const req = {
        body: {
          serviceName: "test-service"
          // missing baseURL and healthCheckURL
        }
      } as Request;

      const res = mockResponse();

      registerService(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should register the service and return 201", () => {
      const req = {
        body: {
          serviceName: "userService",
          baseURL: "http://localhost:3001",
          healthCheckURL: "http://localhost:3001/health"
        }
      } as Request;

      const res = mockResponse();

      registerService(req, res);

      expect(serviceRegistry.register).toHaveBeenCalledWith({
        serviceName: "userService",
        baseURL: "http://localhost:3001",
        healthCheckURL: "http://localhost:3001/health",
        healthy: true
      });

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should handle internal server error", () => {
      const req = {
        body: {
          serviceName: "userService",
            baseURL: "http://localhost:3001",
            healthCheckURL: "http://localhost:3001/health",
        }
      } as Request;

      const res = mockResponse();
      (serviceRegistry.register as jest.Mock).mockImplementation(() => {
        throw new Error("Boom!");
      });

      registerService(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });


  // Test cases for list service
  describe("listServices", () => {
    it("should return list of services", () => {
      const res = mockResponse();
      const req = {} as Request;

      const services = [
        { 
            serviceName: "userService",
            baseURL: "http://localhost:3001",
            healthCheckURL: "http://localhost:3001/health", 
            healthy: true 
        }
      ];

      (serviceRegistry.list as jest.Mock).mockReturnValue(services);

      listServices(req, res);
      expect(res.json).toHaveBeenCalledWith(services);
    });

    it("should handle list error", () => {
      const res = mockResponse();
      const req = {} as Request;

      (serviceRegistry.list as jest.Mock).mockImplementation(() => {
        throw new Error("List error");
      });

      listServices(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
