---
description: Migrating Krateo PlatformOps from v2.5.0 to v2.5.1 (AKS example)
sidebar_label: Migrating Krateo PlatformOps from v2.5.0 to v2.5.1 (AKS example)
---

# Migrating Krateo PlatformOps from v2.5.0 to v2.5.1 (AKS example)

> [!NOTE]  
> Skip this section if you have already Krateo v.2.5.0 installed

Krateo 2.5.1 release note is available here: ../../90-release-notes/11-release-note-2-5-1.md
 
Updated schemas for the new frontend are collected here: https://github.com/krateoplatformops/frontend-chart/tree/0.0.48/chart/crds.

The new Bleprints Marketplace has been introduced, and in this guide we will leverage the new https://github.com/krateoplatformops-blueprints/portal-composition-page-generic/tree/1.0.0, which is our opinionated and agnostic Composition page that shows Composition informations such as Events, Status of the managed resources and Values.
 
# Starting point: Krateo 2.5.0, Fireworksapp compositiondefinition 2.0.2, fireworksapp-tomigrate composition

```sh
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.5.0 \
  --wait
```

This is the `login` page of Krateo 2.5.0:
![image](/img/migrating/from-2-5-0-to-2-5-1/01_2-5-0-login.png)

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

Let's apply a Fireworksapp `compositiondefinition` version 2.0.2: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo version 2.5.0 or higher: 

```sh
kubectl create ns fireworksapp-system
```

```sh
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: fireworksapp
  namespace: fireworksapp-system
spec:
  chart:
    repo: fireworks-app
    url: https://charts.krateo.io
    version: 2.0.2
EOF
```

This is the `dashboard` page of Krateo 2.5.0 installation with the installed `compositiondefinition` with status `Ready:False`:
![image](/img/migrating/from-2-5-0-to-2-5-1/03_2-5-0-dashboard_1template_readyfalse.png)

This is the `dashboard` page of Krateo 2.5.0 installation with the install `compositiondefinition` that, after a while,e has status `Ready:True`:
![image](/img/migrating/from-2-5-0-to-2-5-1/04_2-5-0-dashboard_1template_readytrue.png)

Let's add the related Portal components in order to provision a `Card` in the `Templates` page.

```sh
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/restaction.fireworksapp-compositiondefinition.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/button.fireworksapp-template-panel-button-schema-notordered.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/form.fireworksapp-form-notordered.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/panel.fireworksapp-template-panel-schema-notordered.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/paragraph.fireworksapp-template-panel-paragraph-schema-notordered.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/restaction.fireworksapp-schema-notordered.yaml
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/krateo-v2-template-fireworksapp/refs/tags/2.0.2/portal/not-ordered/restaction.fireworksapp-template-restaction-cleanup-schema-notordered.yaml
```

Moving to the `template` page of Krateo 2.5.0 installation, a Card is available:
![image](/img/migrating/from-2-5-0-to-2-5-1/05_2-5-0-templates_1template_readytrue.png)

Let's click on the Card to open the Drawer with the CustomForm:
![image](/img/migrating/from-2-5-0-to-2-5-1/06_2-5-0-templates_1template_form.png)

Let's fill the form:
![image](/img/migrating/from-2-5-0-to-2-5-1/07_2-5-0-templates_1template_form_submitted.png)

Krateo automatically opens the `compositions` page once the `fireworksapp-tomigrate` composition is created:
![image](/img/migrating/from-2-5-0-to-2-5-1/09_2-5-0-compositions.png)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](/img/migrating/from-2-5-0-to-2-5-1/10_2-5-0-composition_overview.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/11_2-5-0-composition_status.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/12_2-5-0-composition_application.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/13_2-5-0-composition_events.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/14_2-5-0-composition_values.png)

This is the `dashboard` page of Krateo 2.5.0 installation with the installed `fireworksapp-tomigrate` composition:
![image](/img/migrating/from-2-5-0-to-2-5-1/15_2-5-0-dashboard_1template_1composition.png)

## Ending point: Krateo 2.5.1, Fireworksapp compositiondefinition 2.0.3 (version changed within the same compositiondefinition, previous fireworksapp-tomigrate composition
 
Let's upgrade Krateo from v2.5.0 to v2.5.1 on AKS in the following way:
 
