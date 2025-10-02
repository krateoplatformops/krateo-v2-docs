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
 
Updated schemas for the new frontend are collected here: https://github.com/krateoplatformops/frontend-chart/tree/0.0.19/chart/crds
 
## Starting point: Krateo 2.4.3, Fireworksapp compositiondefinition 1.1.15, fireworksapp-tomigrate composition
 
Krateo 2.4.3 has been installed on AKS in the following way:

```sh
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
![image](/img/migrating/from-2-4-3-to-2-5-0/01_2-4-3-login.png)

This is the `dashboard` page of an empty Krateo 2.4.3 installation:
![image](/img/migrating/from-2-4-3-to-2-5-0/02_2-4-3-dashboard_notemplates.png)

Let's apply a Fireworksapp `compositiondefinition` version 1.1.15: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo version 2.4.3 or lower

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `compositiondefinition` with status `Ready:False`:
![image](/img/migrating/from-2-4-3-to-2-5-0/03_2-4-3-dashboard_1template_readyfalse.png)

This is the `dashboard` page of Krateo 2.4.3 installation with the install `compositiondefinition` that, after a while,e has status `Ready:True`:
![image](/img/migrating/from-2-4-3-to-2-5-0/04_2-4-3-dashboard_1template_readytrue.png)

Moving to the `template` page of Krateo 2.4.3 installation, a Card is available:
![image](/img/migrating/from-2-4-3-to-2-5-0/05_2-4-3-templates_1template_readytrue.png)

Let's click on the Card to open the Drawer with the CustomForm:
![image](/img/migrating/from-2-4-3-to-2-5-0/06_2-4-3-templates_1template_form.png)

Let's fill the form:
![image](/img/migrating/from-2-4-3-to-2-5-0/07_2-4-3-templates_1template_form_filled.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/08_2-4-3-templates_1template_form_submitted.png)

Krateo automatically opens the `compositions` page once the `fireworksapp-tomigrate` composition is created:
![image](/img/migrating/from-2-4-3-to-2-5-0/09_2-4-3-compositions.png)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](/img/migrating/from-2-4-3-to-2-5-0/10_2-4-3-composition_overview.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/11_2-4-3-composition_status.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/12_2-4-3-composition_application.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/13_2-4-3-composition_events.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/14_2-4-3-composition_values.png)

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `fireworksapp-tomigrate` composition:
![image](/img/migrating/from-2-4-3-to-2-5-0/15_2-4-3-dashboard_1template_1composition.png)

## Ending point: Krateo 2.5.0, Fireworksapp compositiondefinition 2.0.2 (version changed within the same compositiondefinition, previous fireworksapp-tomigrate composition
 
Let's upgrade Krateo from v2.4.3 to v2.5.0 on AKS in the following way:
 
```sh
cat <<EOF | kubectl apply -f -
apiVersion: v1
kind: Namespace
metadata:
  name: krateo-system
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: helm-runner
  namespace: krateo-system
---
# For simplicity, cluster-admin. Tighten later if needed.
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: helm-runner-cluster-admin
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: helm-runner
    namespace: krateo-system
---
apiVersion: batch/v1
kind: Job
metadata:
  name: krateo-pre-upgrade-2-5-0
  namespace: krateo-system
spec:
  backoffLimit: 4
  ttlSecondsAfterFinished: 3600
  template:
    spec:
      serviceAccountName: helm-runner
      restartPolicy: OnFailure
      containers:
        - name: runner
          image: dtzar/helm-kubectl:3.14.4
          imagePullPolicy: IfNotPresent
          command: ["/bin/sh","-lc"]
          args:
            - |
              set -euo pipefail

              echo "Annotate/label CRD compositionreferences.resourcetrees.krateo.io..."
              kubectl annotate crd compositionreferences.resourcetrees.krateo.io \
                meta.helm.sh/release-name=resource-tree-handler \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd compositionreferences.resourcetrees.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              echo "Annotate secret admin-password in krateo-system..."
              kubectl annotate secret admin-password -n krateo-system \
                meta.helm.sh/release-name=composable-portal-starter \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              echo "Annotate user admin in krateo-system..."
              kubectl annotate user admin -n krateo-system \
                meta.helm.sh/release-name=composable-portal-starter \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              echo "Pre-upgrade 2.5.0 job done ✅"
EOF
```

Update then Krateo to version 2.5.0:

```sh
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --set krateoplatformops.finopsdatabasehandler.chart.version=0.4.5 \
  --install \
  --version 2.5.0 \
  --wait
```

This is the `login` page of Krateo 2.5.0:
![image](/img/migrating/from-2-4-3-to-2-5-0/16_2-5-0-login.png)

This is the `dashboard` page of a Krateo 2.5.0 installation:
![image](/img/migrating/from-2-4-3-to-2-5-0/17_2-5-0-dashboard_1template_1composition.png)

Let's navigate the `compositions` page of Krateo 2.5.0 - it is empty since the composition `fireworksapp-tomigrate` has not been migrated yet:
![image](/img/migrating/from-2-4-3-to-2-5-0/18_2-5-0-compositions_empty.png)

Let's configure Krateo 2.5.0 for Fireworksapp `compositiondefinition` version 2.0.2: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo == 2.5.0

Let's navigate again the `compositions` page of Krateo 2.5.0 - now the composition `fireworksapp-tomigrate` is migrated:
![image](/img/migrating/from-2-4-3-to-2-5-0/19_2-5-0-compositions.png)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](/img/migrating/from-2-4-3-to-2-5-0/20_2-5-0-composition_overview.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/21_2-5-0-composition_status.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/22_2-5-0-composition_application.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/23_2-5-0-composition_events.png)
![image](/img/migrating/from-2-4-3-to-2-5-0/24_2-5-0-composition_values.png)

The composition `fireworksapp-tomigrate` has been migrated. 

# What has changed in the Fireworksapp helm chart from 1.1.15 to 2.0.2 version

We have changed the dependency, 
- from: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/1.1.15/chart/Chart.yaml#L27-L32
- to: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/2.0.2/chart/Chart.yaml#L20-L24

We have released a new Helm Chart that collects Krateo 2.5.0 new portal widgets which is called `composable-portal-starter`.