# Telemetry - Composition Dynamic Controller

This document describes the OpenTelemetry metrics emitted by `unstructured-runtime` and `composition-dynamic-controller` (CDC).

For information on how to set up the OpenTelemetry Collector, configure Prometheus, or import dashboards, please refer to the [OpenTelemetry Configuration](../../30-how-to-guides/60-otel-configuration/20-otel-configuration.md) guide.

## Telemetry Assets

The following assets are available for `composition-dynamic-controller`:

- `dashboards/composition-dynamic-controller.dashboard.json`: Grafana dashboard with metric panels.
- `collector/otel-collector-config.yaml`: Minimal OpenTelemetry Collector configuration.

## Metrics Reference

### Naming note

Metric names in code use dots. Prometheus normalizes them with underscores, and counters appear with a `_total` suffix.
Histogram queries use the generated `_bucket` series (cumulative count), and `_sum` / `_count` series for average duration.

### Core Metrics

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `unstructured_runtime.startup.success` | Counter | count | Controller started successfully. | `sum(increase(unstructured_runtime_startup_success_total[1h]))` |
| `unstructured_runtime.startup.failure` | Counter | count | Controller startup failed. | `sum(increase(unstructured_runtime_startup_failure_total[1h]))` |
| `unstructured_runtime.reconcile.duration_seconds` | Histogram | seconds | Total reconciliation duration. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_reconcile_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.reconcile.in_flight` | Gauge | count | Number of reconciliations currently in progress. | `max(unstructured_runtime_reconcile_in_flight)` |

### Queue Metrics

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `unstructured_runtime.reconcile.queue.depth` | UpDownCounter | count | Current number of items in the queue. | `max(unstructured_runtime_reconcile_queue_depth)` |
| `unstructured_runtime.reconcile.queue.wait.duration_seconds` | Histogram | seconds | Time spent waiting in queue before processing. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_reconcile_queue_wait_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.reconcile.queue.oldest_item_age_seconds` | Histogram | seconds | Age of the oldest item currently in queue. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_reconcile_queue_oldest_item_age_seconds_bucket[5m])))` |
| `unstructured_runtime.reconcile.queue.work.duration_seconds` | Histogram | seconds | Time spent processing a dequeued item. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_reconcile_queue_work_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.reconcile.queue.requeues` | Counter | count | Total number of items requeued. | `sum(increase(unstructured_runtime_reconcile_queue_requeues_total[1h]))` |

### Reconciliation Results

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `unstructured_runtime.reconcile.success` | Counter | count | Successfully completed reconciliations. | `sum(increase(unstructured_runtime_reconcile_success_total[1h]))` |
| `unstructured_runtime.reconcile.failure` | Counter | count | Failed reconciliations. | `sum(increase(unstructured_runtime_reconcile_failure_total[1h]))` |
| `unstructured_runtime.reconcile.requeue.after` | Counter | count | Reconciliations that requested requeue after delay. | `sum(increase(unstructured_runtime_reconcile_requeue_after_total[1h]))` |
| `unstructured_runtime.reconcile.requeue.immediate` | Counter | count | Reconciliations that requested immediate requeue. | `sum(increase(unstructured_runtime_reconcile_requeue_immediate_total[1h]))` |
| `unstructured_runtime.reconcile.requeue.error` | Counter | count | Reconciliations requeued due to error. | `sum(increase(unstructured_runtime_reconcile_requeue_error_total[1h]))` |

### External Operation Metrics

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `unstructured_runtime.external.observe.duration_seconds` | Histogram | seconds | Time to observe external resources. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_external_observe_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.external.connect.duration_seconds` | Histogram | seconds | Time to connect/read external references. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_external_connect_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.external.create.duration_seconds` | Histogram | seconds | Time to create external resources. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_external_create_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.external.update.duration_seconds` | Histogram | seconds | Time to update external resources. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_external_update_duration_seconds_bucket[5m])))` |
| `unstructured_runtime.external.delete.duration_seconds` | Histogram | seconds | Time to delete external resources. | `histogram_quantile(0.95, sum by (le) (rate(unstructured_runtime_external_delete_duration_seconds_bucket[5m])))` |

### Composition Specific Metrics

| Metric | Type | Unit | Description | PromQL example |
|---|---|---|---|---|
| `composition.rbac_generation.duration_seconds` | Histogram | seconds | Time to generate RBAC policies. | `histogram_quantile(0.95, sum by (le) (rate(composition_rbac_generation_duration_seconds_bucket[5m])))` |
| `composition.rbac_apply.duration_seconds` | Histogram | seconds | Time to apply RBAC policies to the cluster. | `histogram_quantile(0.95, sum by (le) (rate(composition_rbac_apply_duration_seconds_bucket[5m])))` |
| `composition.helm_install.duration_seconds` | Histogram | seconds | Time to install Helm chart. | `histogram_quantile(0.95, sum by (le) (rate(composition_helm_install_duration_seconds_bucket[5m])))` |
| `composition.helm_upgrade.duration_seconds` | Histogram | seconds | Time to upgrade Helm chart. | `histogram_quantile(0.95, sum by (le) (rate(composition_helm_upgrade_duration_seconds_bucket[5m])))` |

### Metric Design Notes

- **RBAC split**: RBAC generation and apply operations are measured separately.
- **Helm operations**: Install and upgrade metrics help track deployment performance.
- **Histogram Buckets**: Optimized for observing operation latencies from milliseconds up to 10,000 seconds.
