# Install Krateo Core Provider

This guide covers the initial installation of the Krateo Core Provider.

> **Concepts:** [Architecture](../../20-key-concepts/10-kco/11-architecture.md#architecture) · [Glossary](../../20-key-concepts/10-kco/11-architecture.md#glossary)

## Prerequisites

For comprehensive Krateo 3.0.0 installation instructions covering **kind (NodePort)**, **LoadBalancer**, **Ingress**, and **OpenShift** environments, see the [Installing Krateo 3.0.0](../10-install-krateo/10-installing-krateo.md) guide.

### Requirements
- Kubernetes cluster (1.30+ recommended)
- `helm` v3.x CLI
- `kubectl` CLI
- For other environments (LoadBalancer, Ingress, OpenShift), refer to the [comprehensive installation guide](../10-install-krateo/10-installing-krateo.md).
- `krateoctl` installed — see [krateoctl overview](../../20-key-concepts/50-krateoctl/10-overview.md)

## Installation Steps

1. Add the Helm repository:
   ```bash
   helm repo add krateo https://charts.krateo.io
   helm repo update
   ```

2. Install the Core Provider:
   ```bash
   helm install krateo-core-provider krateo/core-provider \
     --namespace krateo-system \
     --create-namespace
   ```

3. Verify the installation:
   ```bash
   kubectl get pods -n krateo-system
   ```

## Next Steps
- [Deploy your first CompositionDefinition](./20-deploy-composition-definition.md)
- [Explore krateoctl commands](../../20-key-concepts/50-krateoctl/10-overview.md)
