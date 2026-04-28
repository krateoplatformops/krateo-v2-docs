# Architecture and Concepts

This document explains the foundational concepts behind the Krateo Core Provider. Read this before consulting the how-to guides.

---

## Glossary

- **CRD (Custom Resource Definition):** A Kubernetes resource that defines custom objects and their schemas, enabling users to extend the Kubernetes API.
- **CompositionDefinition:** A declarative Krateo resource that acts as a master blueprint for a deployable service. It consumes a Helm chart and uses it to dynamically generate a versioned CRD.
- **Composition:** A Custom Resource representing a single live instance of a service defined by a CompositionDefinition.
- **CDC (Composition Dynamic Controller):** A dedicated controller deployed by the Core Provider for each CompositionDefinition. It manages the full lifecycle of Helm releases based on [Composition resources](20-cdc/10-overview.md).
- **Chart Inspector:** A service that introspects Helm chart content to provide the CDC with resource metadata for RBAC generation.
- **OCI Registry:** A container registry used for storing and distributing Helm charts.
- **values.schema.json:** A JSON Schema file included in Helm charts to define and validate the structure of `values.yaml`.

---

## Architecture

![core-provider Architecture](/img/kco/core-provider-architecture.png "core-provider Architecture")

The Core Provider orchestrates three main actors:

- **Core Provider**: Watches `CompositionDefinition` resources. For each one, it generates a CRD and deploys a CDC.
- **CDC (Composition Dynamic Controller)**: Watches `Composition` resources of a specific version and manages Helm releases.
- **Chart Inspector**: Provides the CDC with the list of resources it manages, enabling precise RBAC generation.

For a detailed look at the security model, see [Security Design](10-core-provider/30-security-design.md).

---

## Lifecycle Workflow

![core-provider State Diagram](/img/kco/core-provider-flow.png "core-provider State Diagram")

The lifecycle of a Krateo service follows these stages:
1.  **Registration**: A `CompositionDefinition` is applied to the cluster.
2.  **Generation**: The Core Provider generates the CRD and spawns the CDC.
3.  **Instantiation**: A user creates a `Composition` resource.
4.  **Enforcement**: The CDC installs the Helm chart and continuously reconciles the state.
5.  **Evolution**: The service is upgraded following one of the [Version Management patterns](10-core-provider/20-version-management.md).

---

## Chart Requirements

To be compatible with Krateo, a Helm chart must include a `values.schema.json` file. This file is used to:
1.  Generate the OpenAPI schema for the `Composition` CRD.
2.  Validate user input during `kubectl apply`.
3.  Provide metadata for UI generation in the Krateo Control Plane.
