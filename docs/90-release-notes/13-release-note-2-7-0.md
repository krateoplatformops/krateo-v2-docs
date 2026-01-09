# Krateo 2.7.0 – Core Stability, Advanced REST Capabilities, and Enhanced FinOps

Krateo 2.7.0 represents a significant step forward in platform stability and flexibility. This release introduces a revamped reconciliation engine, advanced capabilities for generating CRDs from OpenAPI specs, and a transition to OCI-based policies for FinOps.

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

* Introduced the **Sweeper** component (v0.2.0) to handle resource cleanup tasks. **Sweeper** is a lightweight Go service designed to monitor etcd storage usage and automatically trigger cleanup or maintenance actions before the database reaches its configured quota limit.


---

## ⚠️ Breaking Changes & Deprecations

**Authn (v0.22.2)**

* **RESTAction Header Logic:** The automatic token injection logic has changed. Existing RESTActions for OAuth2 and OIDC must now manually include the authorization header.
* *Required Change:* Update your templates to include: `headers: - "${ \"Authorization: Bearer \" + .token }"`
* The `token` is now passed directly as a parameter.

**FinOps Policies**

* **OCI Transition:** Policies are no longer managed via ConfigMaps. They are now mounted directly from OCI images managed by OPA. The `Finopspolicies` component has been removed from the Krateo Installer.

**Frontend**

* **Button:** The `color` property is deprecated; use `backgroundColor` instead.
* **Payload Logic:** `payloadKey` property in Button, Form, and Panel is deprecated and replaced by the updated `payloadToOverride` logic.
* **InlineGroup:** This widget has been renamed to `ButtonGroup`.

**Etcd**

* **Configuration Changes:** Significant changes to `values.yaml` and templates for Etcd (v3.6.6). Verify the new RBAC templating and removal of legacy values.

---

## 🧩 Marketplace

**New Blueprints**

