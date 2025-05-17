# Lightweight API Gateway in Node.js

A lightweight, extensible API Gateway built with **Node.js + TypeScript**, providing essential gateway features including dynamic service discovery, secure JWT-based auth, rate limiting, health checks, and request forwarding.

---

##  Features

-  **Dynamic Service Discovery** (via `/register` endpoint)
-  **JWT Authentication Middleware**
-  **IP and User-based Rate Limiting** (in-memory or Redis-backed)
-  **Request Forwarding** to microservices
-  **Health Checks** with auto-deregistration
-  **Unit & Integration Tests** included

---

##  Architecture

```text
           ┌───────────────┐
           │   Client      │
           └─────┬─────────┘
                 │
        ┌────────▼────────────┐
        │    API Gateway      │
        │  (Express + TS)     │
        └────────┬────────────┘
                 │
        ┌────────▼────────────┐
        │  Middleware Chain   │
        │  - JWT Auth         │
        │  - Rate Limiting    │
        └────────┬────────────┘
                 ▼
       ┌──────────────────────┐
       │ Proxy & Service Reg  │────────► Registered Service
       └──────────────────────┘

```

## Service Lifecycle


| Step          | Description                                  |
| ------------- | -------------------------------------------- |
|  Register   | Service calls `POST /register` with metadata |
|  Health      | Gateway checks `/health` every N seconds     |
|  Forwarding | Proxy routes `/api/:serviceName/*`           |
|  Fail        | Health failure causes auto-deregistration    |
|  Retry      | Re-attempt health check on next cycle        |




## Example Service Registration Payload
```
{
  "serviceName": "user-service",
  "baseURL": "http://localhost:4001",
  "healthCheckURL": "/health"
}
```


