# Release 3.0.0

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

### Core Provider v1.0.0
- **Modernized Helm Integration:** Replaced custom, legacy Helm management logic with an updated, robust Helm client integration aligned with industry standards.
- **Certificate Lifecycle Controller:** Implemented a new dedicated controller to manage certificate generation and CA bundle propagation, ensuring that `CompositionDefinition` resources are consistently ready and secured.
- **Advanced Retry Logic:** Implemented robust retry mechanisms for chart fetching and composition updates (KRA-1325, KRA-1327), significantly increasing resilience in network-unstable environments.
- **Reconciler Optimization:** Significant refactoring of the `CompositionDefinition` reconciliation loop and associated webhooks to improve performance and consistency.
- **CRD Visibility:** Added a `SYNCED` status column to the `CompositionDefinition` CRD for better monitoring of the reconciliation state.
- **Bug Fixes and Improvements:** Standardized the webhook service namespace to `krateo-system`, removed obsolete finalizer labels, and bumped `provider-runtime` to `v1.2.1`.

### Composition Dynamic Controller v1.0.0
- **Refactoring & Optimization:** Significant removal of legacy `helmclient` and `helmchart` logic to streamline operations and reduce technical debt.
- **Improved Helm Handling:** Added support for safe release names to avoid issues with randomized suffixes.
- **Rollback Support:** Enhanced reliability by adding rollback support for pending rollback states in the `Observe` function.
- **Incremental RBAC:** Implemented incremental application of RBAC rules for improved security and efficiency.
- **Testing and Configuration:** Added stress testing scripts for RBAC rule application and expanded unit test coverage across the controller logic. 

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
**Features:**
- Introduced cursor-based pagination for improved data handling.
- Added theme and logo customization support.
- Enhanced Markdown widget (tables, links, scroll, code blocks).
- Extended Table with `tableActions` and customizable labels.
- Improved UI flexibility (Form, navigation, dynamic drawer/modal titles).

**Bug Fixes:**
- Fixed critical issues in Notifications (crashes and rendering).
- Resolved login and access token handling issues.

### Updated Blueprints
- **portal** and **portal-composition-page-generic** — updated to support the new Resource and Event APIs.
    - Note: If you have forked these blueprints, please ensure you merge the latest changes to maintain compatibility.
- **Admin Page** — enhanced: single `Button` widgets replaced with `ButtonGroup` where necessary, and `Table` widgets updated with `tableActions` to simplify `RESTAction` operations.

### New Kserve Integration
- **Kserve Controller**: Released a new [operator](https://github.com/krateoplatformops/kserve-controller) for declarative inference on Kserve.
    - Control one-time or recurring inference through new custom resources that fully support high-availability modes.
    - Note: This operator is not installed by default as it requires an active Kserve installation.
- **Example Blueprint**: A [dedicated blueprint example](https://github.com/krateoplatformops/blueprints/tree/main/kserve) is now available for Kserve integration.

### Full Observability Suite (OpenTelemetry)
[OpenTelemetry](https://opentelemetry.io/) has been introduced across the Krateo platform, providing deep insights and operational dashboards.
- **Event Stack:** Integration layer added via the new component [`deviser`](https://github.com/krateoplatformops/deviser). Telemetry has also been added to `events-ingester` and `events-presenter`.
- **Resource APIs:** Telemetry has been added to `resources-ingester` and `resources-presenter`.
- **Core Provider:** Standardized pipeline built for OTLP export, operational dashboards for controller performance, admission control, and external calls.
- **Composition Dynamic Controller:** Full integration including metrics collection, wrappers, and dedicated Grafana dashboards.

### Krateoctl — New CLI Tool
`krateoctl` is a new command-line tool for managing Krateo installations and performing utility operations. It replaces the controller-based installer, simplifying upgrade and maintenance workflows.

---

## Utilities

### krateo-sanity
A repository containing setup scripts, stress tests, and monitoring configuration for **test environments** (not intended for production use).

- Repository: https://github.com/krateoplatformops/krateo-sanity

---

## Documentation

With the 3.0.0 release, we have significantly consolidated our documentation. Individual component documentation and guides previously scattered across GitHub repository READMEs have been migrated to our centralized documentation portal. 

You can find all updated documentation structured by functional areas (Core Concepts, How-To Guides, Reference, etc.) directly on [docs.krateo.io](https://docs.krateo.io).

### Migration Guide
Upgrading from v2.7.0 to v3.0.0 requires following specific procedures due to the significant architectural changes. **Please carefully follow the official migration guide:**

- [Migrate from v2.7.0 to v3.0.0](https://docs.krateo.io/how-to-guides/migrate-krateo/migrating-from-v2-7-0-to-v3-0-0)

---

## Breaking Changes

:::warning
Upgrading from v2.7.x requires following the migration guide.
Direct in-place upgrades without migration steps are **not supported**.
:::

- **Events Storage:** Krateo's internal Etcd is no longer used for event storage — replaced by PostgreSQL (CNPG)
- **Installation:** The controller-based installer has been replaced by `krateoctl`
- **Blueprints:** Blueprint components (`portal`, `portal-composition-page-generic`, `admin-page`) require updated versions compatible with the new APIs
- **Frontend Events:** Updated events format and handling (EventList, Notifications)
- **Core Provider Manifests:** All raw YAML static manifests (RBAC, Deployments, Services) have been removed. Management of these resources is now exclusively delegated to the Helm chart, eliminating technical debt and configuration drift.
- **Core Provider Custom Libraries:** Deprecated and removed the custom `internal/tools/helm/` directory, moving to standard client implementations.
