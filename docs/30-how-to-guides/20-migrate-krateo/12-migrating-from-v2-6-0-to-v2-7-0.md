---
description: Migrating Krateo PlatformOps from v2.6.0 to v2.7.0 (AKS example)
sidebar_label: Migrating Krateo PlatformOps from v2.6.0 to v2.7.0 (AKS example)
---

# Migrating Krateo PlatformOps from v2.6.0 to v2.7.0 (AKS example)

:::note
Skip this section if you already have Krateo v2.6.0 installed.
:::

The Krateo 2.7.0 release notes are available [here](../../90-release-notes/13-release-note-2-7-0.md).

In this guide, we will leverage the updated [portal-composition-page-generic](https://github.com/krateoplatformops-blueprints/portal-composition-page-generic/tree/1.4.0), which is our opinionated and agnostic Composition page that displays Composition information such as Events, Status of the managed resources, and Values.

We will also leverage the `portal-blueprint-page` to add the Blueprint to the catalog.

## Starting point: Krateo 2.6.0

```sh
helm upgrade installer-crd installer-crd \
  --repo [https://charts.krateo.io](https://charts.krateo.io) \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.6.0 \
  --wait

helm upgrade installer installer \
  --repo [https://charts.krateo.io](https://charts.krateo.io) \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --set krateoplatformops.finopscratedb.openshift.enabled=true \
  --install \
  --version 2.6.0 \
  --wait

```

Wait for Krateo PlatformOps to be up and running:

```sh
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=500s
```

Get the login page URL:

```sh
kubectl get svc frontend -n krateo-system  -o=jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

This is the `login` page of Krateo 2.6.0:

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

## Upgrade to Krateo 2.7.0

Let's upgrade Krateo from v2.6.0 to v2.7.0 on AKS using the following commands:

```sh
helm upgrade installer-crd installer-crd \
  --repo [https://charts.krateo.io](https://charts.krateo.io) \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.7.0 \
  --wait

helm upgrade installer installer \
  --repo [https://charts.krateo.io](https://charts.krateo.io) \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.7.0 \
  --wait
```

:::note
The LoadBalancer IP for the Portal will change.
:::

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

## Templates migration

In this section, we will explain how to migrate existing Blueprints to leverage the new frontend introduced in Krateo v2.7.0.

We will migrate the blueprint `GithubScaffoldingWithCompositionPage` deployed via the `portal-blueprint-page` blueprint.

### Install the `GithubScaffoldingWithCompositionPage` Blueprint using Composable Portal

:::note
Skip this section if you already have the [`GithubScaffoldingWithCompositionPage`](https://github.com/krateoplatformops-blueprints/github-scaffolding-with-composition-page/tree/1.2.1) and the `portal-blueprint-page` installed from Krateo v2.6.0.
:::

First, let's add the `portal-blueprint-page` to the catalog:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: portal-blueprint-page
  namespace: krateo-system
spec:
  chart:
    repo: portal-blueprint-page
    url: [https://marketplace.krateo.io](https://marketplace.krateo.io)
    version: 1.0.5
EOF

```

Wait for the `CompositionDefinition` to be ready:

```sh
kubectl wait compositiondefinition portal-blueprint-page --for condition=Ready=True --namespace krateo-system --timeout=500s
```

Now we can add the `GithubScaffoldingWithCompositionPage` Blueprint to the catalog:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: composition.krateo.io/v1-0-5
kind: PortalBlueprintPage
metadata:
  name: github-scaffolding-with-composition-page
  namespace: demo-system
spec:
  blueprint:
    url: [https://marketplace.krateo.io](https://marketplace.krateo.io)
    version: 1.1.0 # this is the Blueprint version
    hasPage: true
  form:
    alphabeticalOrder: false
  panel:
    title: GitHub Scaffolding with Composition Page
    icon:
      name: fa-cubes
EOF
```

Wait for the `PortalBlueprintPage` to be ready:

```sh
kubectl wait portalblueprintpage github-scaffolding-with-composition-page --for condition=Ready=True --namespace demo-system --timeout=500s
```

A panel called "Github Scaffolding with Composition Page" should now be available in the Krateo Composable Portal under the Blueprints section.

You can now create a new Composition leveraging the `GithubScaffoldingWithCompositionPage` Blueprint.

### Migrate the `GithubScaffoldingWithCompositionPage` Blueprint to use the new frontend

Update the `portal-blueprint-page` to the new version.

```sh
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: portal-blueprint-page
  namespace: krateo-system
spec:
  chart:
    repo: portal-blueprint-page
    url: [https://marketplace.krateo.io](https://marketplace.krateo.io)
    version: 1.0.6
EOF
```

Wait for the `CompositionDefinition` to be ready:

```sh
kubectl wait compositiondefinition portal-blueprint-page --for condition=Ready=True --namespace krateo-system --timeout=500s
```

Now let's update the `GithubScaffoldingWithCompositionPage` Blueprint to use the new frontend:

```sh
kubectl patch portalblueprintpage.composition.krateo.io/github-scaffolding-with-composition-page -n demo-system --type='json' -p='[{"op": "replace", "path": "/spec/blueprint/version", "value": "1.2.1"}]'
```

Wait for the `PortalBlueprintPage` to be ready:

```sh
kubectl wait portalblueprintpage github-scaffolding-with-composition-page --for condition=Ready=True --namespace demo-system --timeout=500s
```

At this point, any new Composition created with the `GithubScaffoldingWithCompositionPage` Blueprint will leverage the new frontend introduced in Krateo v2.7.0.

The most important change is in the `GithubScaffoldingWithCompositionPage` Blueprint, where the Composition page has been updated to use [the new `portal-composition-page-generic` Composition](https://github.com/krateoplatformops-blueprints/portal-composition-page-generic/releases/tag/1.4.0) page.

The default route in the `demo-system` has been changed in the `Portal` Blueprint to avoid duplicate routes for compositions with the same name (but different Kind); the `portal-composition-page-generic` Blueprint has been updated to support this new routing mechanism.
