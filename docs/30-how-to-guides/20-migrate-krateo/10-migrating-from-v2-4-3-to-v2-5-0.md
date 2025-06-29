---
description: Migrating Krateo PlatformOps from v2.4.3 to v2.5.0 (AKS example)
sidebar_label: Migrating Krateo PlatformOps from v2.4.3 to v2.5.0 (AKS example)
---

# Migrating Krateo PlatformOps from v2.4.3 to v2.5.0 (AKS example)

Krateo 2.5.0 introduces a new set of manifests to declare widgets in the portal. The difference with the previous version resides in the following:
- API orchestration has been decoupled from the data preparation for the portal. This assumption requires implementing a RESTAction that the widget will reference
- New widgets are strongly typified, meaning that there is a specific Kind for a particular widget, and properties are expressed in the dedicated CRD

The schema for widgets until the 2.4.3 version is the following:

```
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
spec:
  type: panel
  propsRef:
  widgetsRefs: []
---
apiVersion: templates.krateo.io/v1alpha1
kind: Widget
spec:
  type:
  propsRef:
  app:
    template:
  API: []
  actions: []
```

The schema for widget from 2.5.0 version is the following:

```
kind: LineChart
apiVersion: widgets.templates.krateo.io/v1beta1
spec:
  widgetData:
  apiRef: 
  widgetDataTemplate: []
  resourcesRefs: []
  resourcesRefsTemplate: []
```
 
 Updated schemas for the new frontend are collected here: https://github.com/krateoplatformops/frontend-chart/tree/main/chart/crds
 
 ## Starting point: Krateo 2.4.3, Fireworksapp compositiondefinition 1.1.15, fireworksapp-tomigrate composition
 
 Krateo 2.4.3 has been installed on AKS in the following way:
 ```
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.4.3 \
  --wait
```

This is the `login` page of Krateo 2.4.3:
![image](/img/migrating/01_2-4-3-login.png)

This is the `dashboard` page of an empty Krateo 2.4.3 installation:
![image](/img/migrating/02_2-4-3-dashboard_notemplates.png)

Let's apply a Fireworksapp `compositiondefinition` version 1.1.15: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo version 2.4.3 or lower

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `compositiondefinition` with status `Ready:False`:
![image](/img/migrating/03_2-4-3-dashboard_1template_readyfalse.png)

This is the `dashboard` page of Krateo 2.4.3 installation with the install `compositiondefinition` that, after a while,e has status `Ready:True`:
![image](/img/migrating/04_2-4-3-dashboard_1template_readytrue.png)

Moving to the `template` page of Krateo 2.4.3 installation, a Card is available:
![image](/img/migrating/05_2-4-3-templates_1template_readytrue.png)

Let's click on the Card to open the Drawer with the CustomForm:
![image](/img/migrating/06_2-4-3-templates_1template_form.png)

Let's fill the form:
![image](/img/migrating/07_2-4-3-templates_1template_form_filled.png)
![image](/img/migrating/08_2-4-3-templates_1template_form_submitted.png)

Krateo automatically opens the `compositions` page once the `fireworksapp-tomigrate` composition is created:
![image](/img/migrating/09_2-4-3-compositions.png)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](/img/migrating/10_2-4-3-composition_overview.png)
![image](/img/migrating/11_2-4-3-composition_status.png)
![image](/img/migrating/12_2-4-3-composition_application.png)
![image](/img/migrating/13_2-4-3-composition_events.png)
![image](/img/migrating/14_2-4-3-composition_values.png)

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `fireworksapp-tomigrate` composition:
![image](/img/migrating/15_2-4-3-dashboard_1template_1composition.png)

 ### Scale Krateo 2.4.3 core-provider to zero replicas

 ```sh
kubectl scale deployment core-provider --replicas=0 -n krateo-system
```

 ### Scale Krateo 2.4.3 oasgen-provider to zero replicas

```sh
kubectl scale deployment oasgen-provider --replicas=0 -n krateo-system
```

## Ending point: Krateo 2.5.0, Fireworksapp compositiondefinition 2.0.2 (version changed within the same compositiondefinition, previous fireworksapp-tomigrate composition
 
A parallel installation of Krateo 2.5.0 has been installed on AKS in the following way:
 
 ```sh
git clone --branch 249-prepare-release-250 https://github.com/krateoplatformops/installer-chart.git
cd installer-chart
helm install installer-v2 ./chart --namespace krateo-v2-system --create-namespace -f ./chart/values.yaml --wait
```

 ### Scale Krateo 2.5.0 core-provider to zero replicas

 ```sh
kubectl scale deployment core-provider --replicas=0 -n krateo-v2-system
```

 ### Scale Krateo 2.4.3 core-provider to one replica

 ```sh
kubectl scale deployment core-provider --replicas=1 -n krateo-system
```

This is the `login` page of Krateo 2.5.0:
![image](/img/migrating/16_2-5-0-login.png)

This is the `dashboard` page of a Krateo 2.5.0 installation:
![image](/img/migrating/17_2-5-0-dashboard_1template_1composition.png)

Let's configure Krateo 2.5.0 for Fireworksapp `compositiondefinition` version 2.0.2: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo >= 2.5.0

Let's navigate the `compositions` page of Krateo 2.5.0 - it is empty since the composition `fireworksapp-tomigrate` has not been migrated yet:
![image](/img/migrating/18_2-5-0-compositions_empty.png)

Let's migrate the composition, changing the Fireworksapp `compositiondefinition` version from 1.1.15 to 2.0.2:
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

Let's navigate again the `compositions` page of Krateo 2.5.0 - now the composition `fireworksapp-tomigrate` is migrated:
![image](/img/migrating/19_2-5-0-compositions.png)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](/img/migrating/20_2-5-0-composition_overview.png)
![image](/img/migrating/21_2-5-0-composition_status.png)
![image](/img/migrating/22_2-5-0-composition_application.png)
![image](/img/migrating/23_2-5-0-composition_events.png)
![image](/img/migrating/24_2-5-0-composition_values.png)

The composition `fireworksapp-tomigrate` has been migrated. 

# What has changed in the Fireworksapp helm chart from 1.1.15 to 2.0.2 version

We have changed the dependency, 
- from: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/1.1.15/chart/Chart.yaml#L27-L32
- to: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/2.0.2/chart/Chart.yaml#L20-L24

We have released a new Helm Chart that collects Krateo 2.5.0 new portal widgets which is called `composable-portal-starter`.