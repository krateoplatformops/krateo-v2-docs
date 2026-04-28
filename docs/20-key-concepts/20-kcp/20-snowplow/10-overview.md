---
description: Snowplow
sidebar_label: Snowplow
---

# `snowplow`

Snowplow is a web service that plays a key role within the suite of components that make up Krateo PlatformOps. 

It serves multiple purposes, primarily acting as a bridge between Krateo's custom resources and the UI. By enabling a dynamic and declarative approach to defining UI components and layouts, Snowplow ensures that the interface is interpreted and rendered seamlessly by Krateo Frontend.

It handles on-demand resolution of the `RESTAction` custom resource and all Krateo Frontend `Widgets` custom resources.

## Technical Reference

### Environment Variables

| Name | Description | Default |
| :--- | :--- | :--- |
| `PORT` | HTTP server port | `8081` |
| `DEBUG` | Enable debug logging | `false` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `DB_PARAMS` | Extra connection parameters (e.g., `sslmode=disable`) | - |
| `DB_READY_TIMEOUT` | Max wait for PostgreSQL readiness | `2m` |

---

## Learn More

### Developer Guide

- [Building `snowplow`](https://github.com/krateoplatformops/snowplow/blob/main/howto/developer-guide.md)
- [ADR: Decoupling `authn` from `snowplow` for Testing and Operations](https://github.com/krateoplatformops/snowplow/blob/main/howto/decoupling-authn-from-snowplow-for-testing.md)

### User Guide

- [`Endpoint` reference](./30-endpoints.md)
- [`RESTAction` reference](./20-rest-actions.md)
- [Understanding the `Widget` Custom Resource](./40-widgets.md)
- [Installing `snowplow` on Kind](https://github.com/krateoplatformops/snowplow/blob/main/howto/install.md)

### Examples

- [RESTAction: list _cluster namespaces_](https://github.com/krateoplatformops/snowplow/blob/main/howto/restactions/example-cluster-namespaces.md)
- [RESTAction: invoke _external API_](https://github.com/krateoplatformops/snowplow/blob/main/howto/restactions/example-external-api.md)