```sh
# Adopt crd it for this release
kubectl annotate crd krateoplatformops.krateo.io \
  meta.helm.sh/release-name=installer \
  meta.helm.sh/release-namespace=krateo-system \
  app.kubernetes.io/managed-by=Helm \
  --overwrite

kubectl label crd krateoplatformops.krateo.io \
  app.kubernetes.io/managed-by=Helm --overwrite

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.5.1 \
  --wait

helm repo add marketplace https://marketplace.krateo.io
helm repo update marketplace
helm uninstall portal -n krateo-system
helm install portal marketplace/portal -n krateo-system --version 1.0.0 
```

> [!NOTE]  
> The LoadBalancer IP for the Portal will change

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

This is the `dashboard` page:
![image](/img/migrating/from-2-5-0-to-2-5-1/16_2-5-1-dashboard_1composition_readytrue.png)

This is the empty `blueprints` page (it substitues the old `templates` one):
![image](/img/migrating/from-2-5-0-to-2-5-1/17_2-5-1-blueprints_empty.png)

This is the `compositions` page:
![image](/img/migrating/from-2-5-0-to-2-5-1/18_2-5-1-compositions-tomigrate.png)

## Compositions migration

In order to fully leverage the 2.5.1 Portal widgets, the dependency in Fireworksapp has been [updated](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/commit/3a740e42073727bae78b749399512c4b162f919d#diff-462f538e090c491e7d916fd38843be03a198e0ed4f9c266b5704ef7af3244948)


We will update the related `compositiondefinition`:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: fireworksapp
  namespace: fireworksapp-system
spec:
  chart:
    repo: fireworks-app
    url: https://charts.krateo.io
    version: 2.0.3
EOF
```

And add `Routes` to the composition namespace `fireworksapp-system`:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: widgets.templates.krateo.io/v1beta1
kind: Route
metadata:
  name: fireworksapp-system-composition-route
  namespace: fireworksapp-system
spec:
  widgetData:
    path: /compositions/fireworksapp-system/{name}
    resourceRefId: fireworksapp-system-composition-tablist
  resourcesRefs:
    items:
      - id: fireworksapp-system-composition-tablist
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: "{name}-composition-tablist"
        namespace: fireworksapp-system
        resource: tablists
        verb: GET
EOF
```

Let's go back to the `compositions` page:
![image](/img/migrating/from-2-5-0-to-2-5-1/19_2-5-1-compositions-migrated.png)

And click on the `fireworksapp-tomigrate` composition:

![image](/img/migrating/from-2-5-0-to-2-5-1/20_2-5-1-composition-events.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/21_2-5-1-composition-status.png)
![image](/img/migrating/from-2-5-0-to-2-5-1/22_2-5-1-composition-values.png)

## Templates migration

To add again the Blueprint to the catalog, we will leverage the new [`portal-blueprint-page`](https://github.com/krateoplatformops-blueprints/portal-blueprint-page/blob/1.0.0/README.md#install-using-krateo-composable-operation) blueprint:

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
    url: https://marketplace.krateo.io
    version: 1.0.1
EOF

kubectl wait compositiondefinition portal-blueprint-page --for condition=Ready=True --namespace krateo-system --timeout=500s
```

Let's update the `CompositionDefinition` Custom Resource Definition:

```sh
kubectl apply -f https://raw.githubusercontent.com/krateoplatformops/core-provider-chart/refs/tags/0.33.4/chart/crds/core.krateo.io_compositiondefinitions.yaml
```

And now we add the Fireworksapp blueprint:

```sh
cat <<EOF | kubectl apply -f -
apiVersion: composition.krateo.io/v1-0-1
kind: PortalBlueprintPage
metadata:
  name: fireworks-app
  namespace: fireworksapp-system
spec:
  blueprint:
    url: https://charts.krateo.io
    version: 2.0.3 # this is the Blueprint version
    hasPage: false
  form:
    alphabeticalOrder: false
  panel:
    title: FireworksApp (Not Ordered Schema)
    icon:
      name: fa-cubes
EOF
```

Let's go back to the `blueprints` page:
![image](/img/migrating/from-2-5-0-to-2-5-1/23_2-5-1-blueprints_1blueprint.png)

The new form is available:

![image](/img/migrating/from-2-5-0-to-2-5-1/24-2-5-1-blueprints-1blueprint-migrated.png)