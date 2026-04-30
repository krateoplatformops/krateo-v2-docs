# Helm Release Naming Logic

The **Composition Dynamic Controller (CDC)** uses specific logic to determine the name of the Helm release it manages. This logic has evolved to ensure uniqueness and prevent collisions in multi-tenant environments.

## Modern Naming (v0.20.0+)

By default, the CDC generates a release name using the following priority:

1. **Explicit Annotation**: If the `krateo.io/release-name` annotation is present on the `Composition` resource, its value is used directly.
2. **Generated Name**: Otherwise, the name is generated as:  
   `{composition.metadata.name}-{composition.metadata.uid[:8]}`

### Character Limits
Because Helm limits release names to **53 characters** and Krateo appends a 9-character suffix (hyphen + 8-char UID), the `metadata.name` of your Composition must not exceed **44 characters**.

---

## Legacy Naming (Configurable)

In versions prior to v0.20.0, the UID suffix was not appended. You can revert to this behavior using the environment variable:  
`COMPOSITION_CONTROLLER_SAFE_RELEASE_NAME: "false"`

| `SAFE_RELEASE_NAME` | Suffix | Collision Risk | Max Name Length |
| :--- | :--- | :--- | :--- |
| **`true` (Default)** | Included | Negligible | 44 Characters |
| **`false`** | Excluded | **High** | 53 Characters |

:::warning Collision Risk
Disabling "Safe Release Name" is highly discouraged. Without the UID suffix, creating Compositions with the same name in different namespaces will cause Helm naming collisions, leading to failed operations.
:::

## Summary Table

| Source | Priority | Notes |
| :--- | :--- | :--- |
| `krateo.io/release-name` | 1 | Highest priority; bypasses automatic generation. |
| Composition Name | 2 | Default; combined with UID if "safe mode" is enabled. |
