# Helm Release Naming Logic

The **Composition Dynamic Controller (CDC)** uses specific logic to determine the name of the Helm release it manages. This logic has evolved to ensure uniqueness and prevent collisions in multi-tenant environments.

## Modern Naming (v0.20.0+)

By default, the CDC determines the release name using the following priority:

1. **Explicit label (override)**: If the `krateo.io/release-name` label is already set on the `Composition`, its value is used as-is.
2. **Generated name**: Otherwise, the name is generated as:  
   `{composition.metadata.name}-{composition.metadata.uid[:8]}`

The resolved name is then **written back to the `krateo.io/release-name` label** on the Composition, so it is sticky: once set it never changes for that instance. Note this is a **label**, not an annotation.

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
| `krateo.io/release-name` label (pre-set) | 1 | Highest priority; bypasses automatic generation. |
| Composition Name | 2 | Default; combined with UID if "safe mode" is enabled. The result is stored back into the `krateo.io/release-name` label. |
