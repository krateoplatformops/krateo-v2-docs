# Secrets configuration

:::warning
`krateoctl` does not bootstrap production secrets.
Manage them in Vault or create them manually before you run install or migration commands.
:::
`krateoctl` expects installation secrets to be managed outside the normal install flow.

Recommended approach:

- store the secrets in a system like Vault
- sync the Vault data (or similar) into Kubernetes with your preferred secret management tool

Manual creation is also supported.

## Scope

The secrets in this configuration should exist **in the installation namespace** before you run `krateoctl install apply` or `krateoctl install migrate-full`.

The default install namespace is `krateo-system`, unless you override it.

## Required Secrets

### `jwt-sign-key`

- type: `Opaque`
- secret key: `JWT_SIGN_KEY`
- value: a random signing key

This secret is used by the platform JWT-related components.

### `krateo-db`

- type: `Opaque`
- secret keys:
  - `DB_USER`: `krateo-db-user`
  - `DB_PASS`: database password

This secret is used by the components that need database access: `deviser`, `resources-ingester`, `resources-presenter`, `events-ingester` and `events-presenter`.

**Note**: this secret is always required, even if you are using [your own PostgreSQL instance](../50-manage-postgresql/40-bring-your-own-postgresql.md).

### `krateo-db-user`

- type: `Opaque`
- secret keys:
  - `username`: `krateo-db-user`
  - `password`: database password

This secret is used by the CNPG during installation to create the database user.

Note the different key names compared to `krateo-db` but the **same values for username and password**.

**Note**: if you are using your own PostgreSQL instance, this secret is not required as it is only used by the default CNPG installation by Krateo.

## Consistency Rules

- `krateo-db` and `krateo-db-user` must use the same username and password values.
- The `jwt-sign-key` should be generated once and kept stable across upgrades.
- All secrets must be created in the same namespace that `install apply` uses.

## Manual Creation Example

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: jwt-sign-key
  namespace: krateo-system
type: Opaque
stringData:
  JWT_SIGN_KEY: replace-with-a-random-base64-key
---
apiVersion: v1
kind: Secret
metadata:
  name: krateo-db
  namespace: krateo-system
type: Opaque
stringData:
  DB_USER: krateo-db-user
  DB_PASS: replace-with-a-shared-db-password
---
apiVersion: v1
kind: Secret
metadata:
  name: krateo-db-user
  namespace: krateo-system
type: Opaque
stringData:
  username: krateo-db-user
  password: replace-with-a-shared-db-password
```

## Notes

- If you use Vault, keep the Kubernetes Secret names and keys exactly as listed here.
- Production installs should manage these secrets independently of `krateoctl`.
