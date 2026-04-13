---
description: OpenTelemetry Configuration
sidebar_label: OpenTelemetry Configuration
---

# OpenTelemetry Configuration

This guide provides instructions on how to configure OpenTelemetry in Krateo to enable the collection of metrics from the supported components and send them to your preferred observability backend (e.g., Prometheus) via an OpenTelemetry Collector.

## Prerequisites

Before configuring OpenTelemetry in Krateo, make sure you have the following prerequisites in place:
- An **[OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)** configured in your Kubernetes cluster.
- A **compatible observability backend** (e.g., Prometheus) set up to receive metrics from the OpenTelemetry Collector.

:::note
The setup and configuration of the OpenTelemetry Collector and your observability backend are outside the scope of this guide. Please refer to the [**official documentation of OpenTelemetry**](https://opentelemetry.io/docs/) and your chosen observability backend for detailed instructions on how to set them up.
:::

You can find an example of a basic (**non-production**) configuration of a observability stack with OpenTelemetry Collector and Prometheus in a guide [here](https://github.com/krateoplatformops/krateo-sanity/blob/main/monitoring/monitoring.md). 

This simple guide is available also in the form of a bash script that you can run in your cluster to quickly set up monitoring stack on a **development environment**. You need the full script suite [`krateo-sanity`](https://github.com/krateoplatformops/krateo-sanity) and refer to the [deploy_monitoring_stack.sh](https://github.com/krateoplatformops/krateo-sanity/blob/main/monitoring/deploy_monitoring_stack.sh) script.

## Creating a custom config file for `krateoctl` to enable OpenTelemetry metrics

You can create a custom config file for `krateoctl` to enable OpenTelemetry metrics and set the necessary configurations.
For instance, you can create a file called `otel-config.yaml` with the following content:
```yaml
components:
  db-maintenance:
    stepConfig:
      install-deviser:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s" # Change the export interval as needed
              OTEL_EXPORTER_OTLP_ENDPOINT: <your-otel-collector-endpoint>
  resources-stack:
    stepConfig:
      install-resources-ingester:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s" # Change the export interval as needed
              OTEL_EXPORTER_OTLP_ENDPOINT: <your-otel-collector-endpoint>
      install-resources-presenter:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s" # Change the export interval as needed
              OTEL_EXPORTER_OTLP_ENDPOINT: <your-otel-collector-endpoint>
  events-stack:
    stepConfig:
      install-events-ingester:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s" # Change the export interval as needed
              OTEL_EXPORTER_OTLP_ENDPOINT: <your-otel-collector-endpoint>
      install-events-presenter:
        with:
          values:
            config:
              OTEL_ENABLED: "true"
              OTEL_EXPORT_INTERVAL: "30s" # Change the export interval as needed
              OTEL_EXPORTER_OTLP_ENDPOINT: <your-otel-collector-endpoint>
```

## Using the `monitoring` profile during installation

You can leverage the [`monitoring` profile](https://github.com/krateoplatformops/releases/blob/main/krateo-overrides.monitoring.yaml) during the installation of Krateo to automatically configure the components to expose OpenTelemetry metrics.

:::note
The `monitoring` profile is thought to be used in **development environments** for quick setup. Indeed, the `OTEL_EXPORTER_OTLP_ENDPOINT` is set to "http://otel-collector-opentelemetry-collector.monitoring.svc.cluster.local:4318", which is the endpoint of the OpenTelemetry Collector in the example monitoring stack provided in the `krateo-sanity` repository. If you are using a different setup for your OpenTelemetry Collector, you can create a custom config based on the `monitoring` profile and change the endpoint accordingly as explained in the previous section.
:::

To use the `monitoring` profile during installation, you can add the `--profile monitoring` flag to your `krateoctl install apply` command, like this:
```sh
krateoctl install apply --profile monitoring[,other-profiles-you-want-to-enable]
```

This profile will configure all the supported components to expose OpenTelemetry metrics, by setting the necessary environment variables for each componentfor a development environment.
