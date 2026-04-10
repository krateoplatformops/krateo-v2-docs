---
description: Introduction
sidebar_label: Introduction
---

# Architecture Overview: Presenter/Ingester Pipeline

Krateo's resource and event data pipelines follow a unified pattern:

```
ingester → PostgreSQL → presenter
```

The **resources-ingester** continuously watches the Kubernetes API server for any configured resource kinds, both fixed resources ([CRD Kind defined statically](https://github.com/krateoplatformops/resources-ingester/blob/main/internal/router/assets/static)) and dynamically discovered CRDs belonging to managed API groups (i.e.,  [*.krateo.io](https://github.com/krateoplatformops/resources-ingester/blob/main/internal/manager/assets/managed_groups)) and persists them as structured records in PostgreSQL. On the read side, [resources-presenter](../../key-concepts/kcp/resources-presenter) serves as the query layer for **snowplow**, replacing direct Kubernetes API calls with fast, RBAC-enforced reads against the PostgreSQL-backed cache. The **events-ingester** follows the same pattern for Kubernetes events, enriching each one with composition metadata before writing to PostgreSQL, from where [events-presenter](../../key-concepts/kcp/events-presenter) serves both REST queries (`/events`) and broadcasts real-time notifications to connected clients via Server-Sent Events (`/notifications`).

**Deviser** complements the events pipeline by managing the lifecycle of PostgreSQL partitions for the `k8s_events` table. It runs as an independent service alongside **events-ingester**, [events-presenter](../../key-concepts/kcp/events-presenter), **resources-ingester** and [resources-presenter](../../key-concepts/kcp/resources-presenter). It automatically creates daily partitions in advance, dropping partitions that exceed the configured retention window, and enforcing total storage quotas, triggering cleanup when partition size crosses a configurable threshold and trimming back to a target ratio. This keeps the events table performant at scale without any manual database administration, and is fully configurable via environment variables for retention days, size limits, and dry-run mode.

By default, Krateo installs **CNPG** (CloudNativePG) with PostgreSQL 18 to back all of these services out of the box. If you already operate an external PostgreSQL instance, CNPG installation can be skipped entirely by selecting the appropriate profile when running `krateoctl install apply --profile <profile>`: in this case, the connection details for your existing database must be provided as Kubernetes Secrets before running the install, as described in the [Secrets Spec](../install-krateo/secrets).