---
description: Resources API
sidebar_label: Resources API
---

# Resources API

The **resources-presenter** service is a read-only API gateway designed to query the current state of Kubernetes resources managed by Krateo.

## API Endpoints

All endpoints require a valid JWT bearer token for authentication, except for health checks.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/resources` | Lists Kubernetes resources matching specified criteria. |
| `POST` | `/resources` | Advanced querying and filtering (supports pagination, sorting, and field-specific filters). |
| `GET` | `/resources/{global_uid}` | Fetches detailed info for a single resource using a unique `global_uid` (format: `cluster_name:uid`). Supports `raw=true` and `status_raw=true` query parameters. |
| `GET` | `/livez` | Liveness probe: confirms the service is running. |
| `GET` | `/readyz` | Readiness probe: confirms connectivity to the PostgreSQL database. |
