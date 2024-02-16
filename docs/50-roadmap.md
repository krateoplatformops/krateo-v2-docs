---
sidebar_label: Roadmap
Description: See what's on the roadmap of Krateo PlatformOps and find out more about the latest releases
---

# Krateo PlatformOps Roadmap

Over a series of releases, Krateo PlatformOps's maintainers intend to establish and settle into a predictable, but yet to be determined release cadence.

:::caution
This roadmap is subject to change at any time, for the most up to date information, please see the [GitHub Project](https://github.com/orgs/krateoplatformops/projects)
:::

## 2.0.0 - Q1 2024

__Status:__ In progress

### Krateo Composable Operations

| Name | Type | Description |
| ---- | ---- | ----------- |
| Composition redesign | feature | Krateo Composable Operations is leveraging Helm as a way to compose Kubernetes Operators manifest. |

### Krateo Composable Portal

| Name | Type | Description |
| ---- | ---- | ----------- |
| Frontend redesign | feature | Krateo Composable Portal redesign to be fully extensible in a declarative way |
| Backend extension | feature | Ability to integrate any backend without modifying source code of the Portal |

### Krateo Composable FinOps

| Name | Type | Description |
| ---- | ---- | ----------- |
| FinOps Datamodel | feature | Implementation of [FOCUS](https://focus.finops.org/) specification in Kubernetes
| Azure FinOps Exporter | feature | Prometheus exporter to expose Billing metrics from
| FinOps Scraper | feature | Scraper that pushes metrics to FinOps datalake

## Criteria for 2.0.0 Release

Maintainers will consider cutting a stable 2.0.0 release once:

* Confident in API stability. (No further breaking changes anticipated.)
* No critical, "show-stopping" bugs remaining in the backlog.
* Observing evidence of successful community adoption (of beta releases) in production environments
