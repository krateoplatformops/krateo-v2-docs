# Reconciliation & Lifecycle

How the Core Provider keeps a `CompositionDefinition` reconciled — what happens when you create, update, or delete one, when the resource it would manage already exists, and when something it owns drifts.

> **Concepts:** [CompositionDefinition](../11-architecture.md#glossary) · [Reconciliation & Lifecycle (CDC side)](../20-cdc/15-reconciliation-lifecycle.md)

The Core Provider continuously reconciles each `CompositionDefinition`: it observes the desired state (the generated CRD and the per-definition CDC "bundle" — the CDC `Deployment`, RBAC, `ConfigMap`, and `Service`) and converges the cluster toward it.

---

## Create

Applying a `CompositionDefinition` makes the Core Provider download the chart, generate the CRD from its `values.schema.json`, and deploy the CDC plus its scoped RBAC. See [Deploy a CompositionDefinition](../../../30-how-to-guides/30-kco-operations/20-deploy-composition-definition.md).

## When the resource already exists (adoption)

- **The generated CRD already exists** — because another `CompositionDefinition` created it, or it predates this one: the Core Provider **adopts** it and **adds its version** to the existing CRD. It does not error or overwrite it. Several `CompositionDefinition`s for the same kind therefore coexist as multiple versions of one CRD.

## Update

- **You change `spec.chart`** (for example, bump `version`): the Core Provider re-applies — it updates the generated CRD and redeploys the CDC.
- **The chart version changed** (same kind and group): the Core Provider adds the new version, tears down the old version's CDC, and relabels existing `Composition` instances so the new CDC takes them over. See the [Version Management Model](20-version-management.md) and its migration how-tos.

## Drift

If the generated CRD or the CDC it deployed is changed or deleted out of band, the Core Provider detects the mismatch and **restores what it owns** — the CRD plus the CDC `Deployment`, RBAC, `ConfigMap`, and `Service` — on the next reconcile. It self-heals its managed objects; detection is based on a digest of the whole bundle, so any change to a tracked object triggers a re-apply.

## Delete

Deleting a `CompositionDefinition` removes its CRD, CDC, and scoped RBAC — but only once its `Composition`s are gone, and it keeps the CRD if other versions are still in use. See [Delete Safely](../../../30-how-to-guides/30-kco-operations/80-delete-safely.md). To restrict what the Core Provider may do (read-only, or keep things on delete), see [Lifecycle Policies](../../../30-how-to-guides/30-kco-operations/45-lifecycle-policies.md).

---

## See also

- [Reconciliation & Lifecycle — CDC side](../20-cdc/15-reconciliation-lifecycle.md) — the same questions for a `Composition` and its Helm release
- [Lifecycle Policies](../../../30-how-to-guides/30-kco-operations/45-lifecycle-policies.md) — restrict which operations are allowed
- [Version Management Model](20-version-management.md)
