---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps using security context
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps using security context

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.19.4.
* A Kubernetes cluster.

:::note
Krateo PlatformOps [installer](https://github.com/krateoplatformops/installer-chart) is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer. Please check all the possible values supported by the chart.
:::

<Tabs groupId="kubernetes-version">
<TabItem value="securitycontext" label="securitycontext">

Krateo PlatformOps is exposed via NodePort by default. In order to customize security contexts, you can proceed in the following way:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo
helm inspect values krateo/installer --version 2.7.0 > ~/krateo-values.yaml
```

Modify the *krateo-values.yaml* file as the following example:

```yaml
krateoplatformops:
  authn:
    podSecurityContext:
      appArmorProfile:
        localhostProfile: "example-profile"
        type: "RuntimeDefault" # Options: Localhost, RuntimeDefault, Unconfined
      fsGroup: 1000
      fsGroupChangePolicy: "OnRootMismatch" # Options: Always, OnRootMismatch
      runAsGroup: 3000
      runAsNonRoot: true
      runAsUser: 1000
      seLinuxOptions:
        level: "s0:c123,c456"
        role: "system_r"
        type: "spc_t"
        user: "system_u"
      seccompProfile:
        localhostProfile: "example-seccomp-profile"
        type: "RuntimeDefault" # Options: Localhost, RuntimeDefault, Unconfined
      supplementalGroups:
        - 2000
        - 3000
      supplementalGroupsPolicy: Strict
      sysctls:
        - name: "net.ipv4.tcp_syncookies"
          value: "1"
        - name: "fs.file-max"
          value: "50000"
      windowsOptions:
        gmsaCredentialSpec: '{"example-spec-json": "content"}'
        gmsaCredentialSpecName: "example-gmsa-name"
        hostProcess: false
        runAsUserName: "Administrator"
    securityContext:
      allowPrivilegeEscalation: false
      appArmorProfile:
        localhostProfile: "custom-apparmor-profile"
        type: "RuntimeDefault" # Options: Localhost, RuntimeDefault, Unconfined
      capabilities:
        add:
          - "NET_ADMIN"
          - "SYS_TIME"
        drop:
          - "ALL"
      privileged: false
      procMount: "Default" # Options: Default, Unmasked
      readOnlyRootFilesystem: true
      runAsGroup: 2000
      runAsNonRoot: true
      runAsUser: 1001
      seLinuxOptions:
        level: "s0:c123,c456"
        role: "system_r"
        type: "spc_t"
        user: "system_u"
      seccompProfile:
        localhostProfile: "custom-seccomp-profile"
        type: "RuntimeDefault" # Options: Localhost, RuntimeDefault, Unconfined
      windowsOptions:
        gmsaCredentialSpec: '{"example-spec-json": "content"}'
        gmsaCredentialSpecName: "example-gmsa-name"
        hostProcess: false
        runAsUserName: "UserExample"
```

Install Krateo PlatformOps:

```shell
helm upgrade installer-crd installer-crd \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.7.0 \
  --wait

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  -f ~/krateo-values.yaml
  --install \
  --version 2.7.0 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=500s
```

At the end of this process:

* The *Krateo Composable Portal* will be accessible at port 30080.
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
</Tabs>

:::info
The installer by default deploys a composable-portal-starter collection of potyal examples to immediately start to play with Krateo PlatformOps. The chart is available here: https://github.com/krateoplatformops/composable-portal-starter.
:::
