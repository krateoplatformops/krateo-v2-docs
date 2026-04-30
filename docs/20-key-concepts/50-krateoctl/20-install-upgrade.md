# Install and Upgrade

`krateoctl install plan` and `krateoctl install apply` cover the main install and upgrade workflows for Krateo.

- `plan` previews what `krateoctl` would do, without talking to the cluster.
- `apply` executes the workflow against the cluster.

:::warning
Secrets must be managed separately. `krateoctl` does not bootstrap production secrets. Use Vault or create the required Kubernetes Secrets manually before running install or upgrade commands.
See the [Secrets Spec](50-secrets.md) for the required names, keys, and namespace rules.
:::

## Table Of Contents

- [Release Source](#release-source)
- [Installation Snapshot](#installation-snapshot)
- [Secrets](#secrets)
- [Plan Command](#plan-command)
- [Apply Command](#apply-command)
- [Upgrade Flow](#upgrade-flow)
- [Notes](#notes)

## When To Use Them

Use these commands when you want to:

- install Krateo from a local `krateo.yaml`
- upgrade to a tagged release version
- compare the computed plan with the last stored installation snapshot
- run type-specific workflows for `nodeport`, `loadbalancer`, or `ingress`

## Release Source

When you pass `--version`, `krateoctl` switches to remote mode and fetches files from the releases repository instead of the local filesystem.

The default repository is:

- [https://github.com/krateoplatformops/releases](https://github.com/krateoplatformops/releases)

This repository is used as a versioned source of installation assets. `krateoctl` builds raw GitHub URLs from it and looks for files such as:

- `krateo.yaml`
- `krateo.<type>.yaml` (e.g., `krateo.nodeport.yaml`)
- `krateo-overrides.yaml`
- `krateo-overrides.<profile>.yaml`
- `pre-upgrade.yaml`
- `pre-upgrade.<type>.yaml`
- `post-upgrade.yaml`
- `post-upgrade.<type>.yaml`

If you maintain your own release repository, you can point `--repository` at a GitHub repo with the same layout.

### Profile Resolution

When you specify `--profile` (e.g., `--profile dev` or `--profile dev,aws-lb-hostname`):

- **In remote mode** (`--version` set): krateoctl searches for `krateo-overrides.<profile>.yaml` in the remote repository first, then falls back to local files if not found.
- **In local mode** (no `--version`): krateoctl searches for `krateo-overrides.<profile>.yaml` in local files only.
- **If the profile is not found** in either location (or both), krateoctl returns an error and stops execution.

This allows profiles to be overridden locally even when using a remote release, but requires at least one source to contain the profile file.

:::warning
**Profiles persist across upgrades** — Changing replaces values, omitting reverts to defaults. Always include your profiles in both `plan` and `apply`. Use `plan --diff-installed` before `apply` to verify changes.
:::

## Installation Snapshot

`krateoctl` saves the resolved installation state as an `Installation` custom resource in the `krateo.io/v1` API group.

The snapshot contains:

- the resolved `componentsDefinition`
- the computed `steps`
- the `installationVersion` used to build it

By default, the snapshot is stored with the name `krateoctl` in the install namespace.

### How It Is Used

- `krateoctl install apply` saves the snapshot after a successful apply.
- `krateoctl install plan --diff-installed` loads the stored snapshot and compares it with the newly computed plan.
- `krateoctl install migrate-full` also saves the snapshot as part of the automatic migration flow.

### Why It Exists

The snapshot gives `krateoctl` a durable record of what was last computed and applied. That makes it easier to:

- compare a new release against the current state
- detect drift between the installed workflow and the newly computed one
- keep a versioned record of the installation logic that produced the cluster state

### Notes

- The snapshot resource is namespaced.
- The CRD is installed automatically by `krateoctl install apply` and the migration flow if it is missing.
- If the snapshot is not present, `plan --diff-installed` reports that it could not find one and continues without a diff.

## Secrets

Secrets are managed separately from the install workflow. The recommended approach is to store them in Vault and sync them into Kubernetes.

See the full [Secrets Spec](50-secrets.md) for the required names, keys, and namespace rules.

## Plan Command

`krateoctl install plan` is the command that loads the configuration, computes the workflow, and prints the result as multi-document YAML or as a diff summary.

:::tip
**Always run `plan` before `apply`** to inspect the changes and avoid unexpected configuration modifications.
:::

### Usage

```sh
krateoctl install plan [FLAGS]
```

### Key Flags

- `--version` release tag to fetch from the releases repository
- `--repository` custom GitHub repository URL for release assets, default `https://github.com/krateoplatformops/releases`
- `--config` local configuration file, default `krateo.yaml`
- `--profile` optional profile name, such as `dev` or `prod`
- `--namespace` namespace where the installation snapshot is stored
- `--type` file variant to use, such as `nodeport`, `loadbalancer`, or `ingress`
- `--diff-installed` compare the computed plan against the stored installation snapshot
- `--diff-format` choose how diffs are rendered; use `table` for a per-step summary view
- `--output` emit the computed plan as YAML to stdout
- `--skip-validation` skip configuration validation
- `--debug` enable debug logging, or set `KRATEOCTL_DEBUG`

### How It Works

1. **Resolve Main Config**: Loads the configuration file. If `--type` is specified (e.g., `nodeport`), it looks for `krateo.nodeport.yaml`. If not found, or if no type is specified, it falls back to `krateo.yaml`.
2. **Apply Overrides**: Applies `krateo-overrides.yaml` and any profile-specific overrides (`krateo-overrides.<profile>.yaml`) if `--profile` is present.
   - When `--profile` is used (e.g., `--profile dev,test`), krateoctl looks for `krateo-overrides.<profile>.yaml` files.
   - **In remote mode** (`--version` set): searches the releases repository first, then falls back to local files if not found.
   - **In local mode** (no `--version`): searches only local files.
3. **Resolve Hooks**: Selects type-specific pre/post upgrade hooks (e.g., `pre-upgrade.nodeport.yaml`) with a fallback to generic ones (e.g., `pre-upgrade.yaml`).
4. **Compute Workflow**: Processes all gathered definitions and computes the execution plan.
5. **Diff (Optional)**: If `--diff-installed` is used, compares the computed plan against the last saved installation snapshot.

### Understanding --diff-installed

The `--diff-installed` flag controls the output mode of the `plan` command:

- **Without `--diff-installed` (Default)**: Generates and displays the **execution plan** (the sequence of steps) that `krateoctl` would perform based on the resolved configuration (including overrides and profiles).
  - Use this to preview the installation workflow.
  - Useful for verifying that your configuration, profiles, and flags (like `--type`) are correctly interpreted.

- **With `--diff-installed`**: Performs a **diff** between the newly computed plan and the **stored installation snapshot** (the state of the last successful `apply`).
  - Use this to see exactly what will change in the cluster if you run `apply`.
  - Useful for understanding the impact of an upgrade or a configuration change relative to the current cluster state.

### Examples

```sh
# Preview the local installation config
krateoctl install plan
```

```sh
# Preview a specific release version from the default releases repository
krateoctl install plan --version 3.0.0
```

```sh
# Preview from a custom releases repository
krateoctl install plan --version 3.0.0 --repository https://github.com/myorg/krateo-releases
```

```sh
# Compare the plan against the stored snapshot (what changed since last apply)
krateoctl install plan --version 3.0.0 --diff-installed
```

```sh
# Show a step-by-step diff summary in a table
krateoctl install plan --diff-format table
```

```sh
# Preview with a profile from local files
krateoctl install plan --profile dev
```

```sh
# Preview with a profile from a release version (searches repository first, then local)
krateoctl install plan --version 3.0.0 --profile dev
```

```sh
# Preview with multiple profiles (all profiles use remote-first, local-fallback)
krateoctl install plan --version 3.0.0 --profile dev,aws-lb-hostname
```

## Apply Command

`krateoctl install apply` is the command that executes the computed workflow against the cluster.

:::warning
**Profiles and Versions Affect Your Configuration**

When you run `apply`, the combination of `--version`, `--type`, and `--profile` flags directly determines which configuration values are applied:

1. **Changing profiles or versions replaces values** — If you used `--profile dark-theme` in one apply and `--profile light-theme` in the next apply, all values from the previous `dark-theme` profile will be replaced with `light-theme` values.

2. **Omitting a profile removes its configuration** — If you used `--profile dark-theme` initially and then run `apply` without it, the dark-theme configuration is lost and reverts to defaults.

3. **Always use `plan` to inspect changes** — Always run `krateoctl install plan` (with the same flags you'll use for `apply`) before actually running `apply`, so you can review the changes and confirm they are expected.

:::

### Usage

```sh
krateoctl install apply [FLAGS]
```

### Key Flags

- `--version` release tag to fetch from the releases repository
- `--repository` custom GitHub repository URL for release assets, default `https://github.com/krateoplatformops/releases`
- `--config` local configuration file, default `krateo.yaml`
- `--namespace` target namespace
- `--type` file variant to use, such as `nodeport`, `loadbalancer`, or `ingress`
- `--profile` optional profile name
- `--skip-validation` skip configuration validation
- `--debug` enable debug logging, or set `KRATEOCTL_DEBUG`

### What `apply` Does

1. Loads the configuration in local or remote mode.
2. Ensures the Installation CRD exists.
3. Applies any `pre-upgrade` manifests first.
4. Runs the main workflow steps.
5. Applies any `post-upgrade` manifests after the workflow completes.
6. Saves the resulting installation snapshot.

### Examples

```sh
# Apply from the local configuration
krateoctl install apply
```

```sh
# Apply a tagged release from the default releases repository
krateoctl install apply --version 3.0.0
```

```sh
# Apply a tagged release and use a custom repository
krateoctl install apply --version 3.0.0 --repository https://github.com/myorg/krateo-releases
```

```sh
# Apply with a type-specific layout
krateoctl install apply --config ./krateo.yaml --type ingress
```

```sh
# Apply with a profile (preview first with: krateoctl install plan --version 3.0.0 --profile dark-theme)
krateoctl install apply --version 3.0.0 --profile dark-theme
```

## Upgrade Flow

For a safe upgrade workflow, always follow this sequence:

:::tip
**Recommended Safe Upgrade Workflow**

1. Run `krateoctl install plan --version <tag> --diff-installed` to compare the target release with the stored installation snapshot.
   - This shows you exactly what changed since your last `apply`
   - Review the diff carefully before proceeding

2. Verify your `--profile` and `--type` flags are correct
   - If you previously used `--profile`, include it again or the profile configuration will be lost
   - If you're changing profiles, understand that existing values will be replaced

3. Run `krateoctl install apply --version <tag>` with the same flags you used in `plan`
   - This ensures the configuration matches what you previewed

4. Verify the upgrade succeeded
   - Check pod status and events in your namespace
:::

**General Upgrade Guidelines:**

- Keep `--repository` pointed at `https://github.com/krateoplatformops/releases` unless you mirror the release assets elsewhere
- Use `--type` to match the target environment layout, such as `nodeport`, `loadbalancer`, or `ingress`
- Use `--diff-installed` when you want to compare against the stored snapshot (what changed since last apply)
- Omit `--diff-installed` if you want to see the diff against the configuration file instead

**Profile Best Practices:**

- Document which profiles you are using in your environment
- Always include `--profile` in both `plan` and `apply` commands if you're using profiles
- Never omit a profile in `apply` if it was used in previous applies, or the configuration will revert to defaults
- When changing profiles, use `plan --diff-installed` to see the full impact before applying

## Notes

- Local mode uses files from disk and is the right fit when you are developing or testing a config change.
- Remote mode uses the releases repository and is the right fit when you are upgrading to an existing tagged release.
