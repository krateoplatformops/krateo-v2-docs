---
description: Migrating Krateo PlatformOps from v2.7.0 to v3.0.0
sidebar_label: Migrating Krateo PlatformOps from v2.7.0 to v3.0.0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Krateo 2.7.0 to 3.0.0 Migration Guide

Krateo 3.0.0 introduces a major architectural shift from a cluster-resident controller to a stateless CLI-based management model. The core goal of this migration is to move Krateo installation and upgrade management away from the in-cluster installer controller to the external `krateoctl` CLI tool, giving you explicit control over the full lifecycle through `plan` and `apply` workflows. This guide covers the migration from the legacy installer-based approach to the new `krateo.yaml` + `krateoctl` workflow.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Before You Start](#before-you-start)
- [Secrets Configuration](#secrets-configuration)
- [Migration for Different Environments](#migration-for-different-environments)
- [Fresh Installations or Future Updates](#fresh-installations-or-future-updates)
- [Verify Migration Success](#verify-migration-success)
- [About Pre-Upgrade Cleanup](#about-pre-upgrade-cleanup)
- [Configuration Reference](#configuration-reference)
- [Getting Help](#getting-help)

## Key Changes in 3.0.0

- **CLI-based management:** Installation and upgrades now managed through `krateoctl` instead of an in-cluster controller, giving you explicit control via `plan` and `apply` workflows.
- **Database migration:** PostgreSQL (via CNPG) replaces etcd, with events and resources now persisted in PostgreSQL for better scalability.
- **Rewritten event and resource stacks:** New Ingester + Presenter architecture with improved performance and OpenTelemetry metrics support.
- **Enhanced components:** Updated Core Provider, Composition Dynamic Controller, OASGen Provider, Autopilot, and frontend with performance improvements and new capabilities.

## Prerequisites

- kubectl configured and connected to your cluster
- **Krateo 2.7.0 is currently running in your cluster** with the installer controller
- Latest `krateoctl` binary (3.0.0+) installed locally
- Adequate cluster permissions to manage resources in your Krateo namespace (default: `krateo-system`)

:::note
These migration steps are **only for existing Krateo 2.7.0 installations** managed by the installer controller. For fresh Krateo 3.0.0 installations on a new cluster, use `krateoctl install apply` directly with your `krateo.yaml` configuration file instead of the migration commands.
:::
## Before You Start

:::important
These steps apply **only when migrating from an existing Krateo 2.7.0 installation** with the installer controller running in your cluster.

For **fresh Krateo 3.0.0 installations** on a new cluster, see [Install and Upgrade](../install-krateo/installing-krateo) and use `krateoctl install apply` directly with your `krateo.yaml` file.
:::

### 1. Prepare Your Environment

Ensure your current installation is running smoothly:

```bash
kubectl get krateoplatformops -n krateo-system
kubectl get pods -n krateo-system
```

### 2. Backup Current Configuration

Export your legacy configuration for reference:

```bash
kubectl get krateoplatformops krateo -n krateo-system -o yaml > krateo-2.7.0-backup.yaml
```

## Secrets Configuration

Krateo 3.0.0 does not bootstrap production secrets. Secrets must be created and managed separately before or during the migration. See the full [Secrets Spec](../install-krateo/secrets) for detailed requirements and architecture.

### Creating Required Secrets

Before running migration, create the required secrets in your install namespace. Krateo 3.0.0 requires the following secrets:

```bash
# Generate URL-safe random JWT signing key
JWT_SIGN_KEY=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=')

# Generate URL-safe database password (use the same for both secrets)
DB_PASS=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=')

# Create jwt-sign-key secret
kubectl create secret generic jwt-sign-key \
  --from-literal=JWT_SIGN_KEY="$JWT_SIGN_KEY" \
  -n krateo-system

# Create krateo-db secret (for stack components)
kubectl create secret generic krateo-db \
  --from-literal=DB_USER=krateo-db-user \
  --from-literal=DB_PASS="$DB_PASS" \
  -n krateo-system

# Create krateo-db-user secret (for CNPG/database)
# Must use the same password as krateo-db
kubectl create secret generic krateo-db-user \
  --from-literal=username=krateo-db-user \
  --from-literal=password="$DB_PASS" \
  -n krateo-system
```

**Important consistency rules:**
- `krateo-db` and `krateo-db-user` **must** use the same password value
- The `jwt-sign-key` should be generated once and kept stable across upgrades
- All secrets must be created in the same namespace as your Krateo installation
- Passwords are generated as URL-safe strings (no `/`, `+`, or `=` characters)

### List of Required Secrets

The three required secrets are:

1. **jwt-sign-key** - JWT signing key used by platform components
2. **krateo-db** - Database credentials for stack components (DB_USER, DB_PASS)
3. **krateo-db-user** - Database credentials for CNPG/database (username, password)

Refer to [Secrets Spec](../install-krateo/secrets) for complete details on secret structure, naming, and management best practices.

## Migration for Different Environments

:::note
This section shows how to **migrate from Krateo 2.7.0 to 3.0.0** with different infrastructure types. The `--type` flag determines how your migrated Krateo will be exposed to users.

For **fresh Krateo 3.0.0 installations** (not migration), see [Install and Upgrade](../install-krateo/installing-krateo).
:::

<Tabs groupId="migration-type">
  <TabItem value="nodeport" label="NodePort (Kind, Local)" default>

### NodePort (Kind, Local Development, Air-Gapped Clusters)

**Best for:** Local development with Kind, Minikube, or air-gapped Kubernetes deployments.

**Characteristics:**
- Services exposed on high-numbered ports (30000-32767) on each node
- No external load balancer required
- Direct node IP access needed

**Migration Steps:**

See [`krateoctl install migrate-full`](../../20-key-concepts/50-krateoctl/30-installation-migration.md#automated-migration) and [`krateoctl install apply`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#apply-command) for detailed command documentation.

```bash
# Step 1: Migrate from controller-based 2.7.0 to CLI-based management
krateoctl install migrate-full \
  --type nodeport \
  --namespace krateo-system \
  --output krateo.yaml

# Step 2: Apply to upgrade from 2.7.0 to 3.0.0
krateoctl install apply \
  --version 3.0.0 \
  --type nodeport \
  --namespace krateo-system
```

**Access Krateo after upgrade completes:**

The Kind cluster is configured to expose Krateo ports directly to localhost. Simply access:

```
http://localhost:30080
```

  </TabItem>

  <TabItem value="loadbalancer" label="LoadBalancer (Cloud)">

### LoadBalancer (Cloud Providers: AWS, GCP, Azure)

**Best for:** Cloud-native Kubernetes clusters with external load balancer support (EKS, GKE, AKS).

**Characteristics:**
- Automatic external load balancer provisioning (IP or hostname)
- Cloud provider handles load balancing and routing
- No domain required (use cloud provider's assigned hostname)

**Migration Steps:**

See [`krateoctl install migrate-full`](../../20-key-concepts/50-krateoctl/30-installation-migration.md#automated-migration) and [`krateoctl install apply`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#apply-command) for detailed command documentation.

```bash
# Step 1: Migrate from controller-based 2.7.0 to CLI-based management
krateoctl install migrate-full \
  --type loadbalancer \
  --namespace krateo-system \
  --output krateo.yaml

# Step 2: Apply to upgrade from 2.7.0 to 3.0.0
krateoctl install apply \
  --version 3.0.0 \
  --type loadbalancer \
  --namespace krateo-system
```

**For AWS:** AWS LoadBalancers expose a hostname instead of an IP address. Use the `--profile lb-hostname` flag to configure Krateo for hostname-based service discovery:

```bash
# For AWS migrations, add the lb-hostname profile
krateoctl install migrate-full \
  --type loadbalancer \
  --profile lb-hostname \
  --namespace krateo-system \
  --output krateo.yaml

krateoctl install apply \
  --version 3.0.0 \
  --type loadbalancer \
  --profile lb-hostname \
  --namespace krateo-system
```

**Access Krateo:**
```bash
# Get the external LoadBalancer IP/hostname
kubectl get svc krateo-frontend -n krateo-system

# External IP will be assigned by your cloud provider
# Access: http://<EXTERNAL-IP> or http://<EXTERNAL-HOSTNAME>
```

**Example outputs:**
```
# GCP/Azure (IP-based)
NAME              TYPE           CLUSTER-IP       EXTERNAL-IP
krateo-frontend   LoadBalancer   10.0.0.100       34.123.45.67

# AWS (hostname-based)
NAME              TYPE           CLUSTER-IP       EXTERNAL-IP
krateo-frontend   LoadBalancer   10.0.0.100       a1b2c3d4-123456789.elb.amazonaws.com
```

  </TabItem>

  <TabItem value="ingress" label="Ingress (Production)">

### Ingress (Cloud Providers with Custom Domains)

**Best for:** Production deployments using custom domains, certificate management via cert-manager, and HTTP/HTTPS routing.

**Characteristics:**
- Uses Kubernetes Ingress resource for routing
- Support for custom domains and TLS certificates
- Requires Ingress Controller (nginx-ingress, traefik, etc.)
- More control over routing and SSL/TLS

**Migration Steps:**

See [`krateoctl install migrate-full`](../../20-key-concepts/50-krateoctl/30-installation-migration.md#automated-migration) and [`krateoctl install apply`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#apply-command) for detailed command documentation.

```bash
# Step 1: Migrate from controller-based 2.7.0 to CLI-based management
krateoctl install migrate-full \
  --type ingress \
  --namespace krateo-system \
  --output krateo.yaml

# Step 2: Apply to upgrade from 2.7.0 to 3.0.0
krateoctl install apply \
  --version 3.0.0 \
  --type ingress \
  --namespace krateo-system
```

**Configure your domain:**

For production deployments, configure your DNS to point to your Ingress controller's IP address. See the [Install and Upgrade](../install-krateo/installing-krateo) guide for detailed domain configuration steps.

  </TabItem>

  <TabItem value="openshift" label="OpenShift">

### OpenShift (with OpenShift Profile)

**Best for:** OpenShift Container Platform with native security, RBAC, and route management.

**Migration Steps:**

OpenShift requires combining a `--type` with the `--profile openshift` flag. See [`krateoctl install migrate-full`](../../20-key-concepts/50-krateoctl/30-installation-migration.md#automated-migration) and [`krateoctl install apply`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#apply-command) for detailed command documentation.

```bash
# Step 1: Migrate from controller-based 2.7.0 to CLI-based management
krateoctl install migrate-full \
  --type loadbalancer \
  --profile openshift \
  --namespace krateo-system \
  --output krateo.yaml

# Step 2: Apply to upgrade from 2.7.0 to 3.0.0
krateoctl install apply \
  --version 3.0.0 \
  --type loadbalancer \
  --profile openshift \
  --namespace krateo-system
```

**For OpenShift on AWS:** If your OpenShift cluster runs on AWS, add the `lb-hostname` profile since AWS LoadBalancers expose hostname instead of IP:

```bash
# For OpenShift on AWS, combine both profiles
krateoctl install migrate-full \
  --type loadbalancer \
  --profile openshift,lb-hostname \
  --namespace krateo-system \
  --output krateo.yaml

krateoctl install apply \
  --version 3.0.0 \
  --type loadbalancer \
  --profile openshift,lb-hostname \
  --namespace krateo-system
```

This applies the OpenShift-specific profile which includes: **restricted security context** for pod security policies, **OpenShift RBAC** configurations, **Routes** for service exposure (handles networking automatically), and **OpenShift-native networking and security**. When combined with `lb-hostname`, it also configures hostname-based LoadBalancer service discovery for AWS environments.

  </TabItem>
</Tabs>

## Fresh Installations or Future Updates

After successful migration, upgrading to future 3.x versions is straightforward using [`krateoctl install plan`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#plan-command) and [`krateoctl install apply`](../../20-key-concepts/50-krateoctl/20-install-upgrade.md#apply-command):

```bash
# Preview the upgrade
krateoctl install plan --version 3.0.0 --namespace krateo-system --type <nodeport|loadbalancer|ingress> --diff-installed --diff-format table [--profile openshift]

# Apply the upgrade
krateoctl install apply --version 3.0.0 --namespace krateo-system --type <nodeport|loadbalancer|ingress> [--profile openshift] 
```

See [Install and Upgrade](../install-krateo/installing-krateo) for detailed instructions.

## Verify Migration Success

After completing the migration steps for your environment (one of: NodePort, LoadBalancer, Ingress, or OpenShift), verify that the migration was successful:

```bash
# Verify new Installation snapshot exists
kubectl get installation -n krateo-system

# Verify Krateo components are running
kubectl get pods -n krateo-system

# Verify no legacy resources remain
kubectl get krateoplatformops -n krateo-system || echo "Legacy resources cleaned up"

# Check the installation state snapshot
kubectl get installation krateoctl -n krateo-system -o yaml
```

**Expected outcomes:**

- `kubectl get installation` should show the `krateoctl` Installation resource
- `kubectl get pods` should show all Krateo 3.0.0 components running (eventsse, core-provider, composition-dynamic-controller, etc.)
- `kubectl get krateoplatformops` should return no resources (legacy controller cleaned up)
- The Installation snapshot contains the resolved components definition and installation version

If any of these checks fails, review the logs:

```bash
# Check krateoctl migration logs
kubectl logs -n krateo-system -l app=krateoctl --tail=50

# Check component status
kubectl get events -n krateo-system --sort-by='.lastTimestamp'
```

## About Pre-Upgrade Cleanup

The migration process uses standardized deployment configurations that handle both initial installations and version upgrades. These configurations are maintained in the [Krateo releases repository](https://github.com/krateoplatformops/releases).

### Pre-Upgrade Cleanup Process

Before applying the 3.0.0 configuration, the `pre-upgrade.yaml` script runs as a Kubernetes Job to safely remove deprecated components:

**What it removes:**
- Helm releases for: `eventsse`, `eventrouter`, `eventsse-etcd`, `sweeper`, `finops-composition-definition-parser`
- Persistent volumes associated with deprecated components (e.g., etcd data volumes from 2.7.0)

**Why it's needed:**
- Prevents version conflicts between old and new event/resource systems
- Clears storage allocated to deprecated components
- Ensures clean state before installing 3.0.0 components

**How it works:**
```bash
# Pre-upgrade runs automatically during migrate-full, but you can also run it manually:
kubectl apply -f pre-upgrade.yaml
kubectl wait --for=condition=complete job/uninstall-old-components -n krateo-system
```

## Configuration Reference

### Deprecated Components Removed During Migration

The pre-upgrade cleanup job automatically removes 2.7.0 components that are replaced in 3.0.0. See the [pre-upgrade cleanup script](https://github.com/krateoplatformops/releases/blob/main/pre-upgrade.yaml) for details. Components removed:

| Removed Component | Replacement | Reason |
| --- | --- | --- |
| **eventsse** | Events Stack Ingester/Presenter | Rewritten for better performance and OpenTelemetry support |
| **eventrouter** | Events Stack Ingester/Presenter | Merged into new events system architecture |
| **eventsse-etcd** | CNPG PostgreSQL | Dedicated etcd replaced with managed PostgreSQL database |
| **sweeper** | Database maintenance (Deviser) | Rolled into new database lifecycle management |
| **finops-composition-definition-parser** | (Reimplemented) | Refactored as part of FinOps stack redesign |

The cleanup job also removes persistent volumes (e.g., `etcd-data-eventsse-etcd-0`) to ensure a clean migration path.

## Getting Help

If you encounter issues during migration:

- Review the [krateoctl installation and migration documentation](../../20-key-concepts/50-krateoctl/30-installation-migration.md)
- Check the [Secrets Spec](../install-krateo/secrets) for configuration requirements
- Enable debug logging with `KRATEOCTL_DEBUG=1 krateoctl install migrate-full` for detailed troubleshooting
- Consult the [Install and Upgrade guide](../install-krateo/installing-krateo) for post-migration setup