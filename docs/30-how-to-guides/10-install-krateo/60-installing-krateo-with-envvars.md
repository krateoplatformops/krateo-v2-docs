---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps with environment variables
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps with enviroment variables

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

Krateo PlatformOps is exposed via NodePort by default. In order to customize enviroment variables, you can proceed in the following way:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo
helm inspect values krateo/installer --version 2.4.0 > ~/krateo-values.yaml
```

Modify the *krateo-values.yaml* file as the following example:

```yaml
krateoplatformops:
  frontend:
    env:
      http_proxy: http://127.0.0.1:3128
  bff:
    env:
      http_proxy: http://127.0.0.1:3128
  authn:
    env:
      http_proxy: http://127.0.0.1:3128
  backend:
    env:
      http_proxy: http://127.0.0.1:3128
    etcd:
      env:
        http_proxy: http://127.0.0.1:3128
  coreprovider:
    env:
      http_proxy: http://127.0.0.1:3128
  patchprovider:
    env:
      http_proxy: http://127.0.0.1:3128
  eventrouter:
    env:
      http_proxy: http://127.0.0.1:3128
  eventsse:
    env:
      http_proxy: http://127.0.0.1:3128
    etcd:
      env:
        http_proxy: http://127.0.0.1:3128
resourcetreehandler:
    env:
      http_proxy: http://127.0.0.1:3128
```

Install Krateo PlatformOps:

```shell
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  -f ~/krateo-values.yaml
  --install \
  --version 2.4.0 \
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

Krateo PlatformOps can be isolated via vCluster:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo
helm inspect values krateo/installer --version 2.4.0 > ~/krateo-values.yaml
```

Modify the *krateo-values.yaml* file as the following example:

```yaml
krateoplatformops:
  vcluster:
    enabled: true
    env:
    - name: http_proxy
      value: http://127.0.0.1:3128
  frontend:
    env:
      http_proxy: http://127.0.0.1:3128
  bff:
    env:
      http_proxy: http://127.0.0.1:3128
  authn:
    env:
      http_proxy: http://127.0.0.1:3128
  backend:
    env:
      http_proxy: http://127.0.0.1:3128
    etcd:
      env:
        http_proxy: http://127.0.0.1:3128
  coreprovider:
    env:
      http_proxy: http://127.0.0.1:3128
  patchprovider:
    env:
      http_proxy: http://127.0.0.1:3128
  eventrouter:
    env:
      http_proxy: http://127.0.0.1:3128
  eventsse:
    env:
      http_proxy: http://127.0.0.1:3128
  resourcetreehandler:
    env:
      http_proxy: http://127.0.0.1:3128
```


Install Krateo PlatformOps:

```shell
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  -f ~/krateo-values.yaml
  --install \
  --version 2.4.0 \
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
