---
description: Events API
sidebar_label: Events API
---

# Events API

The **events-presenter** service is a core component of Krateo's event stack, providing a read-only, authenticated interface to query event data stored in PostgreSQL.

## API Endpoints

All endpoints require a valid JWT bearer token for authentication, except for health checks.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/notifications` | Establishes a real-time event stream using Server-Sent Events (SSE). |
| `GET` | `/events` | Fetches historical events. |
| `POST` | `/events` | Advanced querying and filtering of historical events (supports body filters like `cluster` or `limit`). |
| `GET` | `/livez` | Liveness probe: confirms the service is running. |
| `GET` | `/readyz` | Readiness probe: confirms connectivity to the PostgreSQL database. |
