# Events Presenter Telemetry

This document describes the OpenTelemetry metrics and assets for **Events Presenter**.

For general setup instructions, see the [OpenTelemetry Configuration](../../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

- [`dashboards/events-presenter-overview.dashboard.json`](https://github.com/krateoplatformops/events-presenter/blob/main/telemetry/dashboards/events-presenter-overview.dashboard.json): Grafana dashboard with panels for DB connectivity, request rate, latency, and real-time SSE event delivery statistics.
- [`collector/otel-collector-config.yaml`](https://github.com/krateoplatformops/events-presenter/blob/main/telemetry/collector/otel-collector-config.yaml): Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

In Prometheus, metric names are normalized with underscores (e.g., `events_presenter_startup_success`), and counters typically include the `_total` suffix.

### Metrics Table

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `events_presenter.startup.success` | Counter | count | Service startup completed successfully. | `sum(increase(events_presenter_startup_success_total[1h]))` |
| `events_presenter.startup.failure` | Counter | count | Service startup failed. | `sum(increase(events_presenter_startup_failure_total[1h]))` |
| `events_presenter.db.connect.duration_seconds` | Histogram | seconds | Time spent waiting for PostgreSQL readiness. | `histogram_quantile(0.95, sum by (le) (rate(events_presenter_db_connect_duration_seconds_bucket[5m])))` |
| `events_presenter.http.events.requests` | Counter | requests | Number of `/events` requests. Labels: `method`, `status_code`. | `sum by (method) (rate(events_presenter_http_events_requests_total[5m]))` |
| `events_presenter.http.events.duration_seconds` | Histogram | seconds | `/events` request latency. Labels: `method`, `status_code`. | `histogram_quantile(0.95, sum by (le, method) (rate(events_presenter_http_events_duration_seconds_bucket[5m])))` |
| `events_presenter.http.events.resources_returned` | Counter | resources | Number of resources returned by `/events`. Label: `method`. | `sum(rate(events_presenter_http_events_resources_returned_total[5m]))` |
| `events_presenter.http.events.errors` | Counter | errors | Errors in `/events` flow. Labels: `method`, `stage`, `status_code`. | `sum by (stage) (rate(events_presenter_http_events_errors_total[5m]))` |
| `events_presenter.listener.notifications.received` | Counter | notifications | PostgreSQL notifications received from LISTEN/NOTIFY. | `sum(rate(events_presenter_listener_notifications_received_total[5m]))` |
| `events_presenter.listener.jobs.enqueued` | Counter | jobs | Jobs enqueued after notifications. | `sum(rate(events_presenter_listener_jobs_enqueued_total[5m]))` |
| `events_presenter.listener.load_latest.duration_seconds` | Histogram | seconds | Duration of latest-events DB fetch after notification. | `histogram_quantile(0.95, sum by (le) (rate(events_presenter_listener_load_latest_duration_seconds_bucket[5m])))` |
| `events_presenter.listener.load_latest.failure` | Counter | failures | Failures in latest-events DB fetch path. | `sum(increase(events_presenter_listener_load_latest_failure_total[1h]))` |
| `events_presenter.listener.connect.failure` | Counter | failures | Failures while connecting/reconnecting listener to PostgreSQL. | `sum(increase(events_presenter_listener_connect_failure_total[1h]))` |
| `events_presenter.listener.disconnects` | Counter | disconnects | Listener disconnect events. | `sum(increase(events_presenter_listener_disconnects_total[1h]))` |
| `events_presenter.sse.clients.connected` | Counter | clients | Total SSE client subscriptions opened. | `sum(increase(events_presenter_sse_clients_connected_total[1h]))` |
| `events_presenter.sse.clients.disconnected` | Counter | clients | Total SSE client subscriptions closed. | `sum(increase(events_presenter_sse_clients_disconnected_total[1h]))` |
| `events_presenter.sse.clients.active` | Gauge | clients | Current number of active SSE subscribers. | `max(events_presenter_sse_clients_active)` |
| `events_presenter.sse.events.broadcast` | Counter | events | Events delivered to SSE client channels. | `sum(rate(events_presenter_sse_events_broadcast_total[5m]))` |
| `events_presenter.sse.events.dropped` | Counter | events | Events dropped due to slow SSE clients. | `sum(rate(events_presenter_sse_events_dropped_total[5m]))` |
