---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps installer is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer.
:::

<Tabs groupId="cluster-start">
<TabItem value="kind" label="kind">

If you have any Docker-compatible container runtime installed (including native
Docker, Docker Desktop, or OrbStack), you can easily launch a disposable cluster
just for this quickstart using
[kind](https://kind.sigs.k8s.io/#installation-and-usage).

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo

kind create cluster --wait 120s --image kindest/node:v1.30.4 --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: krateo-quickstart
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
  extraPortMappings:
  - containerPort: 30080 # Krateo Portal
    hostPort: 30080
  - containerPort: 30081 # Krateo BFF
    hostPort: 30081
  - containerPort: 30082 # Krateo AuthN Service
    hostPort: 30082
  - containerPort: 30083 # Krateo EventSSE
    hostPort: 30083
  - containerPort: 30084 # Krateo Terminal Server
    hostPort: 30084
  - containerPort: 30085 # Krateo Resource Tree Handler
    hostPort: 30085
  - containerPort: 30086 # Krateo FireworksApp Frontend
    hostPort: 30086
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
  --version 2.2.0 \
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
<TabItem value="OpenShift" label="OpenShift">

Krateo PlatformOps can be exposed via NodePort:

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
  --version 2.2.0 \
  --wait
```

</TabItem>
<TabItem value="loadbalancer-ip" label="LoadBalancer with external IP">

<Tabs groupId="kubernetes-version">
<TabItem value=">1.28" label=">1.28">

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
  --version 2.2.0 \
  --wait
```

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - BFF
* 8082 - AuthN
:::

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.

</TabItem>
<TabItem value="<=1.28" label="<=1.28">

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
  --version 2.2.0 \
  --wait
```
The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - BFF
* 8082 - AuthN
:::

At the end of this process:

* Find the Krateo Composable Portal IP:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].ip}'
```

* The Krateo Composable Portal will be accessible at previous IP at port 8080.

</TabItem>
</Tabs>


</TabItem>
<TabItem value="loadbalancer-hostname" label="LoadBalancer with external hostname">

<Tabs groupId="kubernetes-version">
<TabItem value="EKS" label="EKS">

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
  --set krateoplatformops.service.annotations."service.beta.kubernetes.io/aws-load-balancer-type"="nlb" \
  --set krateoplatformops.service.annotations."service.beta.kubernetes.io/aws-load-balancer-internal"=false \
  --install \
  --version 2.2.0 \
  --wait
```

:::info
*service.beta.kubernetes.io/aws-load-balancer-type*: Use "nlb" for Network Load Balancer or "clb" for Classic Load Balancer
*service.beta.kubernetes.io/aws-load-balancer-internal*: Set to "true" if you want an internal load balancer
:::

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - BFF
* 8082 - AuthN
:::

At the end of this process:

* Find the Krateo Composable Portal hostname:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

</TabItem>
<TabItem value=">1.28" label=">1.28">

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
  --version 2.2.0 \
  --wait
```

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - BFF
* 8082 - AuthN
:::

At the end of this process:

* Find the Krateo Composable Portal hostname:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

* The Krateo Composable Portal will be accessible at previous hostname at port 8080.


</TabItem>
<TabItem value="<=1.28" label="<=1.28">

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
  --version 2.2.0 \
  --wait
```

The following command will install Krateo with default configuration and a user-specified admin password:

:::info
Default values deploy Krateo exposing services via LoadBalancer:
* 8080 - Krateo Frontend
* 8081 - BFF
* 8082 - AuthN
:::

At the end of this process:

* Find the Krateo Composable Portal hostname:

```shell
kubectl get svc krateo-frontend-x-krateo-system-x-vcluster-k8s -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

* The Krateo Composable Portal will be accessible at previous hostname at port 8080.

</TabItem>
</Tabs>

</TabItem>
</Tabs>

:::info
Krateo PlatformOps requires access to Kubernetes CertificateAuthority certificate and key in order to generate certificates for logged users.
For this reason we provide with the installer the option to leverage vCluster (https://github.com/loft-sh/vcluster) in order to provide a sandboxed installation of Krateo PlatformOps. This is mandatory in Elastic Kubernetes Service (EKS) where this feature is disabled by design.
:::

:::info
The installer by default deploys a composable-portal-basic with examples to immediately start to play with Krateo PlatformOps. The chart is available here: https://github.com/krateoplatformops/composable-portal-basic.
:::
