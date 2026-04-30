# How to: Delete Safely

Removing Krateo resources should be done in a specific order to ensure Helm releases are uninstalled and Kubernetes resources are cleaned up without leaving orphaned objects.

> **Concepts:** [Lifecycle Workflow](../../20-key-concepts/10-kco/11-architecture.md#lifecycle-workflow) · [Security by Design](../../20-key-concepts/10-kco/10-core-provider/30-security-design.md)

---

## 1. Delete a Composition

Deleting a `Composition` resource triggers the `helm uninstall` of the associated release.

```bash
kubectl delete composition <name> --namespace <namespace>
```

**What happens:**
1. The CDC detects the deletion.
2. It executes `helm uninstall`.
3. It cleans up any extra resources it created (e.g., finalizers).
4. Once the uninstall succeeds, the Composition resource is removed.

---

## 2. Delete a CompositionDefinition

Only delete a `CompositionDefinition` after all its managed Compositions have been removed.

```bash
kubectl delete compositiondefinition <name> --namespace <namespace>
```

**What happens:**
1. The Core Provider detects the deletion.
2. It removes the generated CRD.
3. It deletes the associated CDC deployment.
4. It cleans up the scoped RBAC policies.

---

## Troubleshooting Deletions

If a resource is stuck in `Terminating`:

1. Check the CDC logs for Helm errors:
   ```bash
   kubectl logs -n krateo-system -l app=composition-dynamic-controller
   ```
2. Ensure the CDC has enough permissions to delete all resources in the chart.
3. See [Troubleshooting](../../20-key-concepts/10-kco/40-troubleshooting.md) for additional error patterns.

---

## Next steps

- [Install Krateo Core Provider](10-install.md)
- [Deploy a CompositionDefinition](20-deploy-composition-definition.md)
