# Composition Status

This page explains the meaning of the `status` fields and conditions exposed by a `Composition` resource.

---

## The `Ready` Condition

A `Composition` reports `Ready: True` when its associated **Helm release reaches the `deployed` state** — meaning Helm has successfully completed the `install` or `upgrade` operation for that release.

```
status:
  conditions:
    - type: Ready
      status: "True"
      reason: Available
      message: "Composition is up-to-date"
```

:::important
`Ready: True` does **not** imply that the resources created by the Helm chart are themselves healthy or ready. It only reflects the outcome of the Helm operation itself.
:::

### Why child resource readiness is not propagated

Not all Kubernetes resources implement the `Ready` condition in a consistent, machine-readable way. Tying the Composition's status to the readiness of every child resource would produce a mechanism that is unreliable across the ecosystem and therefore not meaningful in practice. The CDC therefore limits its status to what it can determine with certainty: whether Helm has successfully applied the release.

To inspect child resource health, use `kubectl get` on the individual resources listed in `status.managed`, or rely on dedicated monitoring tooling.

---

## Status Conditions

The CDC sets the following condition types on a `Composition`:

| Condition type | Status | Meaning |
| :--- | :--- | :--- |
| `Ready` | `True` | Helm release is in `deployed` state (`Available` reason). |
| `Ready` | `False` | An error occurred during RBAC provisioning or Helm execution (`Unavailable` reason). |
| `Ready` | `True` | Reconciliation has been intentionally suspended (`ReconcileGracefullyPaused` reason). |

Errors that trigger `Ready: False` include:

- RBAC generation failure (Chart Inspector dry-run error).
- RBAC apply failure (permission update rejected by the API server).
- Helm `install` or `upgrade` failure.

---

## Status Fields

Beyond conditions, the `status` sub-resource tracks operational metadata about the Helm release:

| Field | Description |
| :--- | :--- |
| `status.helmChartUrl` | URL of the Helm chart being managed. |
| `status.helmChartVersion` | Version of the installed Helm chart. |
| `status.digest` | SHA digest of the current release, used for drift detection. |
| `status.previousDigest` | SHA digest of the previous release, used to identify whether an upgrade actually changed anything. |
| `status.managed` | List of Kubernetes resources created or managed by the Helm release (each entry includes `apiVersion`, `resource`, `name`, `namespace`, and `path`). |

The `digest` and `previousDigest` fields are compared on every reconciliation loop. A mismatch triggers a re-evaluation of the release, ensuring configuration drift is detected and corrected automatically.

---

## Paused Compositions

When a `Composition` carries the graceful-pause annotation, the CDC suspends reconciliation and sets:

```
status:
  conditions:
    - type: Ready
      status: "True"
      reason: ReconcileGracefullyPaused
```

The release is left in whatever state it was in when pausing was requested. No further Helm operations are performed until the annotation is removed. See [Values Injection & Pausing](30-values-injection.md) for details.
