export interface ServiceInfo {
  serviceName: string;
  baseURL: string;
  healthCheckURL: string;
  healthy: boolean;
}

class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services = new Map<string, ServiceInfo>();

  private constructor() {} // Prevent direct instantiation

  static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  register(service: ServiceInfo) {
    service.healthy = true;
    this.services.set(service.serviceName, service);
  }

  deregister(serviceName: string) {
    this.services.delete(serviceName);
  }

  get(serviceName: string): ServiceInfo | undefined {
    return this.services.get(serviceName);
  }

  list(): ServiceInfo[] {
    return structuredClone(Array.from(this.services.values()));
  }

  markHealthy(serviceName: string, healthy: boolean) {
    const service = this.services.get(serviceName);
    if (service) {
      service.healthy = healthy;
    }
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();
