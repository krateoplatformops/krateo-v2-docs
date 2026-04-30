# Resources Ingester Telemetry

This document describes the OpenTelemetry metrics and assets for the **Resources Ingester**.

For general setup instructions, see the [OpenTelemetry Configuration](../../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

- [`dashboards/resources-ingester-overview.dashboard.json`](https://github.com/krateoplatformops/resources-ingester/blob/main/telemetry/dashboards/resources-ingester-overview.dashboard.json): Grafana dashboard with panels for resource throughput, drop rates, queue depth, and batch flush performance.
- [`collector/otel-collector-config.yaml`](https://github.com/krateoplatformops/resources-ingester/blob/main/telemetry/collector/otel-collector-config.yaml): Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

In Prometheus, metric names are normalized with underscores (e.g., `resources_ingester_resources_received`), and counters typically include the `_total` suffix.

### Metrics Table

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `resources_ingester.resources.received` | Counter | count | Number of resources accepted by router input path. | `sum(rate(resources_ingester_resources_received_total[5m]))` |
| `resources_ingester.resources.dispatched` | Counter | count | Number of resources forwarded to the ingester handler. | `sum(rate(resources_ingester_resources_dispatched_total[5m]))` |
| `resources_ingester.resources.dropped` | Counter | count | Dropped resources in router/ingester paths. | `sum by (reason) (rate(resources_ingester_resources_dropped_total[5m]))` |
| `resources_ingester.batch.flush.duration_seconds` | Histogram | seconds | Duration of a batch flush cycle. | `histogram_quantile(0.95, sum by (le) (rate(resources_ingester_batch_flush_duration_seconds_bucket[5m])))` |
| `resources_ingester.batch.flush.size` | Histogram | records | Number of records per flush. | `histogram_quantile(0.95, sum by (le) (rate(resources_ingester_batch_flush_size_bucket[5m])))` |
| `resources_ingester.db.insert.rows` | Counter | rows | Number of rows inserted by successful batch writes. | `sum(rate(resources_ingester_db_insert_rows_total[5m]))` |
| `resources_ingester.db.insert.failure` | Counter | count | Batch insert failures. | `sum by (type) (increase(resources_ingester_db_insert_failure_total[1h]))` |
| `resources_ingester.queue.depth` | Gauge | count | In-memory queue buffered job count. | `max(resources_ingester_queue_depth)` |
| `resources_ingester.record_channel.depth` | Gauge | count | In-memory record channel buffered item count. | `max(resources_ingester_record_channel_depth)` |
