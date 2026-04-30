# Values Injection & Pausing

The **Composition Dynamic Controller (CDC)** automatically injects metadata and operational flags into the Helm chart values and resource labels. This enables charts to be "Krateo-aware."

## Injected Metadata

When the CDC reconciles a `Composition`, it injects the following values into the Helm release (`.Values.global`) and resource labels:

| Helm Value (`global.*`) | Resource Label (`krateo.io/*`) | Description |
| :--- | :--- | :--- |
| `compositionId` | `composition-id` | Unique UID of the Composition resource. |
| `compositionName` | `composition-name` | Name of the Composition resource. |
| `compositionNamespace` | `composition-namespace` | Namespace of the Composition resource. |
| `compositionInstalledVersion`| `composition-installed-version`| Current version of the chart installed. |
| `compositionGroup` | `composition-group` | API Group of the Composition. |
| `compositionResource` | `composition-resource` | Plural name of the resource. |
| `compositionKind` | `composition-kind` | Kind of the resource. |
| `krateoNamespace` | `krateo-namespace` | Namespace where Krateo is installed. |
| `gracefullyPaused` | *Not injected as label* | Boolean indicating if the stack should pause. |

---

## Graceful Pausing

Krateo supports two ways to pause reconciliation, depending on whether you want to pause just the controller or the entire application stack.

### 1. Immediate Pause (`krateo.io/paused`)
Setting this annotation to `"true"` on a `Composition` resource causes the CDC to stop reconciliation **immediately**. No further changes will be applied to the cluster until the annotation is removed.

### 2. Graceful Pause (`krateo.io/gracefully-paused`)
Setting this annotation to `"true"` triggers a coordinated pause across the entire stack:
1. **Trigger**: You set the annotation on the `Composition`.
2. **Injection**: The CDC performs one final Helm upgrade, setting `.Values.global.gracefullyPaused` to `true`.
3. **Propagation**: Resources within the chart (like other Krateo providers) can use this value to pause themselves.
4. **Activation**: The CDC only stops its own reconciliation *after* the Helm upgrade is successful.

### Template Example
To make a resource within your chart respect the graceful pause:

```yaml
apiVersion: git.krateo.io/v1alpha1
kind: Repo
metadata:
  name: {{ include "my-app.fullname" . }}-repo
  annotations:
    # This will pause the Repo provider when the Composition is gracefully paused
    krateo.io/paused: "{{ default false (and .Values.global .Values.global.gracefullyPaused) }}"
```

## Comparison Summary

| Feature | `krateo.io/paused` | `krateo.io/gracefully-paused` |
| :--- | :--- | :--- |
| **Scope** | Composition controller only | Composition + all chart resources |
| **Timing** | Immediate | After the next successful Helm upgrade |
| **Best For** | Emergency debugging | Scheduled maintenance of full stacks |
