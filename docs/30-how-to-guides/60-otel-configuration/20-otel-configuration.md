---
description: OpenTelemetry Configuration
sidebar_label: OpenTelemetry Configuration
---

# OpenTelemetry Configuration

This guide provides instructions on how to configure OpenTelemetry in Krateo to enable the collection of metrics from the supported components and send them to your preferred observability backend (e.g., Prometheus) via an OpenTelemetry Collector.

## Prerequisites

Before configuring OpenTelemetry in Krateo, make sure you have the following prerequisites in place:
1. Run your Krateo components with OpenTelemetry enabled (see [Enabling Metrics](#enabling-metrics-in-components)).
2. An **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** configured in your Kubernetes cluster.
3. A **compatible observability backend** (e.g., Prometheus) set up to receive metrics from the OpenTelemetry Collector.
4. **Grafana** connected to your observability backend as a data source.

## Quick Install: Prometheus & Grafana (Example)

:::tip Note
The following steps are provided as an **example** for setting up a monitoring stack. For production environments, follow your organization's standard practices for deploying and managing observability tools.
:::

If you don't have a monitoring stack yet, one way to get started is by installing the `kube-prometheus-stack`. It includes Prometheus, Grafana, and the Prometheus Operator.

1. Add the Prometheus community Helm repository:
   ```bash
   helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
   helm repo update
   ```

2. Install the stack in the `monitoring` namespace:
   ```bash
   helm upgrade --install prometheus prometheus-community/kube-prometheus-stack \
     -n monitoring --create-namespace \
     --set grafana.adminPassword=admin
   ```

3. Once the pods are ready, you can proceed with the Collector deployment.

## Deploying OpenTelemetry Collector (Helm)

You can deploy a shared Collector in-cluster using the official Helm chart. This example configuration sets up an OTLP HTTP receiver and a Prometheus exporter.

1. Add the Helm repository:

```bash
helm repo add open-telemetry https://open-telemetry.github.io/opentelemetry-helm-charts
helm repo update
```

2. Create a `otelcol-values.yaml` file with the following content:

```yaml
mode: deployment
presets:
  kubernetesAttributes:
    enabled: true
image:
  repository: ghcr.io/open-telemetry/opentelemetry-collector-releases/opentelemetry-collector-k8s
  tag: 0.152.0
config:
  receivers:
    otlp:
      protocols:
        http:
          endpoint: 0.0.0.0:4318
  exporters:
    prometheus:
      endpoint: 0.0.0.0:9464
  service:
    pipelines:
      metrics:
        receivers: [otlp]
        processors: [batch]
        exporters: [prometheus]
ports:
  otlp-http:
    enabled: true
    containerPort: 4318
    servicePort: 4318
    protocol: TCP
  prom-metrics:
    enabled: true
    containerPort: 9464
    servicePort: 9464
    protocol: TCP
```

3. Install the Collector:

```bash
helm upgrade --install otel-collector open-telemetry/opentelemetry-collector \
	-n monitoring --create-namespace \
	-f otelcol-values.yaml
```

4. The chart creates the ServiceMonitor automatically, so Prometheus can scrape the Collector metrics endpoint at `:9464`.

## Enabling Metrics in Components

To enable OpenTelemetry metrics in Krateo components, you need to set the following environment variables:

```yaml
OTEL_ENABLED: "true"
OTEL_EXPORT_INTERVAL: "30s"
OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector-opentelemetry-collector.monitoring.svc.cluster.local:4318"
```

### Using `krateoctl`

You can create a custom config file for `krateoctl` to enable OpenTelemetry metrics.
For instance, `otel-config.yaml`:
```yaml
components:
  db-maintenance:
    stepConfig:
      install-deviser:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s"
              OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector-opentelemetry-collector.monitoring.svc.cluster.local:4318
  # ... other components
```

### Using the `monitoring` profile

For development environments, you can use the `--profile monitoring` flag during installation:
```sh
krateoctl install apply --profile monitoring
```

## Accessing Grafana

If you are running Grafana inside your Kubernetes cluster (for example, as part of the `kube-prometheus-stack`), you can access it using `kubectl port-forward`.

1. Find the Grafana service name:
   ```bash
   kubectl get svc -n monitoring | grep grafana
   ```

2. Port-forward to the service (replace `grafana-service-name` with the actual name):
   ```bash
   kubectl port-forward -n monitoring svc/grafana-service-name 3000:80
   ```

3. Open your browser at [http://localhost:3000](http://localhost:3000).

## Importing Dashboards

Krateo provides ready-to-use Grafana dashboards for various components.

1. Open Grafana.
2. Go to **Dashboards** -> **New** -> **Import**.
3. Upload the `.dashboard.json` file provided with the component.
4. Select your **Prometheus** data source.
5. Save.

## Metric Naming and Normalization

When metrics flow from OpenTelemetry to Prometheus, they are normalized:
- Metric names in code use dots (`.`), which Prometheus converts to underscores (`_`).
- **Counters**: Usually appear with a `_total` suffix (e.g., `provider_runtime.startup.success` becomes `provider_runtime_startup_success_total`).
- **Histograms**: Expose `_bucket` (cumulative count), `_sum`, and `_count` series.
- **Average Latency**: Use the `_sum / _count` series for average duration instead of `_bucket` quantiles for more accurate averages.

## Troubleshooting

- **Check collector logs**: `kubectl logs -n monitoring deployment/otel-collector`
- **Verify Prometheus scrape**: Check `http://<collector-service>:9464/metrics`
- **Check controller logs**: Look for `OpenTelemetry metrics initialized` messages.
- **Empty Panels**: Some metrics (like webhooks) are only emitted during active traffic. Panels will remain empty until real requests are processed.
