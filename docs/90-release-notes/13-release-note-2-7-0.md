# Krateo 2.7.0 – Core Stability, Advanced REST Capabilities, and Enhanced FinOps

Krateo 2.7.0 represents a significant step forward in platform stability and flexibility. In this release, we deliberately chose to focus on **stability over new features** and to introduce a formal **deprecation policy** to ensure smoother handling of breaking changes in the future.

This release introduces a revamped reconciliation engine, advanced capabilities for generating CRDs from OpenAPI specs, and a transition to OCI-based policies for FinOps.

## 🚀 What’s New

**Core & Reconciliation Logic**

* **Optimized Reconciliation:** The `core-provider` now ensures the `CompositionDefinition` status reflects `True` only when *all* deployed components (including CRDs and deployments) are fully ready.
* **Digest-Based Status:** Resource update status in the Composition Dynamic Controller (CDC) now relies on a digest saved in the composition status rather than Helm. This improves stability and prevents unnecessary events.
* **Runtime Optimization:** Significant logic optimization in the CDC and `unstructured-runtime` to improve performance and stability.
* **Improved Helm Release Naming:** Helm releases are now named using a combination of the composition name and an 8-character hash of the composition UID, reducing naming collisions between compositions with the same name of different kinds.

**Advanced REST & CRD Generation (OASGen)**

* **Revamped CRD Generator:** Integration of the new `crdgen` engine within `oasgen-provider` and `rest-dynamic-controller`.
* **Nested Object Support:** Added support for dot notation in `identifiers`, `additionalStatusFields`, and `excludedSpecFields`.
* **Advanced Field Mapping:** New `requestFieldMapping` feature allows arbitrary mapping of CR fields to API call fields.
* **Smart Search:** Added `identifierMatchPolicy` (supporting "AND"/"OR") for `findby` actions, useful for resources requiring multiple identifiers.
* **Pagination Support:** Added support for pagination in `findby` actions, specifically the `continuationToken` method used by APIs like Azure DevOps.

**Frontend**

* **New Example Portal:** Added a portal example to test and display widget YAML documentation.
* **Widget Enhancements:**
* **Forms:** Improved handling of sliders, autocomplete labels, enums, and array fields.
* **Charts:** Fixed dimension issues in Bar and Line charts when nested in Pages/Panels.
* **ButtonGroup:** `InlineGroup` has been renamed to `ButtonGroup` with specific scoping.
* **Table & Filters:** Improved empty state logic, color palettes, and filtering for number/boolean/date fields.



**Snowplow**

* **AWS Support:** Added AWS authentication support. Any component that uses Snowplow trackers can now send data to AWS endpoints.

**FinOps & Observability**

* **Generic Metrics:** Added support for generic metric types in Exporters.
* **AWS Support:** Added support for AWS endpoints in both Exporters and Scrapers.
* **Events Engine:** Added heartbeat and buffered channels to the SSE handler, along with a global CORS middleware and event data minification.

**New Component: Sweeper**

* **Proactive Storage Management:** We introduced the **Sweeper** component (v0.2.0) to explicitly address issues related to **etcd pressure and reaching quota limits**.
* **Functionality:** Sweeper is a lightweight Go service that monitors etcd storage usage and automatically triggers cleanup or maintenance actions before the database reaches its configured quota limit.
* **Requirements:** Sweeper strictly requires an etcd setup that exposes the **Maintenance API**. It is included by default in Krateo 2.7.0 and is pre-configured to work with the new Krateo etcd chart.

**🤖 Autopilot (Subscription Only)**

> *Note: These features are available exclusively to customers with an active subscription.*

* **Enhanced Generation Quality:** Significant improvements in the quality of generated output, including more robust RESTActions, precise frontend widgets, and optimized blueprints.
* **Advanced Blueprint Integration:** Improved integration with installed blueprints, allowing for deeper and more specific customization of compositions directly through Autopilot.
* **A2A Connectivity:** Added support for **Agent-to-Agent (A2A)** protocol integration, expanding the capabilities for autonomous agent interaction within the platform.

---

## ⚠️ Deprecations and a few Breaking Changes

**Authn (v0.22.2)**

* **RESTAction Header Logic:** The automatic token injection logic has changed. Existing RESTActions for OAuth2 and OIDC must now manually include the authorization header. The `token` is now passed directly as a parameter.
* *Required Change:* Update your templates to include the header explicitly:
```yaml
# Manually include the authorization header
headers: - "${ \"Authorization: Bearer \" + .token }"

```



**FinOps Policies**

* **OCI Transition:** Policies are no longer managed via ConfigMaps. They are now mounted directly from OCI images managed by OPA.
* **Component Removal:** The `Finopspolicies` component has been removed from the Krateo Installer.
* *Migration Note:* If you have existing policies defined in ConfigMaps, these are now deprecated. You must migrate your policies to OCI images to ensure functionality with v2.7.0+.

**Frontend**

* **Button:** The `color` property is deprecated; use `backgroundColor` instead.
* **Payload Logic:** `payloadKey` property in Button, Form, and Panel is deprecated and replaced by the updated `payloadToOverride` logic.
* **InlineGroup:** This widget has been renamed to `ButtonGroup`.

**Etcd**

* **Chart Migration (Bitnami to Krateo):** We have replaced the Bitnami etcd chart (used in versions prior to 2.7.0) with a new custom chart: [`krateoplatformops/etcd-chart`](https://www.google.com/search?q=%5Bhttps://github.com/krateoplatformops/etcd-chart%5D(https://github.com/krateoplatformops/etcd-chart)).
* **Reason:** The Bitnami chart does not allow configuring etcd to expose the **Maintenance API**, which is a strict requirement for the **Sweeper** component to perform storage cleanups.
* **Impact on Data:** This internal Etcd instance is used exclusively by Krateo internal components (eventsse and eventrouter) to store transient event data. Consequently, deleting this instance will not impact user configuration or business data. The only effect is the loss of historical internal event logs.

---

## 🧩 Marketplace

**New Blueprints**

* **Cloud Native Stack:** A new comprehensive stack that demonstrates the flexibility of Krateo. This blueprint includes customizations for `portal-blueprint-page` and `portal-composition-page`, showcasing how the platform UI can be tailored to specific architectural needs.