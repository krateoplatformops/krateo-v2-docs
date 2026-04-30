---
description: Supported components
sidebar_label: Supported components
---

# Supported components for OpenTelemetry metrics

The following components of Krateo expose **OpenTelemetry metrics** that can be collected by an **OpenTelemetry Collector** and sent to your preferred observability backend (e.g., Prometheus):

### Core Operations (KCO)
- [`core-provider`](https://github.com/krateoplatformops/core-provider/) ([Metrics Reference](../../20-key-concepts/10-kco/10-core-provider/40-telemetry.md))
- [`composition-dynamic-controller`](https://github.com/krateoplatformops/composition-dynamic-controller/) ([Metrics Reference](../../20-key-concepts/10-kco/20-cdc/50-telemetry.md))

### Composable Portal (KCP)
- [`deviser`](https://github.com/krateoplatformops/deviser/) ([Metrics Reference](../../20-key-concepts/20-kcp/30-deviser/20-telemetry.md))
- [`resources-ingester`](https://github.com/krateoplatformops/resources-ingester/) ([Metrics Reference](../../20-key-concepts/20-kcp/40-resources-stack/20-ingester-telemetry.md))
- [`resources-presenter`](https://github.com/krateoplatformops/resources-presenter/) ([Metrics Reference](../../20-key-concepts/20-kcp/40-resources-stack/30-presenter-telemetry.md))
- [`events-ingester`](https://github.com/krateoplatformops/events-ingester/) ([Metrics Reference](../../20-key-concepts/20-kcp/50-events-stack/20-ingester-telemetry.md))
- [`events-presenter`](https://github.com/krateoplatformops/events-presenter/) ([Metrics Reference](../../20-key-concepts/20-kcp/50-events-stack/30-presenter-telemetry.md))

Each of these components has a `/telemetry` folder in their codebase with Grafana dashboards and collector configurations.
