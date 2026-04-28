# CDC Workflow & Chart Inspector

This document provides a deep dive into how the **Composition Dynamic Controller (CDC)** works in tandem with the **Chart Inspector** to ensure secure and predictable Helm lifecycle management.

## The Interaction Model

The CDC doesn't just "run Helm"; it acts as a sophisticated orchestrator that pre-flights every operation to ensure cluster safety.

### 1. Reconciliation Trigger
- The CDC watches for changes in `Composition` resources or updates to the source Helm chart.
- When a change is detected, it immediately queries the **Chart Inspector**.

### 2. Dry-Run Analysis (Chart Inspector)
The Chart Inspector performs a server-side dry-run of the Helm chart with the provided values. It returns:
- **Manifest List**: Every Kubernetes object (Deployments, Services, CRDs, etc.) the chart intends to create.
- **Resource Metadata**: API groups, kinds, and namespaces for each resource.

### 3. Dynamic RBAC Provisioning
Before applying any changes, the CDC uses the Inspector's report to:
- Generate a **least-privilege** RBAC Role/ClusterRole.
- Update its own ServiceAccount permissions to match *exactly* what the chart requires.
- This prevents the controller from having "God-mode" permissions over the entire cluster.

### 4. Atomic Execution
Only after the RBAC is successfully provisioned does the CDC proceed with the actual `helm install` or `helm upgrade`.

## Key Capabilities

| **Feature** | **Description** |
| :--- | :--- |
| **Version Drift Detection** | The CDC detects if the live Helm release version differs from the version specified in the `CompositionDefinition`. |
| **Atomic Upgrades** | If the Chart Inspector detects a breaking change (e.g., a required CRD that cannot be created), the upgrade is halted before it affects the cluster. |
| **Self-Healing** | The CDC continuously compares the desired state (from the dry-run) with the actual cluster state, correcting any manual configuration drift. |
| **Security Isolation** | RBAC is scoped per-composition. A security breach in one composition cannot easily spread to others because the controller's permissions are strictly bounded. |

## Real-World Example: Handling a New CRD
1. **Scenario**: A Helm chart upgrade introduces a new `PrometheusRule` CRD.
2. **Detection**: The Chart Inspector identifies the new CRD in the dry-run output.
3. **RBAC Update**: The CDC automatically adds `get`, `list`, and `create` permissions for `PrometheusRules` to its ServiceAccount.
4. **Completion**: The Helm upgrade proceeds smoothly because the permissions are already in place.
