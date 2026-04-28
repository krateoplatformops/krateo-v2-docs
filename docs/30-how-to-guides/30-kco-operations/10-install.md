# How to: Install the Krateo Platform

> **Concepts:** [Architecture](../11-concepts.md#architecture) · [Glossary](../11-concepts.md#glossary)

For comprehensive Krateo 3.0.0 installation instructions covering **kind (NodePort)**, **LoadBalancer**, **Ingress**, and **OpenShift** environments, see the [Installing Krateo 3.0.0](../../../30-how-to-guides/10-install-krateo/10-installing-krateo.md) guide.

---

## Quick Install Summary

The recommended approach uses `krateoctl` to install Krateo 3.0.0:

```bash
krateoctl install apply --version 3.0.0 --type nodeport
```

For other environments (LoadBalancer, Ingress, OpenShift), refer to the [comprehensive installation guide](../../../30-how-to-guides/10-install-krateo/10-installing-krateo.md).

---

## Prerequisites

- A Kubernetes cluster (v1.30+)
- `kubectl` configured to access your cluster
- `krateoctl` installed — see [krateoctl overview](../../../key-concepts/krateoctl/krateoctl-overview)

---

## Next steps

- [Deploy a CompositionDefinition](20-deploy-composition-definition.md)
- [Create a Composition](30-create-composition.md)
- [Explore krateoctl commands](../../../key-concepts/krateoctl/krateoctl-overview)
