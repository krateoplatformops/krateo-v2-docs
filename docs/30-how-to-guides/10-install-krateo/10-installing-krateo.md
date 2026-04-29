---
description: Learn how to install Krateo 3.0.0 on kind, LoadBalancer, Ingress, or OpenShift
sidebar_label: Installing Krateo 3.0.0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Install Krateo 3.0.0

This guide walks through installing Krateo 3.0.0 on Kubernetes, with specific instructions for **kind**, **LoadBalancer**, **Ingress**, and **OpenShift** environments.

---

## Prerequisites

- A Kubernetes cluster (v1.30+)
- `kubectl` configured to access your cluster
- `krateoctl` installed — see [krateoctl installation guide](../../20-key-concepts/50-krateoctl/10-overview.md)

:::warning
**Secrets must be created before installation.** Krateo requires three Kubernetes Secrets in the `krateo-system` namespace:
- `jwt-sign-key` — JWT signing key for platform authentication
- `krateo-db` — PostgreSQL connection string
- `krateo-db-user` — PostgreSQL username

See [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md) for detailed requirements and examples.
:::

:::warning
Krateo 3.0.0 uses CloudNativePG.
It is strongly recommended to analyze the specific needs of your environment and workload to determine the optimal configuration for the CNPG cluster.
Please refer to the [CNPG configuration guide](../50-manage-postgresql/30-cnpg-configuration.md) for details on customizing the CNPG cluster during installation.
:::

---

## Installation Methods

Choose the installation method that matches your environment.

<Tabs groupId="installation-type">
  <TabItem value="kind-nodeport" label="kind (NodePort)" default>

### Install on kind with NodePort

NodePort is the simplest method for local development with kind. Services are accessible via the node's IP and a high port number.

#### Prerequisites

- A kind cluster running locally (create one with the provided script)
- All three secrets created in `krateo-system` namespace (see [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md))

#### Step 1: Create a KIND cluster

Use the provided script from the repository:

```bash
curl -L https://raw.githubusercontent.com/krateoplatformops/krateo-v2-docs/refs/heads/main/scripts/kind.sh | bash
```

#### Step 2: Create secrets

Before installing Krateo, create the required secrets in `krateo-system` namespace. See [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md) for examples.

#### Step 3: Install Krateo

```bash
krateoctl install plan --version 3.0.0 --type nodeport
```

Review the output, then apply:

```bash
krateoctl install apply --version 3.0.0 --type nodeport
```

#### Step 4: Access Krateo

Krateo is available at:

```
http://localhost:30080
```

  </TabItem>

  <TabItem value="loadbalancer" label="LoadBalancer">

### Install with LoadBalancer

Use this method for cloud environments (AWS, GCP, Azure) where LoadBalancer services are provisioned automatically.

#### Prerequisites

- A cloud Kubernetes cluster with LoadBalancer support
- All three secrets created in `krateo-system` namespace (see [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md))

#### Step 1: Preview the installation

```bash
krateoctl install plan --version 3.0.0 --type loadbalancer
```

#### Step 2: Apply the installation

```bash
krateoctl install apply --version 3.0.0 --type loadbalancer
```

#### Step 3: Get the LoadBalancer IP and access Krateo

