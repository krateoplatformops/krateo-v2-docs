# Release 3.0.0

## Version 3.0-rc1 (Release Candidate)
:::warning
This is a Release Candidate. It is intended for evaluation and testing purposes.
Production deployments should wait for the 3.0 final release.
:::
---

## Why 3.0?

This release introduces significant architectural changes and **breaking changes** that affect installation, upgrade, and integration procedures. For this reason, we decided to bump the major version and adopt **Semantic Versioning** consistently going forward.

---

## Problems Addressed

| Area | Problem |
|------|---------|
| **Events & Etcd** | Krateo's internal Etcd was being saturated by cluster-wide event storage, causing stability and scalability issues. |
| **Resource Listing Performance** | Listing Composition and CompositionDefinition resources required iterating over all namespaces and all resources, leading to poor performance at scale. |
| **Installation & Upgrade** | Having the installer implemented as a controller was complicating upgrade procedures for individual component fixes, as well as testing in internal environments. |
| **Observability** | No built-in observability stack was available for monitoring Krateo's internal operations. |

---

## What's New

### New Event Stack
Krateo's internal Etcd has been replaced with **PostgreSQL**, provisioned via [CloudNativePG (CNPG)](https://cloudnative-pg.io/). New dedicated services handle event ingestion and serve event data to the portal.

**New components:**
- [`events-ingester`](https://github.com/krateoplatformops/events-ingester) — collects and stores Krateo events into PostgreSQL
- [`events-presenter`](https://github.com/krateoplatformops/events-presenter) — serves event data to the portal

### Dedicated Resource APIs
A new read-only endpoint has been introduced for querying resources managed by Krateo. The database is kept in sync by an ingester that records resource operations.

**New components:**
- [`resources-ingester`](https://github.com/krateoplatformops/resources-ingester) — records resource operations into PostgreSQL
- [`resources-presenter`](https://github.com/krateoplatformops/resources-presenter) — exposes a query API over the read-only database

### Frontend Updates
- Portal theme customization support
- Simplified management of action buttons within tables

### Updated Blueprints
- **portal** and **portal-composition-page-generic** — updated to support the new Resource and Event APIs
- **Admin Page** — updated to support the new table button management

### OpenTelemetry Integration
[OpenTelemetry](https://opentelemetry.io/) has been introduced for the event stack. Existing components will be updated in upcoming releases.

**New component:**
- [`deviser`](https://github.com/krateoplatformops/deviser) — OpenTelemetry integration layer for the event stack

### Krateoctl — New CLI Tool
`krateoctl` is a new command-line tool for managing Krateo installations and performing utility operations. It replaces the controller-based installer, simplifying upgrade and maintenance workflows.

---

## Utilities

### krateo-sanity
A repository containing setup scripts, stress tests, and monitoring configuration for **test environments** (not intended for production use).

- Repository: https://github.com/krateoplatformops/krateo-sanity

---

## Documentation

### Installation & Upgrade
- [Install / Upgrade Guide](https://github.com/krateoplatformops/krateoctl/blob/main/docs/install-upgrade.md)
- [Installation & Migration Guide](https://github.com/krateoplatformops/krateoctl/blob/main/docs/installation-migration.md)

### New Stack Documentation
- [resources-presenter README](https://github.com/krateoplatformops/resources-presenter/blob/main/README.md)
- [resources-ingester README](https://github.com/krateoplatformops/resources-ingester/blob/main/README.md)
- [events-ingester README](https://github.com/krateoplatformops/events-ingester/blob/main/README.md)
- [events-presenter README](https://github.com/krateoplatformops/events-presenter/blob/main/README.md)
- [deviser README](https://github.com/krateoplatformops/deviser/blob/main/README.md)

### Migration Guides
- [Migrate from v2.7.0 to v3.0.0 (GitHub)](https://github.com/krateoplatformops/krateoctl/blob/main/docs/migrate-2.7.0-to-3.0.0.md)
- [Migrate from v2.7.0 to v3.0.0-rc (docs.krateo.io)](https://docs.krateo.io/how-to-guides/migrate-krateo/migrating-from-v2-7-0-to-v3-0-0rc)

---

## What to Expect in 3.0 Final

- Bug fixes based on rc1 feedback
- OpenTelemetry instrumentation extended to `resource-presenter`, `core-provider`, and CDC components
- Updated documentation on [docs.krateo.io](https://docs.krateo.io)
- **Autopilot** updated to support Krateo 3.0 features while remaining capable of answering questions about v2.7

---

## Breaking Changes

:::
Upgrading from v2.7.x requires following the migration guide.
Direct in-place upgrades without migration steps are **not supported**.
:::

- Krateo's internal Etcd is no longer used for event storage — replaced by PostgreSQL (CNPG)
- The controller-based installer has been replaced by `krateoctl`
- Blueprint components (`portal`, `portal-composition-page-generic`, `admin-page`) require updated versions compatible with the new APIs
