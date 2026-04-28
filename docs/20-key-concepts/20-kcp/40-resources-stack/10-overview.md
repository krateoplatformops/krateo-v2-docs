# Resources Stack

The **Resources Stack** is the core data pipeline in the Krateo Composable Portal (KCP) responsible for discovering, storing, and serving Kubernetes resource information.

It consists of two main components working in tandem with a PostgreSQL database:
1.  **Resources Ingester**: The "Collector" that receives resource updates.
2.  **Resources Presenter**: The "Server" that provides the API for the frontend.

## Data Flow

![Resources Stack Flow](/img/diagrams/resources-stack-flow.png)


### 1. Resources Ingester
The Ingester acts as a high-performance gateway for resource metadata. It receives resource state changes from the cluster, batches them, and stores them in partitioned PostgreSQL tables. Its primary goal is to maintain an up-to-date mirror of the cluster state in the database.

### 2. PostgreSQL (Data Store)
The database stores resource metadata using daily partitions managed by [Deviser](../30-deviser/10-overview.md). This ensures that querying historical or large-scale resource data remains performant.

### 3. Resources Presenter
The Presenter exposes the data stored in PostgreSQL through a unified REST API. It handles complex filtering and, most importantly, **RBAC enforcement**. It ensures that users only see resources they are authorized to access in the real Kubernetes cluster.

---

## Technical Reference

### Environment Variables

#### Resources Ingester

| Name | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Health probe server port | `8080` |
| `DB_HOST` | Database host | - |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `DB_PARAMS` | Extra connection parameters (e.g., `sslmode=disable`) | - |
| `DB_READY_TIMEOUT` | Max wait for PostgreSQL readiness | `2m` |
| `NAMESPACES` | Comma-separated list of namespaces to watch | all (if empty) |

#### Resources Presenter

| Name | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `8080` |
| `DEBUG` | Enable debug-level logging | `false` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `DB_PARAMS` | Extra connection parameters (e.g., `sslmode=disable`) | - |
| `DB_READY_TIMEOUT` | Max wait for PostgreSQL readiness | `5m` |

---

## Documentation

| Component | Purpose |
| :--- | :--- |
| [Ingester Telemetry](20-ingester-telemetry.md) | Metrics for data collection and DB insertion. |
| [Presenter Telemetry](30-presenter-telemetry.md) | Metrics for API performance and RBAC filtering. |
