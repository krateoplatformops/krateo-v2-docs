# Deviser Telemetry

This document describes the OpenTelemetry metrics and assets for **Deviser**.

For general setup instructions, see the [OpenTelemetry Configuration](../../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

- `dashboards/deviser-overview.dashboard.json`: Grafana dashboard with panels for partition management, purge throughput, and storage monitoring.
- `collector/otel-collector-config.yaml`: Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

In Prometheus, metric names are normalized with underscores (e.g., `deviser_startup_success`), and counters typically include the `_total` suffix.

### Metrics Table

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `deviser.startup.success` | Counter | count | Service startup completed successfully. | `sum(increase(deviser_startup_success_total[1h]))` |
| `deviser.startup.failure` | Counter | count | Service startup failed. | `sum(increase(deviser_startup_failure_total[1h]))` |
| `deviser.db.connect.duration_seconds` | Histogram | seconds | Time spent waiting for PostgreSQL readiness. | `histogram_quantile(0.95, sum by (le) (rate(deviser_db_connect_duration_seconds_bucket[5m])))` |
| `deviser.db.schema_apply.duration_seconds` | Histogram | seconds | Time spent applying startup SQL schemas. | `histogram_quantile(0.95, sum by (le) (rate(deviser_db_schema_apply_duration_seconds_bucket[5m])))` |
| `deviser.db.schema_apply.failure` | Counter | count | Failures during schema application. | `sum(increase(deviser_db_schema_apply_failure_total[1h]))` |
| `deviser.partitions.ensure.duration_seconds` | Histogram | seconds | Duration of daily partition creation routine. | `histogram_quantile(0.95, sum by (le) (rate(deviser_partitions_ensure_duration_seconds_bucket[5m])))` |
| `deviser.partitions.ensure.failure` | Counter | count | Failures in partition ensure routine. | `sum(increase(deviser_partitions_ensure_failure_total[1h]))` |
| `deviser.partitions.ensure.days` | Gauge | days | Configured horizon for partition creation. | `max(deviser_partitions_ensure_days)` |
| `deviser.partitions.maintain.duration_seconds` | Histogram | seconds | Duration of partition maintenance routine. | `histogram_quantile(0.95, sum by (le) (rate(deviser_partitions_maintain_duration_seconds_bucket[5m])))` |
| `deviser.partitions.maintain.failure` | Counter | count | Failures in partition maintenance. | `sum(increase(deviser_partitions_maintain_failure_total[1h]))` |
| `deviser.partitions.dropped.expired` | Counter | count | Partitions dropped due to retention policy. | `sum(increase(deviser_partitions_dropped_expired_total[1h]))` |
| `deviser.partitions.dropped.quota` | Counter | count | Partitions dropped due to quota enforcement. | `sum(increase(deviser_partitions_dropped_quota_total[1h]))` |
| `deviser.partitions.bytes_freed` | Counter | bytes | Bytes reclaimed by dropping partitions. | `sum(increase(deviser_partitions_bytes_freed_total[1h]))` |
| `deviser.partitions.total_discovered` | Gauge | count | Number of partitions discovered during maintenance. | `max(deviser_partitions_total_discovered)` |
| `deviser.partitions.total_bytes` | Gauge | bytes | Total size in bytes of discovered partitions. | `max(deviser_partitions_total_bytes)` |
| `deviser.resources.purge.duration_seconds` | Histogram | seconds | Duration of soft-delete purge routine. | `histogram_quantile(0.95, sum by (le) (rate(deviser_resources_purge_duration_seconds_bucket[5m])))` |
| `deviser.resources.purge.rows` | Counter | rows | Number of rows hard-deleted from `krateo_resources`. | `sum(increase(deviser_resources_purge_rows_total[1h]))` |
| `deviser.resources.purge.failure` | Counter | count | Failures in soft-delete purge routine. | `sum(increase(deviser_resources_purge_failure_total[1h]))` |
| `deviser.loop.iteration.success` | Counter | count | Main scheduled loop iteration with no errors. | `sum(rate(deviser_loop_iteration_success_total[5m]))` |
| `deviser.loop.iteration.failure` | Counter | count | Main scheduled loop iteration with at least one error. | `sum(rate(deviser_loop_iteration_failure_total[5m]))` |
