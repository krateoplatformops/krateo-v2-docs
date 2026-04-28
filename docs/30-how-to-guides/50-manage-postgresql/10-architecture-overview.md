---
description: Architecture overview
sidebar_label: Architecture overview
---

# Architecture overview: Presenter/Ingester Pipeline

Krateo's resource and event data pipelines follow the following unified pattern:

```
resources-ingester →              → resources-presenter
                      PostgreSQL
events-ingester    →              → events-presenter
```

## Resources Stack

The **resources-ingester** continuously watches the Kubernetes API server for any configured resource kinds, both fixed resources ([CRD Kind defined statically](https://github.com/krateoplatformops/resources-ingester/blob/main/internal/router/assets/static)) and dynamically discovered CRDs belonging to managed API groups (i.e.,  [*.krateo.io](https://github.com/krateoplatformops/resources-ingester/blob/main/internal/manager/assets/managed_groups)) and persists them as structured records in PostgreSQL.
On the read side, [**resources-presenter**](../../20-key-concepts/20-kcp/40-resources-stack/10-overview.md) serves as the query layer for **snowplow**, replacing direct Kubernetes API calls with fast, RBAC-enforced reads against the PostgreSQL-backed cache. 

## Events Stack

The **events-ingester** follows the same pattern for Kubernetes events, enriching each one with composition metadata before writing to PostgreSQL, from where [events-presenter](../../20-key-concepts/20-kcp/50-events-stack/10-overview.md) serves both REST queries (`/events`) and broadcasts real-time notifications to connected clients via Server-Sent Events (`/notifications`).

## Deviser

**Deviser** manages the lifecycle of PostgreSQL tables and partitions. It runs as an independent service alongside **events-ingester**, [events-presenter](../../20-key-concepts/20-kcp/50-events-stack/10-overview.md), **resources-ingester** and [resources-presenter](../../20-key-concepts/20-kcp/40-resources-stack/10-overview.md).

Deviser creates:
- `k8s_events` table for Kubernetes events, partitioned by day
- `krateo_resources` table

For what concerns partitioned tables, it automatically creates daily partitions in advance, dropping partitions that exceed the configured retention window, and enforcing total storage quotas, triggering cleanup when partition size crosses a configurable threshold and trimming back to a target ratio. This keeps the `k8s_events` table performant at scale without any manual database administration, and is fully configurable via environment variables for retention days, size limits, and dry-run mode.

By default, Krateo installs **CNPG** (CloudNativePG) with **PostgreSQL 18** to back all of these services out of the box. 
You can find more details about CNPG configuration in the related section of the documentation: [CNPG Configuration](./cnpg-configuration).

If you desire to use your own existing PostgreSQL instance, you can follow the instructions in the [Bring Your Own PostgreSQL](./bring-your-own-postgresql) guide to skip CNPG installation and connect the Krateo services to your own PostgreSQL database.
