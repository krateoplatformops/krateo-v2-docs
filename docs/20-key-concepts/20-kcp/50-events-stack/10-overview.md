# Events Stack

The **Events Stack** provides real-time observability into Kubernetes events through the Krateo Composable Portal (KCP).

It consists of two main components:
1.  **Events Ingester**: The "Collector" that listens for cluster events and stores them in PostgreSQL.
2.  **Events Presenter**: The "Streaming Server" that pushes real-time event updates to the frontend using SSE (Server-Sent Events).

## Data Flow

![Events Stack Flow](/img/diagrams/events-stack-flow.png)

### 1. Events Ingester
The Ingester monitors the Kubernetes API for events. It correlates events with Krateo Compositions, batches them for performance, and inserts them into the database. It is designed to handle high event volumes with minimal overhead.

### 2. PostgreSQL (Data Store)
Events are stored in partitioned tables. When a new event is inserted, PostgreSQL triggers a `NOTIFY` event that is picked up by the Presenter.

### 3. Events Presenter
The Presenter provides real-time updates. Instead of the frontend polling for new events, the Presenter maintains an open SSE connection and "pushes" events as they are received from the database. It ensures that users only see events for resources they have permission to access.

---

## Technical Reference

### Environment Variables

#### Events Ingester

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
| `OTEL_ENABLED` | Enable OpenTelemetry metrics export | `false` |
| `OTEL_EXPORT_INTERVAL` | OpenTelemetry metric export interval | `50s` |

#### Events Presenter

| Name | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `8083` |
| `DEBUG` | Enable debug logging | `false` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `DB_PARAMS` | Extra connection parameters (e.g., `sslmode=disable`) | - |
| `DB_READY_TIMEOUT` | Max wait for PostgreSQL readiness | `2m` |
| `JWT_SIGN_KEY` | HMAC signing key for JWT validation | - |
| `AUTHN_NS` | K8s namespace where user clientconfig secrets live | - |
| `OTEL_ENABLED` | Enable OpenTelemetry metrics | `true` |
| `OTEL_EXPORT_INTERVAL` | Metrics export interval | `30s` |

---

## Documentation

| Component | Purpose |
| :--- | :--- |
| [Ingester Telemetry](20-ingester-telemetry.md) | Metrics for event collection and batch processing. |
| [Presenter Telemetry](30-presenter-telemetry.md) | Metrics for SSE streaming and real-time broadcasting. |
