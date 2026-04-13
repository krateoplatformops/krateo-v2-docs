---
description: Supported components
sidebar_label: Supported components
---

# Supported components for OpenTelemetry metrics

The following components of Krateo expose **OpenTelemetry metrics** that can be collected by an **OpenTelemetry Collector** and sent to your preferred observability backend (e.g., Prometheus):
- [`deviser`](https://github.com/krateoplatformops/deviser/)
- [`resources-ingester`](https://github.com/krateoplatformops/resources-ingester/)
- [`resources-presenter`](https://github.com/krateoplatformops/resources-presenter/)
- [`events-ingester`](https://github.com/krateoplatformops/events-ingester/)
- [`events-presenter`](https://github.com/krateoplatformops/events-presenter/)

Each of this component have a `/telemetry` folder in their codebase where the OpenTelemetry metrics are listed as a reference.
There are also example dashboards for Grafana available in the `/telemetry/dashboards` folder of each component.