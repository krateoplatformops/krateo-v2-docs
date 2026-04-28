# Resources Presenter Telemetry

This document describes the OpenTelemetry metrics and assets for **Resources Presenter**.

For general setup instructions, see the [OpenTelemetry Configuration](../../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

- `dashboards/resources-presenter-overview.dashboard.json`: Grafana dashboard with panels for request rate, latency, resource throughput, and RBAC filtering target counts.
- `collector/otel-collector-config.yaml`: Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

In Prometheus, metric names are normalized with underscores (e.g., `resources_presenter_startup_success`), and counters typically include the `_total` suffix.

### Metrics Table

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `resources_presenter.startup.success` | Counter | count | Service startup completed successfully. | `sum(resources_presenter_startup_success_total)` |
| `resources_presenter.startup.failure` | Counter | count | Service startup failed. | `sum(resources_presenter_startup_failure_total)` |
| `resources_presenter.db.connect.duration_seconds` | Histogram | seconds | Time spent waiting for PostgreSQL readiness at startup. | `histogram_quantile(0.95, sum by (le) (resources_presenter_db_connect_duration_seconds_bucket))` |
| `resources_presenter.http.requests` | Counter | requests | Number of HTTP handler requests. Labels: `handler`, `method`, `status_code`. | `sum by (handler, method) (rate(resources_presenter_http_requests_total[5m]))` |
| `resources_presenter.http.duration_seconds` | Histogram | seconds | HTTP handler latency. Labels: `handler`, `method`, `status_code`. | `histogram_quantile(0.95, sum by (le, handler) (rate(resources_presenter_http_duration_seconds_bucket[5m])))` |
| `resources_presenter.http.resources_returned` | Counter | resources | Number of resources returned by handlers. Labels: `handler`, `method`. | `sum by (handler) (rate(resources_presenter_http_resources_returned_total[5m]))` |
| `resources_presenter.http.errors` | Counter | errors | Errors in handler flows. Labels: `handler`, `method`, `stage`, `status_code`. | `sum by (handler, stage) (rate(resources_presenter_http_errors_total[5m]))` |
| `resources_presenter.http.phase.duration_seconds` | Histogram | seconds | Per-phase handler latency. Labels: `handler`, `phase`. | `histogram_quantile(0.95, sum by (le, handler, phase) (rate(resources_presenter_http_phase_duration_seconds_bucket[5m])))` |
| `resources_presenter.http.discovery.targets` | Counter | targets | Number of targets discovered before RBAC filtering. Label: `handler`. | `sum(rate(resources_presenter_http_discovery_targets_total[5m]))` |
| `resources_presenter.http.rbac.targets_allowed` | Counter | targets | Number of targets allowed by RBAC filtering. Label: `handler`. | `sum(rate(resources_presenter_http_rbac_targets_allowed_total[5m]))` |

## Handler labels

The `handler` label is intentionally low-cardinality:
- `resources`: `GET`/`POST /resources`
- `resource_detail`: `GET /resources/{global_uid}`