```bash
kubectl get svc frontend -n krateo-system -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Access Krateo at the returned IP on port 8080:

```
http://<LoadBalancer-IP>:8080
```

  </TabItem>

  <TabItem value="ingress" label="Ingress">

### Install with Ingress

Use this method when your cluster has an Ingress controller (nginx, traefik, etc.) and you want to manage ingress rules.

#### Prerequisites

- A Kubernetes cluster with an Ingress controller installed
- All three secrets created in `krateo-system` namespace (see [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md))
- A domain name pointing to your ingress controller's IP (or hosts file entry for testing)

#### Step 1: Preview the installation

```bash
krateoctl install plan --version 3.0.0 --type ingress
```

#### Step 2: Apply the installation

```bash
krateoctl install apply --version 3.0.0 --type ingress
```

#### Step 3: Get the Ingress host and access Krateo

```bash
kubectl get ingress -n krateo-system -o=jsonpath='{.items[0].spec.rules[0].host}'
```

Access Krateo at the returned hostname on port 8080:

```
http://<ingress-host>:8080
```

Make sure your DNS or hosts file points to your ingress controller's IP.

  </TabItem>

  <TabItem value="openshift" label="OpenShift">

### Install on OpenShift

OpenShift has specific networking and security requirements. The `--profile openshift` flag is used **in combination with** a `--type` (typically `loadbalancer` or `ingress`) to configure Krateo for OpenShift.

#### Prerequisites

- OpenShift 4.x cluster
- `oc` CLI configured to access your cluster
- All three secrets created in `krateo-system` namespace (see [Secrets Spec](../../20-key-concepts/50-krateoctl/50-secrets.md))

#### Step 1: Preview the installation

Choose the combination that fits your OpenShift setup:

**With LoadBalancer:**
```bash
krateoctl install plan --version 3.0.0 --type loadbalancer --profile openshift
```

**With Ingress:**
```bash
krateoctl install plan --version 3.0.0 --type ingress --profile openshift
```

The `--profile openshift` flag automatically:
- Configures SCC (SecurityContextConstraint) policies for the platform
- Adapts networking resources for OpenShift compatibility
- Applies proper RBAC for OpenShift environments

#### Step 2: Apply the installation

Using LoadBalancer:
```bash
krateoctl install apply --version 3.0.0 --type loadbalancer --profile openshift
```

Or using Ingress:
```bash
krateoctl install apply --version 3.0.0 --type ingress --profile openshift
```

#### Step 3: Get the Ingress/LoadBalancer and access Krateo

For **LoadBalancer**:
```bash
kubectl get svc frontend -n krateo-system -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

Access Krateo at the returned IP on port 8080:
```
http://<LoadBalancer-IP>:8080
```

For **Ingress**:
```bash
kubectl get ingress -n krateo-system -o=jsonpath='{.items[0].spec.rules[0].host}'
```

Access Krateo at the returned hostname on port 8080:
```
http://<ingress-host>:8080
```

  </TabItem>
</Tabs>

---

## Getting Started Credentials

After successful installation, Krateo creates two default user accounts with auto-generated passwords stored as Kubernetes Secrets in the `krateo-system` namespace.

### Admin User

The **admin** account is the primary administrative user with full platform access.

Retrieve the admin password:

```bash
kubectl get secret admin-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

**Login credentials:**
- **Username:** `admin`
- **Password:** (retrieved from the secret above)

### Cyberjoker User

The **cyberjoker** account is a test user useful for validating multi-tenancy features and testing different user permissions.

Retrieve the cyberjoker password:

```bash
kubectl get secret cyberjoker-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

**Login credentials:**
- **Username:** `cyberjoker`
- **Password:** (retrieved from the secret above)

:::tip
Use the cyberjoker account to test multi-tenant scenarios and verify that role-based access control (RBAC) is working correctly across different user contexts.
:::

---

## Troubleshooting

### Secrets not found

If you see errors about missing secrets:

```bash
# Verify secrets exist
kubectl get secrets -n krateo-system

# Create missing secrets if needed (see Secrets Spec)
```

### Pods stuck in pending

Check resource availability:

```bash
kubectl describe pod <pod-name> -n krateo-system
kubectl top nodes
kubectl top pods -n krateo-system
```

### Installation snapshot issues

Inspect the stored installation state:

```bash
kubectl get installation krateoctl -n krateo-system -o yaml
```

---

## Next Steps

- Deploy a [CompositionDefinition](../30-kco-operations/20-deploy-composition-definition.md)
- Create a [Composition](../30-kco-operations/30-create-composition.md)
- Explore [krateoctl commands](../../20-key-concepts/50-krateoctl/10-overview.md)
