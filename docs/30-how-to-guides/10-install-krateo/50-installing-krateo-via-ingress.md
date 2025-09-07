---
description: Learn how to install Krateo PlatformOps using this step-by-step guide
sidebar_label: Installing Krateo PlatformOps and expose it via Ingress
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Installing Krateo PlatformOps and expose it via Ingress

## Basic Installation

Installing Krateo with default configuration is quick and easy.

You will need:

* [Helm](https://helm.sh/docs/): These instructions were tested with v3.13.1.
* A Kubernetes cluster.

:::note
Krateo PlatformOps [installer](https://github.com/krateoplatformops/installer-chart) is a flexible workflow engine that executes sequential steps. The installer-chart is a helper that provider already baked configurations for Krateo PlatformOps. It is however possible to implement a custom installer. Please check all the possible values supported by the chart.
:::

<Tabs groupId="kubernetes-version">
<TabItem value="ingress" label="ingress">

Krateo PlatformOps can be exposed via Ingress in the following way:

```shell
helm repo add krateo https://charts.krateo.io
helm repo update krateo
helm inspect values krateo/installer --version 2.5.1 > ~/krateo-values.yaml
```

Modify the *krateo-values.yaml* file as the following example:

```yaml
krateoplatformops:
  ingress:
    enabled: true
    frontend:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: app.krateoplatformops.io
      hosts:
        - host: app.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: frontend-krateo-certificate
      #   hosts:
      #     - app.krateoplatformops.io
    snowplow:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: "snowplow.krateoplatformops.io"
      hosts:
        - host: snowplow.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: snowplow-krateo-certificate
      #   hosts:
      #     - snowplow.krateoplatformops.io
    authn:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: "authn.krateoplatformops.io"
      hosts:
        - host: authn.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: authn-krateo-certificate
      #   hosts:
      #     - authn.krateoplatformops.io
    eventsse:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: "eventsse.krateoplatformops.io"
      hosts:
        - host: eventsse.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: eventsse-krateo-certificate
      #   hosts:
      #     - eventsse.krateoplatformops.io
    resourcetreehandler:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: "resoucetreehandler.krateoplatformops.io"
      hosts:
        - host: resoucetreehandler.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: resoucetreehandler-krateo-certificate
      #   hosts:
      #     - resoucetreehandler.krateoplatformops.io
    smithery:
      className: ""
      annotations: {}
        # cert-manager.io/cluster-issuer: letsencrypt-krateo
        # external-dns.alpha.kubernetes.io/hostname: "smithery.krateoplatformops.io"
      hosts:
        - host: smithery.krateoplatformops.io
          paths:
            - path: /
              pathType: Prefix
      tls: []
      # - secretName: smithery-krateo-certificate
      #   hosts:
      #     - smithery.krateoplatformops.io
  frontend:
    overrideconf: true
    config:
      AUTHN_API_BASE_URL: http://authn.krateoplatformops.io
      SNOWPLOW_API_BASE_URL: http://snowplow.krateoplatformops.io
      EVENTS_PUSH_API_BASE_URL: http://eventsse.krateoplatformops.io
      EVENTS_API_BASE_URL: http://eventsse.krateoplatformops.io
      SMITHERY_API_BASE_URL: http://smithery.krateoplatformops.io
```

Install Krateo PlatformOps:

```shell
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  -f ~/krateo-values.yaml
  --install \
  --version 2.5.1 \
  --wait
```

Wait for Krateo PlatformOps to be up&running:
```shell
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=500s
```

At the end of this process:

* The *Krateo Composable Portal* will be accessible at the host specified in *krateoplatformops.ingress.frontend.hosts[0].host*.
* The *admin* user password can be retrieved with the following command:
```shell
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

</TabItem>
</Tabs>

:::info
The installer by default deploys a composable-portal-starter collection of potyal examples to immediately start to play with Krateo PlatformOps. The chart is available here: https://github.com/krateoplatformops/composable-portal-starter.
:::