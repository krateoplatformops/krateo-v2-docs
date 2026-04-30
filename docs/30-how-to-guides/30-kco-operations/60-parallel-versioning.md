# How to: Parallel Versioning

Deploy a new version of your service side-by-side with the old one, creating two distinct Kubernetes APIs. This allows you to maintain legacy instances while offering the new version for fresh deployments.

> **Concepts:** [Pattern 2 — Parallel Versioning](../../20-key-concepts/10-kco/10-core-provider/20-version-management.md#pattern-2-parallel-versioning) · [Multi-Version Constraints](../../20-key-concepts/10-kco/10-core-provider/20-version-management.md#multi-version-constraints)

---

## 1. Identify the current setup

Assume you have a CompositionDefinition named `lifecycleapp-cd-v1` using chart version `0.0.1`.

```bash
kubectl get compositiondefinition lifecycleapp-cd-v1 -n cheatsheet-system
```

---

## 2. Deploy the new version

Instead of patching the old one, create a **new** CompositionDefinition with a unique name (e.g., `lifecycleapp-cd-v2`).

```bash
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: lifecycleapp-cd-v2
  namespace: cheatsheet-system
spec:
  chart:
    repo: github-scaffolding-lifecycle
    url: https://marketplace.krateo.io
    version: 0.0.2
EOF
```

**What happens:**
1. The Core Provider sees a new blueprint.
2. It registers a **new CRD version**.
3. It spawns a **new CDC instance** dedicated to version `0.0.2`.
4. Existing `v0.0.1` instances are **not affected**.

---

## 3. Verify side-by-side operation

Check that both blueprints are ready:

```bash
kubectl get compositiondefinition -n cheatsheet-system
```

Check that two CDCs are running:

```bash
kubectl get pods -n krateo-system | grep lifecycleapp
```

---

## 4. Lifecycle management

New Compositions can now be created using the new version. Old Compositions remain on the old version indefinitely.

> **Note on CRD versions:** While both CompositionDefinitions are active, two CRD versions (`v0-0-1` and `v0-0-2`) are registered. `kubectl` will default to the first stored version when no version is specified. Retire the old CompositionDefinition as soon as possible. See [Multi-Version Constraints](../../20-key-concepts/10-kco/10-core-provider/20-version-management.md#multi-version-constraints).

---

## Next steps

- [Selective Migration](70-selective-migration.md) (to move instances between these versions)
- [Delete Safely](80-delete-safely.md)
