# Reconciliation & Lifecycle

How the CDC keeps a `Composition` reconciled — what happens when you create, update, or delete one, when the Helm release already exists, and when the resources it manages drift.

> **Concepts:** [Composition](../11-architecture.md#glossary) · [Reconciliation & Lifecycle (Core Provider side)](../10-core-provider/15-reconciliation-lifecycle.md)

The CDC continuously reconciles each `Composition`: it renders the chart with the instance's `spec` as Helm values and keeps the resulting Helm release converged toward that desired state.

---

## Create

Creating a `Composition` triggers a `helm install` of the chart. See [Create a Composition](../../../30-how-to-guides/30-kco-operations/30-create-composition.md).

## When the resource already exists (adoption)

- **A Helm release with the same computed name already exists**: the CDC **upgrades** it instead of failing — so creating a `Composition` after a previously-failed install is safe and idempotent. (See [Release Naming](40-release-naming.md) for how the name is computed.)
- **An arbitrary Kubernetes object the chart would create already exists** (created outside this release): it is **not** adopted. Standard Helm ownership rules apply and the install fails with an *"exists and cannot be imported into the current release"* error. Importing pre-existing live objects into a Composition is not supported.

## Update

When you change the `Composition`'s `spec` there is no separate apply step — the CDC detects the change and runs a `helm upgrade` with the new spec as chart values.

## Drift

The CDC reconciles continuously and re-applies the rendered release, so out-of-band edits to the chart's resources are **reverted on the next reconcile**. To stop this on purpose — for maintenance, or to hand a resource off — pause the `Composition` or set a read-only management policy. See [Pause / Resume](../../../30-how-to-guides/30-kco-operations/40-pause-resume.md) and [Lifecycle Policies](../../../30-how-to-guides/30-kco-operations/45-lifecycle-policies.md).

## Delete

Deleting a `Composition` makes the CDC `helm uninstall` the release — unless `krateo.io/deletion-policy: orphan` is set, which removes the `Composition` but leaves the release running. See [Delete Safely](../../../30-how-to-guides/30-kco-operations/80-delete-safely.md).

---

## See also

- [Reconciliation & Lifecycle — Core Provider side](../10-core-provider/15-reconciliation-lifecycle.md) — the same questions for a `CompositionDefinition` (the CRD and the CDC bundle)
- [Lifecycle Policies](../../../30-how-to-guides/30-kco-operations/45-lifecycle-policies.md) — restrict which operations are allowed
- [Pause / Resume](../../../30-how-to-guides/30-kco-operations/40-pause-resume.md)
