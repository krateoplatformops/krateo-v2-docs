# How to: Deploy a CompositionDefinition

> **Concepts:** [CompositionDefinition](../../20-key-concepts/10-kco/11-architecture.md#glossary) · [Chart Requirements](../../20-key-concepts/10-kco/11-architecture.md#chart-requirements) · [Lifecycle Workflow](../../20-key-concepts/10-kco/11-architecture.md#lifecycle-workflow)

A CompositionDefinition registers a Helm chart as a versioned Kubernetes API. This guide walks through deploying the **GitHub Scaffolding Lifecycle** chart from the Krateo Marketplace, which is used throughout these how-to guides.

---

## Prerequisites

- Krateo platform installed — see [Install](10-install.md)
- The chart has a `values.schema.json` at its root — see [Chart Requirements](../../20-key-concepts/10-kco/11-architecture.md#chart-requirements)

---

## 1. Create a namespace

```bash
kubectl create namespace cheatsheet-system
```

---

## 2. Deploy the CompositionDefinition

```bash
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: lifecycleapp-cd-v1
  namespace: cheatsheet-system
spec:
  chart:
    repo: github-scaffolding-lifecycle
    url: https://marketplace.krateo.io
    version: 0.0.1
EOF
```

---

## 3. Wait for it to become ready

```bash
kubectl wait compositiondefinition lifecycleapp-cd-v1 \
  --for condition=Ready=True \
  --namespace cheatsheet-system \
  --timeout=600s
```

**What happens:** The Core Provider downloads the chart from the Krateo Marketplace, validates `values.schema.json`, generates the CRD, creates RBAC resources, and deploys the CDC. Once all steps complete, the condition flips to `Ready=True`.

---

## Verify the CompositionDefinition

```bash
kubectl get compositiondefinition -n cheatsheet-system
```

You should see `lifecycleapp-cd-v1` with `Ready=True`.

---

## Advanced: Alternative Chart Sources

### OCI Registry

To deploy from an OCI registry instead of a Helm repository:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: lifecycleapp-cd-v1
  namespace: cheatsheet-system
spec:
  chart:
    url: oci://registry-1.docker.io/yourusername/my-chart
    version: "0.1.0"
EOF
```

Examples: [OCI with repo field](https://github.com/krateoplatformops/krateoctl/blob/main/testdata/examples/compositiondefinition-postgresql-oci-repo.yaml) · [OCI without repo field](https://github.com/krateoplatformops/krateoctl/blob/main/testdata/examples/compositiondefinition-postgresql-oci-no-repo.yaml)

### TGZ Archive (direct URL)

To deploy from a direct TGZ archive URL:

```bash
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: lifecycleapp-cd-v1
  namespace: cheatsheet-system
spec:
  chart:
    url: https://example.com/charts/my-chart-0.1.0.tgz
    version: "0.1.0"
EOF
```

Example: [TGZ archive example](https://github.com/krateoplatformops/krateoctl/blob/main/testdata/examples/compositiondefinition-postgresql-tgz.yaml)

---

## Advanced: Authentication for Private Registries

If your chart source is private, add a `credentials` block to `spec.chart`.

### OCI Registry

Create the secret first:

```bash
kubectl create secret generic my-registry-secret \
  --from-literal=token=YOUR_TOKEN \
  -n cheatsheet-system
```

Then add credentials to the CompositionDefinition:

```yaml
spec:
  chart:
    url: oci://registry-1.docker.io/yourusername/my-chart
    version: "0.1.0"
    credentials:
      username: yourusername
      passwordRef:
        key: token
        name: my-registry-secret
        namespace: cheatsheet-system
```

### GCP Artifact Registry

Create the secret from your service account key JSON file (the service account needs Artifact Registry Reader permissions):

```bash
kubectl create secret generic gcp-sa-secret -n cheatsheet-system \
  --from-file=secret-access-credentials=/path/to/krateoregistry-key.json
```

Then configure the CompositionDefinition:

```yaml
spec:
  chart:
    url: oci://europe-west12-docker.pkg.dev/myproject/myrepo/my-chart
    version: "0.0.1"
    credentials:
      username: json_key          # required literal value for GCP
      passwordRef:
        key: secret-access-credentials
        name: gcp-sa-secret
        namespace: cheatsheet-system
```

> The `username` must be `json_key` for GCP Artifact Registry. See the [GCP documentation](https://cloud.google.com/artifact-registry/docs/helm/authentication#linux-macos_1).

### Helm Repository

Create the secret:

```bash
kubectl create secret generic helm-repo-secret \
  --from-literal=token=YOUR_TOKEN \
  -n cheatsheet-system
```

Then add credentials:

```yaml
spec:
  chart:
    repo: my-chart
    url: https://charts.example.com
    version: "0.3.0"
    credentials:
      username: yourusername
      passwordRef:
        key: token
        name: helm-repo-secret
        namespace: cheatsheet-system
```

---

## Next steps

- [Create a Composition](30-create-composition.md) instance from this CompositionDefinition
- [Explore the CompositionDefinition CRD](../../60-core-crd-reference/10-core-provider-crd.md) for detailed specification
