# Events Ingester Telemetry

This document describes the OpenTelemetry metrics and assets for the **Events Ingester**.

For general setup instructions, see the [OpenTelemetry Configuration](../../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

- [`dashboards/events-ingester-overview.dashboard.json`](https://github.com/krateoplatformops/events-ingester/blob/main/telemetry/dashboards/events-ingester-overview.dashboard.json): Grafana dashboard with panels for event throughput, composition lookup latency, and database insertion performance.
- [`collector/otel-collector-config.yaml`](https://github.com/krateoplatformops/events-ingester/blob/main/telemetry/collector/otel-collector-config.yaml): Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

In Prometheus, metric names are normalized with underscores (e.g., `events_ingester_events_received`), and counters typically include the `_total` suffix.

### Metrics Table

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `events_ingester.events.received` | Counter | count | Number of events accepted by router input path. | `sum(rate(events_ingester_events_received_total[5m]))` |
| `events_ingester.events.dispatched` | Counter | count | Number of events forwarded to the ingester handler. | `sum(rate(events_ingester_events_dispatched_total[5m]))` |
| `events_ingester.events.dropped` | Counter | count | Dropped events in router/ingester paths. | `sum by (reason) (rate(events_ingester_events_dropped_total[5m]))` |
| `events_ingester.composition.lookup.duration_seconds` | Histogram | seconds | Time spent resolving composition ID for an involved object. | `histogram_quantile(0.95, sum by (le) (rate(events_ingester_composition_lookup_duration_seconds_bucket[5m])))` |
| `events_ingester.records.build.failure` | Counter | count | Failures while building DB records from events. | `sum by (reason) (increase(events_ingester_records_build_failure_total[1h]))` |
| `events_ingester.batch.flush.duration_seconds` | Histogram | seconds | Duration of a batch flush cycle. | `histogram_quantile(0.95, sum by (le) (rate(events_ingester_batch_flush_duration_seconds_bucket[5m])))` |
| `events_ingester.batch.flush.size` | Histogram | records | Number of records per flush. | `histogram_quantile(0.95, sum by (le) (rate(events_ingester_batch_flush_size_bucket[5m])))` |
| `events_ingester.db.insert.rows` | Counter | rows | Number of rows inserted by successful batch writes. | `sum(rate(events_ingester_db_insert_rows_total[5m]))` |
| `events_ingester.db.insert.failure` | Counter | count | Batch insert failures. | `sum by (type) (increase(events_ingester_db_insert_failure_total[1h]))` |
| `events_ingester.queue.depth` | Gauge | count | In-memory queue buffered job count. | `max(events_ingester_queue_depth)` |
| `events_ingester.record_channel.depth` | Gauge | count | In-memory record channel buffered item count. | `max(events_ingester_record_channel_depth)` |
