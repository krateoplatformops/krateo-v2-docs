---
description: Krateo Autopilot
sidebar_label: Krateo Autopilot
---

# Krateo Autopilot

:::info Accessing Krateo Autopilot
Krateo Autopilot is available exclusively to users with an active Krateo license.
:::

Krateo Autopilot is an AI agent designed to assist platform engineers and users in interacting with the Krateo PlatformOps ecosystem.

## What Autopilot can do

Think of Autopilot as an intelligent assistant that helps you navigate, manage, and configure the platform. Its primary roles include:

1. **Resource Management**: Helping you create and manage Krateo specific resources like RESTActions, blueprints and compositions.
2. **Portal Configuration:** Assisting in the creation of UI widgets and dashboard layouts for the Krateo Portal.
3. **Documentation Support:** Answering questions about Krateo’s architecture, components and general concepts. 

## The Declarative Advantage

In Krateo, every resource, whether it's an infrastructure component, a UI widget, or a RESTAction, can be defined declaratively through YAML. This design choice greatly boosts the effectiveness and scope of Krateo Autopilot. This is because AI agents are particularly effective at processing and generating structured data.

By leveraging this synergy Krateo Autopilot is able to reliably translate high-level natural language requests into effective YAML manifests. 

## How It Works

Krateo Autopilot is a multi-agent system comprised of several small specialized agents and an orchestrator that acts as a coordinator, routing requests to the right agent. Specifically, Krateo Autopilot defines the following sub agents:

- **Auth Agent**: Handles everything related to authentication, user accounts, login processes, and user-specific secrets or resources.
- **Blueprint Agent**: Manages the core Krateo resources like Blueprints, CompositionDefinitions, and Compositions.
- **Documentation Agent**: Provides general information on Krateo concepts, architecture, and high-level features.
- **Portal Agent**: Dedicated to the Krateo UI. It manages portal sections, layouts, and all types of widgets (charts, forms, tables, etc.).
- **RESTAction Agent**: Specifically handles the creation and management of RESTActions within the Krateo framework.

## Example Prompts

<details>
<summary> Learning about Krateo</summary>

**Prompt**
> _What is the role of the Krateo core-provider in simple terms?_

**Response**
The Krateo Core Provider is the central component of the Krateo PlatformOps architecture.
Its primary role is to act as the engine that dynamically extends the Kubernetes API based
on your Helm charts (Blueprints), bridging the gap between standard Helm deployments and
declarative Kubernetes Custom Resources.

</details>



<details>
<summary> Generating portal resources</summary>

**Prompt**
> _Create a portal section that keeps track of the status of the compositions in my cluster_

**Response**
Here is the complete, consolidated YAML containing all the resources required for your new "Compositions" portal section.

This includes the UI widgets (Navigation Menu Item, Page, and Table) designed by the portal agent, and an optimized RESTAction to fetch the compositions across the entire cluster.

```yaml
# 1. Navigation Menu Item
# Adds "Compositions" to the left-hand sidebar menu
apiVersion: widgets.templates.krateo.io/v1beta1
kind: NavMenuItem
metadata:
  name: nav-compositions
  namespace: krateo-system
spec:
  widgetData:
    allowedResources:
      - pages
    resourceRefId: page-compositions
    label: Compositions
    icon: fa-cubes
    path: /compositions
    order: 10
  resourcesRefs:
    items:
      - id: page-compositions
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: page-compositions
        namespace: krateo-system
        resource: pages
        verb: GET

---
# 2. Page Wrapper
# The main container that renders when you visit /compositions
apiVersion: widgets.templates.krateo.io/v1beta1
kind: Page
metadata:
  name: page-compositions
  namespace: krateo-system
spec:
  widgetData:
    allowedResources:
      - tables
    items:
      - resourceRefId: table-compositions
  resourcesRefs:
    items:
      - id: table-compositions
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: table-compositions
        namespace: krateo-system
        resource: tables
        verb: GET

---
# 3. Table Widget
# Displays the structured data with Name, Namespace, and Status columns
apiVersion: widgets.templates.krateo.io/v1beta1
kind: Table
metadata:
  name: table-compositions
  namespace: krateo-system
spec:
  apiRef:
    name: get-compositions-action
    namespace: krateo-system
  widgetData:
    allowedResources:
      - buttons
    pageSize: 10
    data: []
    columns:
      - valueKey: name
        title: Name
      - valueKey: namespace
        title: Namespace
      - valueKey: status
        title: Status
  widgetDataTemplate:
    - forPath: data
      expression: ${ .items }

---
# 4. RESTAction API Call
# Calls the internal presenter endpoint to fetch all compositions in the cluster 
# and formats the response for the Table widget
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: get-compositions-action
  namespace: krateo-system
spec:
  api:
    - name: comps
      endpointRef:
        name: resources-presenter-endpoint
        namespace: krateo-system
      path: "/resources?group=composition.krateo.io&limit=5000&namespace=*&raw=true"
      verb: GET
      exportJwt: true
      continueOnError: true
  filter: >
    { 
      "items": .comps.items | map([
        {"valueKey": "name", "kind": "jsonSchemaType", "type": "string", "stringValue": .name},
        {"valueKey": "namespace", "kind": "jsonSchemaType", "type": "string", "stringValue": .namespace},
        {"valueKey": "status", "kind": "jsonSchemaType", "type": "string", "stringValue": ((.raw.status.conditions[-1].type // .raw.status.phase // "Unknown") | tostring)}
      ]) 
    }
```
</details>


<details>
<summary> Troubleshooting issues</summary>

**Prompt**
> _Why is my `compositiondefinition` not getting ready?_

```yaml
status:
  conditions:
  - lastTransitionTime: "2026-04-13T09:55:55Z"
    message: 'observe failed: error getting spec schema: open my-blueprint/values.schema.json:
      file does not exist'
    reason: ReconcileError
    status: "False"
    type: Synced
  managed: {}
```

**Response**
The reason your `CompositionDefinition` is not getting ready is because Krateo requires a `values.schema.json` file at the root of your Helm chart, and it is currently missing in your chart.

**Why does Krateo need this?**

Krateo uses the `values.schema.json` file to dynamically generate the Custom Resource Definition (CRD) OpenAPI v3 schema for your composition. This ensures that any Composition resource created from this blueprint is properly validated by the Kubernetes API before being accepted.

**How to fix it**

You need to add a `values.schema.json` file alongside your `Chart.yaml` and `values.yaml` inside your chart directory:

```
my-blueprint/
├── Chart.yaml
├── values.schema.json   <-- Add this file!
├── values.yaml
└── templates/
```

</details>

## Best Practices

- Krateo Autopilot can make mistakes. It is recommended review generated YAML manifests before applying them.
- Context is everything: the more specific and detailed your query is, the better the output.