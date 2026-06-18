# How to: Restrict Lifecycle Operations (Management & Deletion Policies)

Two annotations let you control which operations Krateo is allowed to perform on a resource — for read-only registration, for keeping the underlying release when you delete a Composition, or for handing a resource off without Krateo reverting your manual changes.

> **Concepts:** [Composition](../../20-key-concepts/10-kco/11-architecture.md#glossary) · [CDC](../../20-key-concepts/10-kco/11-architecture.md#glossary)

These annotations work on both a `Composition` (honored by the CDC) and a `CompositionDefinition` (honored by the Core Provider). The examples below use a `Composition`.

---

## `krateo.io/management-policy` — which operations are allowed

| Value | Create | Update | Delete | Use it for |
| :--- | :---: | :---: | :---: | :--- |
| `default` (when unset) | ✅ | ✅ | ✅ | Normal, full management. |
| `observe-create-update` | ✅ | ✅ | ❌ | Provision and keep reconciled, but never let Krateo delete the underlying resource. |
| `observe-delete` | ❌ | ❌ | ✅ | Stop changing a resource, but still allow cleanup on delete. |
| `observe` | ❌ | ❌ | ❌ | Read-only: Krateo tracks the resource and reports status, but never changes it. |

```yaml
apiVersion: composition.krateo.io/v1-0-0
kind: GithubScaffoldingLifecycle
metadata:
  name: my-composition
  namespace: cheatsheet-system
  annotations:
    krateo.io/management-policy: observe   # read-only: observed, never changed
spec:
  # ...
```

---

## `krateo.io/deletion-policy` — what happens on delete

| Value | When the Composition is deleted |
| :--- | :--- |
| `delete` (when unset) | The Helm release is uninstalled (the default — see [Delete Safely](80-delete-safely.md)). |
| `orphan` | The Composition object is removed, but the **Helm release and its resources are left running**. |

Use `orphan` to stop managing a service with Krateo while keeping it running:

```yaml
metadata:
  annotations:
    krateo.io/deletion-policy: orphan
```

---

## Policy vs. pause

These solve different problems:

- **Pause** (`krateo.io/paused` / `krateo.io/gracefully-paused`) is a **temporary** stop you remove later — see [Pause / Resume](40-pause-resume.md).
- **Management / deletion policy** is a **standing** restriction on which operations are ever allowed, with no expectation of being removed.

:::note CDC: fully freezing a running release
On a `Composition`, `observe` / `observe-create-update` stop the CDC from issuing update actions, but the CDC still re-reconciles an existing release on its normal schedule. To **fully freeze** an already-running release, prefer **graceful pause** rather than a management policy.
:::

---

## Next steps

- [Pause / Resume](40-pause-resume.md)
- [Delete Safely](80-delete-safely.md)
- [Version Management Model](../../20-key-concepts/10-kco/10-core-provider/20-version-management.md)
