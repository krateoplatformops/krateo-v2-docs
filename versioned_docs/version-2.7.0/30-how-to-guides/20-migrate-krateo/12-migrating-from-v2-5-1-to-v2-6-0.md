---
description: Migrating Krateo PlatformOps from v2.5.1 to v2.6.0 (AKS example)
sidebar_label: Migrating Krateo PlatformOps from v2.5.1 to v2.6.0 (AKS example)
---

# Migrating Krateo PlatformOps from v2.5.1 to v2.6.0 (AKS example)

:::note
Skip this section if you have already Krateo v.2.5.1 installed
:::

Krateo 2.6.0 release note is available here: ../../90-release-notes/12-release-note-2-6-0.md
 
Updated schemas for the new frontend are collected here: https://github.com/krateoplatformops/frontend-chart/tree/0.0.57/crd-chart/templates.

In this guide we will leverage the updated https://github.com/krateoplatformops-blueprints/portal-composition-page-generic/tree/1.1.0, which is our opinionated and agnostic Composition page that shows Composition informations such as Events, Status of the managed resources and Values.
 
## Starting point: Krateo 2.5.1

```sh
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.5.1 \
  --wait
```

This is the `login` page of Krateo 2.5.1:
![image](/img/migrating/from-2-5-1-to-2-6-0/01_2-5-1-login.png)

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

## Ending point: Krateo 2.6.0
 
Let's upgrade Krateo from v2.5.1 to v2.6.0 on AKS in the following way:
 
```yaml
cat <<EOF | kubectl apply -f -
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
  name: krateo-pre-upgrade-2-6-0
  namespace: krateo-system
spec:
  backoffLimit: 3
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

              kubectl annotate crd users.basic.authn.krateo.io \
                meta.helm.sh/release-name=authn \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd users.basic.authn.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd ldapconfigs.ldap.authn.krateo.io \
                meta.helm.sh/release-name=authn \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd ldapconfigs.ldap.authn.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd oauthconfigs.oauth.authn.krateo.io \
                meta.helm.sh/release-name=authn \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd oauthconfigs.oauth.authn.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd oidcconfigs.oidc.authn.krateo.io \
                meta.helm.sh/release-name=authn \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd oidcconfigs.oidc.authn.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd restactions.templates.krateo.io \
                meta.helm.sh/release-name=snowplow \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd restactions.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd registrations.eventrouter.krateo.io \
                meta.helm.sh/release-name=eventrouter \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd registrations.eventrouter.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd barcharts.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd barcharts.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd buttons.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd buttons.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd columns.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd columns.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd datagrids.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd datagrids.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd eventlists.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd eventlists.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd filters.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd filters.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd flowcharts.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd flowcharts.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd forms.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd forms.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd linecharts.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd linecharts.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd markdowns.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd markdowns.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd navmenus.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd navmenus.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd navmenuitems.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd navmenuitems.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd pages.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd pages.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd panels.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd panels.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd paragraphs.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd paragraphs.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd piecharts.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd piecharts.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd routes.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd routes.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd routesloaders.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd routesloaders.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd rows.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd rows.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd tablists.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd tablists.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd tables.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd tables.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd yamlviewers.widgets.templates.krateo.io \
                meta.helm.sh/release-name=frontend \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd yamlviewers.widgets.templates.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd compositiondefinitions.core.krateo.io \
                meta.helm.sh/release-name=core-provider \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd compositiondefinitions.core.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd restdefinitions.ogen.krateo.io \
                meta.helm.sh/release-name=oasgen-provider \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd restdefinitions.ogen.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd databaseconfigs.finops.krateo.io \
                meta.helm.sh/release-name=finops-operator-exporter \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd databaseconfigs.finops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd exporterscraperconfigs.finops.krateo.io \
                meta.helm.sh/release-name=finops-operator-exporter \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd exporterscraperconfigs.finops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd focusconfigs.finops.krateo.io \
                meta.helm.sh/release-name=finops-operator-focus \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd focusconfigs.finops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd notebooks.finops.krateo.io \
                meta.helm.sh/release-name=finops-database-handler-uploader \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd notebooks.finops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd scraperconfigs.finops.krateo.io \
                meta.helm.sh/release-name=finops-operator-scraper \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd scraperconfigs.finops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate crd krateoplatformops.krateo.io \
                meta.helm.sh/release-name=installer-crd \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                --overwrite

              kubectl label crd krateoplatformops.krateo.io \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl annotate krateoplatformops krateo -n krateo-system \
                meta.helm.sh/release-name=installer \
                meta.helm.sh/release-namespace=krateo-system \
                app.kubernetes.io/managed-by=Helm \
                helm.sh/hook- \
                --overwrite

              kubectl label krateoplatformops krateo -n krateo-system \
                app.kubernetes.io/managed-by=Helm --overwrite

              kubectl -n krateo-system delete secret -l owner=helm,name=installer

              echo "Pre-upgrade 2.6.0 job done ✅"
EOF
```

Update then Krateo to version 2.6.0:

```sh
helm upgrade installer-crd installer-crd \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.6.0 \
  --wait

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.6.0 \
  --wait
```

Launch a second time the upgrade once the previous command has been applied:

```sh
helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --set krateoplatformops.service.type=LoadBalancer \
  --set krateoplatformops.service.externalIpAvailable=true \
  --install \
  --version 2.6.0 \
  --wait
```

Why two upgrades of the same helm chart and version?

Helm 3 uses a three-way strategic merge patch, comparing the old manifest, the live state, and the new manifest. When a resource has been manually modified and then “adopted” by the chart without a clear difference during the first upgrade, Helm may calculate an empty or partial patch on the first pass, only applying the changes during the second upgrade once the comparison base has shifted.

**Why nothing happens on the first upgrade**
After removing the hooks and manually “marking” the resource as managed by Helm, the first execution considers the “old” manifest from the last recorded release and the “live” object that was manually modified. If the new manifest doesn’t differ in a decisive way from the live state, the resulting patch may be a no-op for parts of the spec.
The three-way merge preserves out-of-band modifications (e.g., sidecars, labels/annotations added by controllers or service meshes). So if the chart’s variation is seen as non-conflicting or already present in the live state, Helm doesn’t force a replacement on the first run.

**Why it applies on the second upgrade**
After the first upgrade, the “old base” stored in the release history is updated to the new revision. When Helm recalculates the diff with the updated old/live/new, certain differences now appear as applicable, and a patch is produced—making the change visible only on the second run.

:::note
The LoadBalancer IP for the Portal will change
:::

Login with the new password generated for the admin user:

```sh
kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d
```

## Templates migration

To add again the Blueprint to the catalog, we will leverage the new [`portal-blueprint-page`](https://github.com/krateoplatformops-blueprints/portal-blueprint-page/blob/1.0.5/README.md#install-using-krateo-composable-portal) blueprint:

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
    version: 1.0.5
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
apiVersion: composition.krateo.io/v1-0-5
kind: PortalBlueprintPage
metadata:
  name: fireworks-app
  namespace: fireworksapp-system
spec:
  blueprint:
    url: https://charts.krateo.io
    version: 2.0.4 # this is the Blueprint version
    hasPage: false
  form:
    alphabeticalOrder: false
  panel:
    title: FireworksApp (Not Ordered Schema)
    icon:
      name: fa-cubes
EOF
```