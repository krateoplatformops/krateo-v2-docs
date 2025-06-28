---
description: Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster
sidebar_label: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Krateo PlatformOps Quickstart

This guide presents a basic introduction to Krateo PlatformOps. Together, we will:

* Install Krateo PlatformOps into a local cluster.
* Deploy the FireworksApp Template
* Deploy a Composition leveraging the FireworksApp Template
* Destroy the cluster

## Requirements

The FireworksApp Template will create a new public GitHub repository in your organization. Fill the form according to the organization name.

## Deploy Krateo PlatformOps on a local cluster (kind)

Any of the following approaches require [Helm](https://helm.sh/docs/) v3.13.1 or
greater to be installed.

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

If you have any Docker-compatible container runtime installed (including native
Docker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster
just for this quickstart using
[kind](https://kind.sigs.k8s.io/#installation-and-usage).

```shell
curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh
```

:::info
While this option is a bit more complex than using Docker Desktop or OrbStack
directly, it offers the advantage of being fully-disposable. If your cluster
reaches a state you are dissatisfied with, you can simply destroy it and
launch a new one.
:::

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=500s
```

At the end of this process:

* The *Krateo Composable Portal* will be accessible at [localhost:30080](http://localhost:30080).
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```
</TabItem>
</Tabs>

Login into the Krateo Composable Portal: [http://localhost:30080/](http://localhost:30080/)

![Login](/img/quickstart/01_login.png)

Navigate the dashboard:

![Dashboard_NoTemplates](/img/quickstart/02_dashboard_notemplates.png)

## Deploy the FireworksApp Template

We will leverage the [FireworksApp template](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp).
Follow the [README](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/README.md#setup-toolchain-on-krateo-system-namespace-1) instructions to deploy the template leveraging [Krateo Composable Portal](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/README.md#form-not-ordered-in-alphabetical-order).

Navigate again the dashboard and observe how the state changes while *CompositionDefinition* becomes *Ready:True*.

![Dashboard_1Template_Unknown](/img/quickstart/03_dashboard_1template_unknown.png)

Wait for the *CompositionDefinition* to become *Ready:False*:

```shell
kubectl wait compositiondefinition fireworksapp --for condition=Ready=False --namespace fireworksapp-system --timeout=300s
```

![Dashboard_1Template_ReadyFalse](/img/quickstart/04_dashboard_1template_readyfalse.png)

Wait for the *CompositionDefinition* to become *Ready:True*:
```shell
kubectl wait compositiondefinition fireworksapp --for condition=Ready=True --namespace fireworksapp-system --timeout=300s
```

![Dashboard_1Template_ReadyTrue](/img/quickstart/07_dashboard_1template_readytrue.png)

Check the *Templates* section in the Portal:

![Templates](/img/quickstart/06_templates_1template_readytrue.png)

## Deploy a Composition leveraging the FireworksApp Template

Click on the *FireworksApp* card, a form will appear on the right:

![Form](/img/quickstart/08_templates_1template_form.png)

Fill the form fields in the following way:

| Key  | Value |
| ------------- | ------------- |
| git.toRepo.name  | krateo-demo  |
| git.toRepo.org | *your github organization* |

A new Composition is now available and an automatic redirect is done:

![Composition_Overview_NotFilled](/img/quickstart/09_composition_overview_notfilled.png)

Let's move back to the Composition menu:

![Compositions](/img/quickstart/12_compositions.png)

Let's click on the *krateo-demo* composition panel.

### Overview

![Composition-Overview](/img/quickstart/13_composition_overview_filled.png)

### Composition Status

![Composition-CompositionStatus](/img/quickstart/14_composition_status.png)

### Application Status

![Composition-ApplicationStatus](/img/quickstart/15_composition_application.png)

### Events

![Composition-Events](/img/quickstart/10_composition_events.png)

### Values

![Composition-Values](/img/quickstart/11_composition_values.png)

## Destroy the cluster

Simply destroy the cluster:

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

```shell
kind delete cluster --name krateo-quickstart
```

</TabItem>
</Tabs>
