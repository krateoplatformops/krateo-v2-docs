# Security by Design

Security is a foundational pillar of the Krateo Core Provider. The architecture is designed to enforce **least-privilege** access and strict isolation between managed services.

## RBAC Isolation

One of Krateo's most powerful security features is the automatic generation of scoped RBAC policies.

1.  **Per-CDC Isolation**: Every `CompositionDefinition` is managed by a dedicated **CDC** instance running in its own pod.
2.  **Dynamic Permissions**: The CDC does not have cluster-admin rights. Instead, it only receives permissions for the specific resources declared in the Helm chart (calculated via the **Chart Inspector**).
3.  **ServiceAccount Scoping**: Each CDC uses a dedicated ServiceAccount, ensuring that a vulnerability in one managed service cannot be used to compromise other parts of the cluster.

## Credential Management

Krateo handles sensitive information with care:
- **Private Registries**: Supports authentication for OCI and private Helm repositories via Kubernetes Secrets.
- **Secret Injection**: Provides mechanisms to safely inject secrets into managed compositions without exposing them in the `Composition` resource spec.

## Schema-Driven Validation

By generating CRDs from `values.schema.json`, Krateo enforces strict input validation at the API level.
- **Prevention**: Invalid configurations are rejected by the Kubernetes API server before they ever reach the controller.
- **Type Safety**: Ensures that only well-formed data is processed by the underlying Helm charts.
