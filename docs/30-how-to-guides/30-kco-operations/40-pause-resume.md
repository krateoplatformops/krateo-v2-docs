# How to: Pause / Resume a Composition

Reconciliation can be paused for a specific Composition resource. This is useful for maintenance windows, debugging, or when you want to temporarily prevent Krateo from applying changes to a service.

> **Concepts:** [Composition](../../20-key-concepts/10-kco/11-architecture.md#glossary) · [CDC](../../20-key-concepts/10-kco/11-architecture.md#glossary)

---

## 1. Immediate Pause (Controller-only)

To stop the Krateo controller from watching a composition immediately:

```bash
kubectl annotate composition <name> krateo.io/paused="true" --overwrite
```

**Effect:** The CDC will stop reconciling this specific instance. Any changes made to the Composition resource or the cluster state will be ignored.

---

## 2. Graceful Pause (Full Stack)

If your Helm chart is configured to support graceful pausing, you can pause the entire application stack (including resources managed by other providers):

```bash
kubectl annotate composition <name> krateo.io/gracefully-paused="true" --overwrite
```

**Effect:** The CDC performs one final `helm upgrade` to inject `global.gracefullyPaused: true` into the chart values, then stops reconciliation.

---

## 3. Resume Reconciliation

To resume normal operations, remove the annotation:

```bash
# To resume from an immediate pause
kubectl annotate composition <name> krateo.io/paused-

# To resume from a graceful pause
kubectl annotate composition <name> krateo.io/gracefully-paused-
```

---

## Pause vs. lifecycle policies

Pause is a **temporary** stop that you remove later. If instead you want a **standing** restriction — for example, make a Composition read-only, or keep its Helm release running when the Composition is deleted — use the management / deletion-policy annotations described in [Lifecycle Policies](45-lifecycle-policies.md).

| | Removed later? | Use for |
| :--- | :--- | :--- |
| Pause (`krateo.io/paused`, `krateo.io/gracefully-paused`) | Yes | Maintenance windows, debugging, temporary freezes |
| Management / deletion policy | No (standing) | Read-only registration, orphan-on-delete, blocking specific operations |

---

## Technical Details

To use this feature, your Helm chart must be updated to support it. See the [Values Injection & Pausing](../../20-key-concepts/10-kco/20-cdc/30-values-injection.md#graceful-pausing) documentation for the required chart changes.

---

## Next steps

- [Lifecycle Policies](45-lifecycle-policies.md) — standing restrictions (read-only, orphan on delete)
- [Delete Safely](80-delete-safely.md)
- [Troubleshooting](../../20-key-concepts/10-kco/40-troubleshooting.md)
