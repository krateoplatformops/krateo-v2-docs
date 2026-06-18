# How to: Create a Composition

> **Concepts:** [Composition](../../20-key-concepts/10-kco/11-architecture.md#glossary) · [CDC](../../20-key-concepts/10-kco/11-architecture.md#glossary)

A Composition is a live instance of a service defined by a CompositionDefinition. Creating one triggers the installation of the associated Helm chart.

---

## Prerequisites

- CompositionDefinition deployed and `Ready=True` — see [Deploy a CompositionDefinition](20-deploy-composition-definition.md)
- GitHub credentials secret (for the example chart used here)

---

## 1. Create the credentials secret

```bash
kubectl create secret generic github-repo-creds \
  --namespace krateo-system \
  --from-literal=token=YOUR_GITHUB_TOKEN
```

---

## 2. Create the Composition

The `apiVersion` reflects the chart version managed by your CompositionDefinition (e.g., `composition.krateo.io/v0-0-1` for chart version `0.0.1`).

```bash
cat <<EOF | kubectl apply -f -
apiVersion: composition.krateo.io/v0-0-1
kind: GithubScaffoldingLifecycle
metadata:
  name: lifecycle-composition-1
  namespace: cheatsheet-system
spec:
  argocd:
    namespace: krateo-system
    application:
      project: default
      source:
        path: chart/
      destination:
        server: https://kubernetes.default.svc
        namespace: githubscaffolding-app
      syncEnabled: false
      syncPolicy:
        automated:
          prune: true
          selfHeal: true
  app:
    service:
      type: NodePort
      port: 31180
  git:
    unsupportedCapabilities: true
    insecure: true
    fromRepo:
      scmUrl: https://github.com
      org: krateoplatformops-blueprints
      name: github-scaffolding-lifecycle
      branch: main
      path: skeleton/
      credentials:
        authMethod: generic
        secretRef:
          namespace: krateo-system
          name: github-repo-creds
          key: token
    toRepo:
      scmUrl: https://github.com
      org: your-github-org        # replace with your GitHub org
      name: lifecycleapp-test-1   # customize the repository name
      branch: main
      path: /
      credentials:
        authMethod: generic
        secretRef:
          namespace: krateo-system
          name: github-repo-creds
          key: token
      private: false
      initialize: true
      deletionPolicy: Delete
      verbose: false
      configurationRef:
        name: repo-config
        namespace: demo-system
EOF
```

---

## 3. Wait for the Composition to become ready

```bash
kubectl wait githubscaffoldinglifecycles lifecycle-composition-1 \
  --for condition=Ready=True \
  --timeout=300s \
  --namespace cheatsheet-system
```

---

## 4. Verify the Helm release

```bash
helm list -n cheatsheet-system
```

**Expected:** A release named `lifecycle-composition-1-<UUID>` at the chart version you specified (e.g., `0.0.1`).

---

## What if the resource already exists?

- **The generated CRD already exists** (another CompositionDefinition created it, or it predates this one): the Core Provider **adopts** it and adds the new version to the existing CRD — it does not error or overwrite it. Several CompositionDefinitions for the same kind coexist as multiple versions of one CRD.
- **A Helm release with the same computed name already exists**: the CDC **upgrades** that release instead of failing — creating a Composition after a previously-failed install is safe and idempotent.
- **An arbitrary Kubernetes object the chart would create already exists** (created outside this release): this is **not** adopted. Standard Helm ownership rules apply and the install fails with an *"exists and cannot be imported into the current release"* error. Importing pre-existing live objects into a Composition is not supported.

---

## Updating, drift, and deleting

- **You change the Composition's `spec`**: there is no separate apply step — the CDC detects the change and runs a `helm upgrade` with the new spec as chart values.
- **Someone edits a managed resource by hand (drift)**: the CDC reconciles the Composition continuously and re-applies the rendered release, so out-of-band changes to the chart's resources are reverted on the next reconcile. To stop this on purpose, pause the Composition or set a read-only management policy — see [Pause / Resume](40-pause-resume.md) and [Lifecycle Policies](45-lifecycle-policies.md).
- **You delete the Composition**: the CDC uninstalls the Helm release — or leaves it running if `krateo.io/deletion-policy: orphan` is set. See [Delete Safely](80-delete-safely.md).

---

## Next steps

- [Full Migration](50-full-migration.md) — upgrade all Compositions to a new chart version
- [Parallel Versioning](60-parallel-versioning.md) — run a second chart version side-by-side
- [Selective Migration](70-selective-migration.md) — migrate individual Compositions to a new version
- [Pause / Resume](40-pause-resume.md) — temporarily halt reconciliation
- [Lifecycle Policies](45-lifecycle-policies.md) — restrict which operations Krateo may perform (read-only, orphan on delete)
- [Delete Safely](80-delete-safely.md) — remove Compositions and CompositionDefinitions cleanly
