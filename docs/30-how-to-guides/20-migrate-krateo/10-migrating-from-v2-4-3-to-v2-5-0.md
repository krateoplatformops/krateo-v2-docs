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
![image](https://github.com/user-attachments/assets/c6896e72-0a29-4f48-8f5e-00e19d758f78)

This is the `dashboard` page of an empty Krateo 2.4.3 installation:
![image](https://github.com/user-attachments/assets/7b3b3a6f-d210-4a76-8bac-a67f98e91b70)

Let's apply a Fireworksapp `compositiondefinition` version 1.1.15: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo <= 2.4.3

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `compositiondefinition` with status `Ready:False`:
![image](https://github.com/user-attachments/assets/3b8f8aa7-4e2c-4b3e-b94c-8bd3b8fe347f)

This is the `dashboard` page of Krateo 2.4.3 installation with the install `compositiondefinition` that, after a while,e has status `Ready:True`:
![image](https://github.com/user-attachments/assets/5146e08c-e250-4caa-b9e9-250120dd5470)

Moving to the `template` page of Krateo 2.4.3 installation, a Card is available:
![image](https://github.com/user-attachments/assets/66dc1098-913e-4035-9b85-bc8dfd3b123a)

Let's click on the Card to open the Drawer with the CustomForm:
![image](https://github.com/user-attachments/assets/3b39de93-0d2a-4181-99c8-d95128943ba3)

Let's fill the form:
![image](https://github.com/user-attachments/assets/c63657fb-8547-4215-b50d-d33f3317f09b)
![image](https://github.com/user-attachments/assets/a26c9878-6179-4120-8062-c8b9d9b60dce)

Krateo automatically opens the `compositions` page once the `fireworksapp-tomigrate` composition is created:
![image](https://github.com/user-attachments/assets/8f02d68a-360f-4543-8bea-9f6ff29be4b0)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](https://github.com/user-attachments/assets/95acd13c-8249-4400-9dce-6af0cdee52f0)
![image](https://github.com/user-attachments/assets/7de61d25-e820-4503-9f5f-6ba52772609f)
![image](https://github.com/user-attachments/assets/2b7212dc-16e6-489f-a3d7-7ef0d74bbea3)
![image](https://github.com/user-attachments/assets/84a831c5-2953-4ea4-9670-9d7d69aae638)
![image](https://github.com/user-attachments/assets/d67d6dd8-16a4-40c4-b746-92316a2676e2)

This is the `dashboard` page of Krateo 2.4.3 installation with the installed `fireworksapp-tomigrate` composition:
![image](https://github.com/user-attachments/assets/3f3f0489-8614-4551-a8b5-684452e86f0c)

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
![image](https://github.com/user-attachments/assets/c8a94619-b282-4f74-acbb-bdf1be7785cd)

This is the `dashboard` page of a Krateo 2.5.0 installation:
![image](https://github.com/user-attachments/assets/c6aebd83-4b14-4ced-89a4-388acb06a38c)

Let's configure Krateo 2.5.0 for Fireworksapp `compositiondefinition` version 2.0.2: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp, follow instruction for Krateo >= 2.5.0

Let's navigate the `compositions` page of Krateo 2.5.0 - it is empty since the composition `fireworksapp-tomigrate` has not been migrated yet:
![image](https://github.com/user-attachments/assets/a052735d-c2a3-4153-8233-881711d5b930)

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
![image](https://github.com/user-attachments/assets/08c6d15f-512c-4e0a-8ed5-edc135057397)

Let's navigate the `fireworksapp-tomigrate` composition widgets:
![image](https://github.com/user-attachments/assets/ffac1cca-4cd5-474a-b538-2c473c32633f)
![image](https://github.com/user-attachments/assets/ae8d8e07-6275-47c6-a996-259e6dda0af6)
![image](https://github.com/user-attachments/assets/239320a6-968c-4ccb-a2d8-5d08486d2377)
![image](https://github.com/user-attachments/assets/2447f51b-9c1e-4d0c-be0d-8d4e8f9a93c3)
![image](https://github.com/user-attachments/assets/c4af4aa6-088c-4576-bc48-5f195c53d5c4)

The composition `fireworksapp-tomigrate` has been migrated. 

# What has changed in the Fireworksapp helm chart from 1.1.15 to 2.0.2 version

We have changed the dependency, 
- from: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/1.1.15/chart/Chart.yaml#L27-L32
- to: https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/2.0.2/chart/Chart.yaml#L20-L24

We have released a new Helm Chart that collects Krateo 2.5.0 new portal widgets which is called `composable-portal-starter`.