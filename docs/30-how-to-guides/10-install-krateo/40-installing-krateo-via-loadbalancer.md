---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps and expose it via LoadBalancer
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps and expose it via LoadBalancer

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps [installer](https://github.com/krateoplatformops/installer-chart) is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer. Please check all the possible values supported by the chart.
:::

<Tabs groupId="cluster-start">
<TabItem value="loadbalancer-ip" label="LoadBalancer with external IP">

<Tabs groupId="kubernetes-version">
<TabItem value=">1.27" label=">1.27">

Krateo PlatformOps can be exposed via LoadBalancer service type that exposes an IP.

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.3.1 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
<TabItem value="<=1.27" label="<=1.27">

Krateo PlatformOps can be exposed via LoadBalancer service type that exposes an IP.

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.vcluster.enabled=true \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.3.1 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops vcluster --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.
* The *admin* user password can be retrieved with the following command:
```shell
vcluster connect vcluster-k8s -- kubectl get secret admin-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
</Tabs>
</TabItem>
<TabItem value="loadbalancer-hostname" label="LoadBalancer with external hostname">

<Tabs groupId="kubernetes-version">

<TabItem value=">1.27" label=">1.27">

Krateo PlatformOps can be exposed via LoadBalancer service type that exposes a hostname.

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=false \
  --install \
  --version 2.3.1 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops vcluster --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* Find the Krateo Composable Portal hostname:

```shell
kubectl get svc krateo-frontend -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

* The Krateo Composable Portal will be accessible at previous hostname at port 8080.
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
<TabItem value="<=1.27" label="<=1.27">

Krateo PlatformOps can be exposed via LoadBalancer service type that exposes a hostname.

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.vcluster.enabled=true \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=false \
  --install \
  --version 2.3.1 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops vcluster --for condition=Ready=True --namespace krateo-system --timeout=300s
```

At the end of this process:

* Find the Krateo Composable Portal hostname:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.
* The *admin* user password can be retrieved with the following command:
```shell
vcluster connect vcluster-k8s -- kubectl get secret admin-password -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
</Tabs>
</TabItem>
</Tabs>

:::info
The installer by default deploys a composable-portal-basic with examples to immediately start to play with Krateo PlatformOps. The chart is available here: https://github.com/krateoplatformops/composable-portal-basic.
:::
