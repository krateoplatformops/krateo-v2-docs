---
description: Learn about Krateo PlatformOps by progressing a change through multiple stages in a Kubernetes cluster
sidebar_label: Quickstart
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Krateo PlatformOps Quickstart

This guide presents a basic introduction to Krateo PlatformOps. Together, we will:

* Install `krateoctl`
* Install Krateo PlatformOps 3.0.0-rc1 into a local cluster
* Deploy the `github-scaffolding-with-composition-page` Blueprint
* Deploy a Composition leveraging the `github-scaffolding-with-composition-page` Blueprint
* Destroy the cluster

## Requirements

The `github-scaffolding-with-composition-page` Blueprint will create a new public GitHub repository in your organization. Fill the form according to the organization name.

Install `krateoctl` with:

<Tabs groupId="operating-systems">
  <TabItem value="macos" label="macOS">

Install `krateoctl` via Homebrew:
```sh
brew tap krateoplatformops/krateoctl
brew install krateoctl
```

Or use the automatic install script:
```sh
curl -sL https://raw.githubusercontent.com/krateoplatformops/krateoctl/main/install.sh | bash
```

  </TabItem>
  <TabItem value="linux" label="Linux">

Run the automatic install script in your terminal:
```sh
curl -sL https://raw.githubusercontent.com/krateoplatformops/krateoctl/main/install.sh | bash
```

The script will:

<ul>
  <li>Detect your architecture</li>
  <li>Download the latest release binary</li>
  <li>Install it to <code>/usr/local/bin</code> (requires sudo), or fall back to <code>$HOME/.local/bin</code></li>
  <li>Ensure the install directory is in your <code>PATH</code></li>
</ul>

  </TabItem>
  <TabItem value="windows" label="Windows">

Manual installation steps:

<ol>
  <li>Go to the <a href="https://github.com/krateoplatformops/krateoctl/releases">Releases page</a>.</li>
  <li>Download the archive for your architecture (e.g. <code>windows_amd64.zip</code>).</li>
  <li>Extract the binary from the archive.</li>
  <li>Add the folder containing the binary to your system <code>PATH</code>.</li>
</ol>

  </TabItem>
</Tabs>

## Deploy Krateo PlatformOps on a local cluster (kind)

Any of the following approaches require [Helm](https://helm.sh/docs/) v3.13.1 or
greater to be installed.

You can check whether you have Helm installed and its version with the following command:
```sh
helm version
```

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

If you have any Docker-compatible container runtime installed (including native
Docker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster
just for this quickstart using
[kind](https://kind.sigs.k8s.io/#installation-and-usage) (Kubernetes IN Docker).

```shell
curl -L https://raw.githubusercontent.com/krateoplatformops/krateo-v2-docs/refs/heads/main/scripts/kind.sh | sh
```

:::info
While this option is a bit more complex than using Docker Desktop or OrbStack
directly, it offers the advantage of being fully-disposable. If your K8s cluster
reaches a state you are dissatisfied with, you can simply destroy it and
launch a new one.
:::

The script above will:
- Create a new kind cluster named `krateo-quickstart`
- Install Krateo using the `krateoctl install` command

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

Let's click on the *krateo-demo* composition panel and check each of the tabs:

### Events

![Composition-Events](/img/quickstart/09_compositions_1composition_events.png)

### Composition Status

![Composition-CompositionStatus](/img/quickstart/10_compositions_1composition_status.png)

### Values

![Composition-Values](/img/quickstart/11_compositions_1composition_values.png)

At this point, the Composition is correctly deployed.

## Destroy the cluster

Simply destroy the cluster:

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

```shell
kind delete cluster --name krateo-quickstart
```

</TabItem>
</Tabs>
