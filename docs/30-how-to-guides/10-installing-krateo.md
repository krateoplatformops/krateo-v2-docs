---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps
---

# Installing Krateo PlatformOps

## Basic Installation

Installing Kargo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps installer is a flexible workflow engine that execute sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer.
:::

The following command will install Kargo with default configuration and a
user-specified admin password:

```shell
helm install installer krateo/installer --create-namespace -n krateo-system --wait
```
:::caution
Default values deploy Krateo exposing services via NodePort:
* 30080 - Krateo Frontend
* 30081 - Krateo BFF
* 30082 - Krateo AuthN Service
* 30443 - Krateo Gateway
* 31443 - vCluster API Server Port
:::

:::caution
Krateo PlatformOps requires access to Kubernetes CertificateAuthority certificate and key in order to generate certificates for logged users.
For this reason we provide with the installer the default installation of vCluster (https://github.com/loft-sh/vcluster) in order to provide a sanboxed installation of Krateo PlatformOps.
:::

:::caution
The installer by default deploys a starter-pack with example to immediatly start to play with Krateo PlatformOps. The starter-pack is available here: https://github.com/krateoplatformops/installer-starter-pack.
:::

Wait until Krateo frontend is running:

```shell
kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system
```

## Advanced Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="LoadBalancer with external IP">

Krateo PlatformOps can be exposed via LoadBalancer service type.

```shell
helm install installer krateo/installer --create-namespace -n krateo-system --set krateoplatformops.service.service=LoadBalancer --wait
```

</TabItem>
<TabItem value="kind" label="Disable starter-pack">

If you're not interested in the Krateo PlatformOps starter-pack, you can disable this option and you'll get a deployment without examples.

```shell
helm install installer krateo/installer --create-namespace -n krateo-system --set krateoplatformops.init.service=LoadBalancer --wait
```

</TabItem>
<TabItem value="custom" label="Custom">

Krateo PlatformOps installer can be configured with a custom workflow. You can find two examples: https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/krateo-installer.yaml and https://github.com/krateoplatformops/installer-chart/blob/main/chart/templates/vcluster-installer.yaml.

1. Extract the default values from the Helm chart and save it to a convenient
   location. In the example below, we save it to `~/krateo-values.yaml`

   ```shell
   helm inspect values krateo/installer > krateo-values.yaml
   ```

1. Edit the values.

  ```shell
  krateoplatformops:
    custom:
      enabled: true
      values:
      apiVersion: krateo.io/v1alpha1
        kind: KrateoPlatformOps
        metadata:
        annotations:
          "krateo.io/connector-verbose": "true"
        name: krateo
        namespace: krateo-system
        spec:
        steps:
          - id: extract-vcluster-addr
            type: var
            with:
              name: KUBECONFIG_SERVER_URL
              valueFrom:
                apiVersion: v1
                kind: ConfigMap
                metadata:
                  name: vcluster-k8s-cm
                selector: .data.KUBECONFIG_SERVER_URL
  ```

1. Proceed with installation, using your modified values:

   ```shell
   helm install installer krateo/installer --create-namespace -n krateo-system  --values krateo-values.yaml --wait
   ```

</TabItem>
</Tabs>

Wait until Krateo frontend is running:

```shell
kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system
```
