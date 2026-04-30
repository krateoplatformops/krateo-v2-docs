# Krateo Core Provider

The Krateo Core Provider is the foundational component of Krateo Composable Operations (KCO), enabling the management of Helm charts as Kubernetes-native resources.

## Key Features

- **Dynamic CRD Generation**: Automatically creates and manages versioned CRDs from a chart's `values.schema.json`.
- **Schema-Driven Validation**: Leverages JSON Schema to enforce strict input validation at the API level.
- **Isolated RBAC Policies**: Generates and manages fine-grained RBAC policies for each composition.
- **Multi-Version Chart Support**: Supports three distinct upgrade patterns for controlled chart upgrades.

## Requirements

- Kubernetes 1.30+
- Helm 3.0+

> As of version 0.24.2, the core-provider no longer requires Snowplow for resource discovery — this functionality is now built-in.

## Install

```sh
helm repo add krateo https://charts.krateo.io
helm repo update
helm install krateo-core-provider krateo/core-provider --namespace krateo-system --create-namespace
```

## The Manager of Managers

The Core Provider acts as the "Manager" in the Krateo ecosystem. Its primary role is to orchestrate the lifecycle of other controllers.

1.  **Watch**: It monitors `CompositionDefinition` resources.
2.  **Generate**: It creates a versioned CRD based on the chart's schema.
3.  **Spawn**: It deploys a dedicated [Composition Dynamic Controller (CDC)](../20-cdc/10-overview.md) to manage instances of that CRD.

## Concepts & Design

| Document | Purpose |
|:---------|:--------|
| [Architecture & Glossary](../11-architecture.md) | High-level system overview and key terminology. |
| [Version Management](20-version-management.md) | How to handle chart upgrades (Full, Parallel, Selective). |
| [Security Design](30-security-design.md) | Deep dive into RBAC isolation and schema validation. |
| [CDC Overview](../20-cdc/10-overview.md) | Understanding the worker controller that runs your charts. |
| [Telemetry](40-telemetry.md) | Metrics reference for the Core Provider. |

## Operational Guides (How-to)

For step-by-step instructions on using the Core Provider, see:
- [Install the platform](../../../30-how-to-guides/30-kco-operations/10-install.md)
- [Deploy a CompositionDefinition](../../../30-how-to-guides/30-kco-operations/20-deploy-composition-definition.md)
- [Full Migration Guide](../../../30-how-to-guides/30-kco-operations/50-full-migration.md)
- [Selective Migration Guide](../../../30-how-to-guides/30-kco-operations/70-selective-migration.md)

## Environment Variables and Flags

| Name | Description | Default | Notes |
|:-----|:------------|:--------|:------|
| `CORE_PROVIDER_DEBUG` | Enables debug logging | `false` | Use `--debug` flag |
| `CORE_PROVIDER_SYNC` | Sync period for controller manager | `1h` | Duration |
| `CORE_PROVIDER_POLL_INTERVAL` | Poll interval for resource drift checks | `5m` | Duration |
| `CORE_PROVIDER_MAX_RECONCILE_RATE` | Maximum reconcile rate per second | `5` | Integer |
| `CORE_PROVIDER_LEADER_ELECTION` | Enables leader election for controller manager | `false` | Use `--leader-election` flag |
| `CORE_PROVIDER_WEBHOOK_SERVICE_NAME` | Name of the webhook service | `core-provider-webhook-service` | String |
| `CORE_PROVIDER_WEBHOOK_SERVICE_NAMESPACE` | Namespace of the webhook service | `demo-system` | String |
| `CORE_PROVIDER_MAX_ERROR_RETRY_INTERVAL` | Maximum retry interval on errors | `1m` | Duration |
| `CORE_PROVIDER_MIN_ERROR_RETRY_INTERVAL` | Minimum retry interval on errors | `1s` | Duration |
| `CORE_PROVIDER_TLS_CERTIFICATE_DURATION` | Duration of the TLS certificate. | `24h` | Duration |
| `CORE_PROVIDER_TLS_CERTIFICATE_LEASE_EXPIRATION_MARGIN` | Lease renewal margin. | `16h` | Duration |
| `HELM_REGISTRY_CONFIG_PATH` | Path to Helm registry configuration file | `/tmp` | Used for OCI registries |
| `OTEL_ENABLED` | Enables OTLP metrics export | `false` | Use `--metrics-enabled` flag |
| `OTEL_EXPORT_INTERVAL` | Interval used to export OTLP metrics | `30s` | Duration |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP endpoint for metrics export | `` | URL |
| `URL_PLURALS` | **DEPRECATED** (≥ 0.24.2) | - | Ignored |
