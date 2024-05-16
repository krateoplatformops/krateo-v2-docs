---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps
---

# Installing Krateo PlatformOps

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps installer is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer.
:::

<Tabs groupId="local-cluster-start">
<TabItem value="kind" label="kind">

If you have any Docker-compatible container runtime installed (including native
Docker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster
just for this quickstart using
[kind](https://kind.sigs.k8s.io/#installation-and-usage).

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

kind create cluster \
  --wait 120s \
  --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: krateo-quickstart
nodes:
- role: control-plane
- role: worker
  extraPortMappings:
  - containerPort: 30080 # Krateo Portal
    hostPort: 30080
  - containerPort: 30081 # Krateo BFF
    hostPort: 30081
  - containerPort: 30082 # Krateo AuthN Service
    hostPort: 30082
  - containerPort: 30443 # Krateo Gateway
    hostPort: 30443
  - containerPort: 31180 # Krateo FireworksApp Frontend
    hostPort: 31180
  - containerPort: 31443 # vCluster API Server Port
    hostPort: 31443
networking:
  # By default the API server listens on a random open port.
  # You may choose a specific port but probably don't need to in most cases.
  # Using a random port makes it easier to spin up multiple clusters.
  apiServerPort: 6443
EOF

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --wait
```

:::info
While this option is a bit more complex than using Docker Desktop or OrbStack
directly, it offers the advantage of being fully-disposable. If your cluster
reaches a state you are dissatisfied with, you can simply destroy it and
launch a new one.
:::

At the end of this process:

* The Krateo Composable Portal will be accessible at [localhost:30080](http://localhost:30080).

</TabItem>
<TabItem value="loadbalancer-ip" label="LoadBalancer with external IP">

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
  --wait
```

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - Krateo BFF
* 8082 - Krateo AuthN Service
* 8443 - Krateo Gateway
* 443 - vCluster API Server Port
:::

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.

</TabItem>
<TabItem value="loadbalancer-hostname" label="LoadBalancer with external hostname">

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
  --wait
```

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - Krateo BFF
* 8082 - Krateo AuthN Service
* 8443 - Krateo Gateway
* 443 - vCluster API Server Port
:::

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.

</TabItem>
</Tabs>

:::info
Krateo PlatformOps requires access to Kubernetes CertificateAuthority certificate and key in order to generate certificates for logged users.
For this reason we provide with the installer the default installation of vCluster (https://github.com/loft-sh/vcluster) in order to provide a sandboxed installation of Krateo PlatformOps.
:::

:::info
The installer by default deploys a starter-pack with example to immediately start to play with Krateo PlatformOps. The starter-pack is available here: https://github.com/krateoplatformops/installer-starter-pack.
:::

Wait until Krateo frontend is running:

```shell
kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system

kubectl wait krateoplatformops vcluster --for condition=Ready=True --timeout=300s --namespace krateo-system

kubectl wait deployment vcluster-k8s --for condition=Available=True --timeout=300s --namespace krateo-system

curl -L -o vcluster "https://github.com/loft-sh/vcluster/releases/latest/download/vcluster-linux-amd64" && chmod +x vcluster
./vcluster connect vcluster-k8s

kubectl wait krateoplatformops krateo --for condition=Ready=True --timeout=300s --namespace krateo-system
```

## Advanced Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs groupId="advanced-installation">
<TabItem value="disable" label="Disable starter-pack">

If you're not interested in the Krateo PlatformOps starter-pack, you can disable this option and you'll get a deployment without examples.

```shell
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.init.enabled=false \
  --install \
  --wait
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
   helm upgrade installer installer \
     --repo https://charts.krateo.io \
     --namespace krateo-system \
     --create-namespace \
     --values krateo-values.yaml \
     --install \
     --wait
   ```

</TabItem>
</Tabs>

Wait until Krateo frontend is running:

```shell
kubectl wait --for=condition=Ready $(kubectl get pods --field-selector=status.phase!=Succeeded,status.phase!=Failed --output=name -n krateo-system | grep '^pod/krateo-frontend') -n krateo-system

kubectl wait krateoplatformops vcluster --for condition=Ready=True --timeout=300s --namespace krateo-system

kubectl wait deployment vcluster-k8s --for condition=Available=True --timeout=300s --namespace krateo-system

curl -L -o vcluster "https://github.com/loft-sh/vcluster/releases/latest/download/vcluster-linux-amd64" && chmod +x vcluster
./vcluster connect vcluster-k8s

kubectl wait krateoplatformops krateo --for condition=Ready=True --timeout=300s --namespace krateo-system
```
