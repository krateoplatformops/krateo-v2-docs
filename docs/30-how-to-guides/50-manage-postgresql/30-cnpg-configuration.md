---
description: CNPG Configuration
sidebar_label: CNPG Configuration
---

# CNPG Configuration

The CNPG cluster creation step in the installation process can be customized based on the needs of your environment.

The default installation step has the following configuration for the CNPG cluster:

```yaml
  - id: install-pg-cluster # CNPG Cluster + database `krateo-db`
    type: chart
    with:
      releaseName: pg-cluster
      repo: cluster
      url: https://cloudnative-pg.github.io/charts
      version: 0.5.0
      wait: true
      timeout: 15m
      values:
        # fullnameOverride controls the name of every K8s resource produced.
        fullnameOverride: "pg-cluster"
        namespaceOverride: ""            # Defaults to the Helm release namespace

        # Engine type & version
        type: postgresql
        version:
          postgresql: "18"              # PostgreSQL major version

        # Cluster mode
        mode: standalone

        cluster:
          # 3 instances = 1 primary (read-write) + 2 standbys (read-only)
          # CNPG exposes three services automatically:
          #   <name>-rw  → primary only   (writes + reads)
          #   <name>-ro  → standbys only  (reads only)
          #   <name>-r   → all instances  (reads)
          instances: 3

          storage:
            size: 10Gi

          resources:
            requests:
              cpu: "500m"
              memory: "512Mi"
            limits:
              cpu: "1000m"
              memory: "1Gi"

          # Declarative role management
          roles:
            - name: krateo-db-user
              comment: "Owner of the krateo-db database"
              login: true
              passwordSecret:
                name: krateo-db-user  # Kubernetes Secret with username and password for the owner role, it must exist before CNPG cluster creation

        # Monitoring configuration
        #  monitoring:
        #    # Enable monitoring with Prometheus
        #    enabled: true # If true, it will create the PrometheusRule
        #    podMonitor:
        #      enabled: false # Explicitely set to false since it is deprecated in favor of manually creating a PodMonitor

        # Declarative database management via the CNPG "Database" CRD.
        # Each entry below produces a separate Database object in Kubernetes.
        databases:
          # Database 1: krateo-db
          # Purpose: stores resources and k8s events
          - name: krateo-db
            owner: krateo-db-user         # Must match a role in cluster.roles above
```

In particular, the most relevant configuration options to consider when customizing the CNPG installation are:
- `cluster.instances`: the number of instances in the CNPG cluster. The default value is 3, which means 1 primary (read-write) and 2 standbys (read-only). You can adjust this value based on your availability and performance requirements.
- `cluster.storage.size`: the size of the storage for each instance. The default value is 10Gi. You can adjust this value based on your expected data volume and growth.
- `cluster.resources`: the resource requests and limits for each instance. The default values are 500m CPU and 512Mi memory for requests, and 1000m CPU and 1Gi memory for limits. You can adjust these values based on your performance requirements and cluster capacity. This is particularly environment-specific and it is recommended to analyze the specific needs of your environment and workload to determine the optimal resource configuration for the CNPG cluster.

:::note
It is strongly recommended to analyze the specific needs of your environment and workload to determine the optimal configuration for the CNPG cluster.
:::

## Example Custom Config File

Here is an example of a custom config file for `krateoctl` that overrides the default CNPG configuration:

```yaml
components:
  cnpg:
    stepConfig:
      install-pgcluster:
        with:
          values:
            cluster:
              instances: 5
              storage:
                size: 20Gi
              resources:
                requests:
                  cpu: "1000m"
                  memory: "1Gi"
                limits:
                  cpu: "2000m"
                  memory: "2Gi"
```

You can use this config file when installing Krateo with the following command:

```sh
krateoctl install apply --config <path-to-your-config-file>
```
