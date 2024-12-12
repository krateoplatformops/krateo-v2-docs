---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps on OpenShift
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps on OpenShift

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps [installer](https://github.com/krateoplatformops/installer-chart) is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer. Please check all the possible values supported by the chart.
:::

<Tabs groupId="kubernetes-version">
<TabItem value=">1.27" label=">1.27">

Krateo PlatformOps is exposed via NodePort by default:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.backend.etcd.openshift.enable=force \
  --install \
  --version 2.3.0 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* The *Krateo Composable Portal* will be accessible at port 30080.
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
<TabItem value="<=1.27" label="<=1.27">

You will need:

* [vCluster CLI](https://www.vcluster.com/docs/v0.19/getting-started/setup) in order to retrieve resources from the vCluster.

Krateo PlatformOps can be isolated via vCluster:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.vcluster.enabled=true \
  --set krateoplatformops.vcluster.openshift.enable=force \
  --install \
  --version 2.3.0 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops vcluster --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* The *Krateo Composable Portal* will be accessible at port 30080.
* The *admin* user password can be retrieved with the following command:
```shell
vcluster connect vcluster-k8s -- kubectl get secret admin-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```
</TabItem>
</Tabs>

:::info
The installer by default deploys a composable-portal-basic with examples to immediately start to play with Krateo PlatformOps. The chart is available here: https://github.com/krateoplatformops/composable-portal-basic.
:::
