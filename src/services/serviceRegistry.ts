export interface ServiceInfo {
  serviceName: string;
  baseURL: string;
  healthCheckURL: string;
  healthy: boolean;
}

class ServiceRegistry {
  private services = new Map<string, ServiceInfo>();

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
    return Array.from(this.services.values());
  }

  markHealthy(serviceName: string, healthy: boolean) {
    const service = this.services.get(serviceName);
    if (service) {
      service.healthy = healthy;
    }
  }
}

export const serviceRegistry = new ServiceRegistry();
