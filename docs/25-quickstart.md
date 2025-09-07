---
description: Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster
sidebar_label: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Krateo PlatformOps Quickstart

This guide presents a basic introduction to Krateo PlatformOps. Together, we will:

* Install Krateo PlatformOps 2.5.1 into a local cluster.
* Deploy the `github-scaffolding-with-composition-page` Blueprint
* Deploy a Composition leveraging the `github-scaffolding-with-composition-page` Blueprint
* Destroy the cluster

## Requirements

The `github-scaffolding-with-composition-page` Blueprint will create a new public GitHub repository in your organization. Fill the form according to the organization name.

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

![Dashboard_NoBlueprints](/img/quickstart/02_dashboard_noblueprints.png)

## Deploy the `github-scaffolding-with-composition-page` Blueprint

We will leverage the [github-scaffolding-with-composition-page blueprint](https://github.com/krateoplatformops-blueprints/github-scaffolding-with-composition-page).
Follow the [README](https://github.com/krateoplatformops-blueprints/github-scaffolding-with-composition-page/blob/main/README.md) instructions to deploy the blueprint leveraging Krateo Composable Portal.

Navigate again the dashboard and observe how the state changes while *CompositionDefinition* becomes *Ready:True*.

![Dashboard_1Blueprint_ReadyFalse](/img/quickstart/03_dashboard_1blueprint_false.png)

![Dashboard_1Blueprint_ReadyTrue](/img/quickstart/04_dashboard_1blueprint_true.png)

![Dashboard_2Blueprint_ReadyFalse](/img/quickstart/05_dashboard_2blueprint_false.png)

![Dashboard_2Blueprint_ReadyTrue](/img/quickstart/06_dashboard_2blueprint_true.png)

Check the *Blueprints* section in the Portal:

![Blueprints](/img/quickstart/07_blueprints_1blueprint_true.png)

## Deploy a Composition leveraging the `github-scaffolding-with-composition-page` Blueprint

Click on the *GItHub Scaffolding with Composition Page* card, a form will appear on the right:

![Form](/img/quickstart/08_blueprints_1blueprint_form.png)

Fill the form fields in the following way:

| Key  | Value |
| ------------- | ------------- |
| git.toRepo.name  | krateo-demo  |
| git.toRepo.org | *your github organization* |

A new Composition is now available and an automatic redirect is done:

![Composition_Overview_NotFilled](/img/quickstart/09_compositions_1composition_events.png)

Let's move back to the `Compositions` menu:

![Compositions](/img/quickstart/12_compositions_1composition_true.png)

Let's click on the *krateo-demo* composition panel.

### Events

![Composition-Events](/img/quickstart/09_compositions_1composition_events.png)

### Composition Status

![Composition-CompositionStatus](/img/quickstart/10_composition_1composition_status.png)

### Values

![Composition-Values](/img/quickstart/11_composition_1composition_values.png)

## Destroy the cluster

Simply destroy the cluster:

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

```shell
kind delete cluster --name krateo-quickstart
```

</TabItem>
</Tabs>
