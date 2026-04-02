---
description: Snowplow
sidebar_label: Snowplow
---

# `snowplow`

Snowplow is a web service that plays a key role within the suite of components that make up Krateo PlatformOps. 

It serves multiple purposes, primarily acting as a bridge between Krateo's custom resources and the UI. By enabling a dynamic and declarative approach to defining UI components and layouts, Snowplow ensures that the interface is interpreted and rendered seamlessly by Krateo Frontend.

It handles on-demand resolution of the `RESTAction` custom resource and all Krateo Frontend `Widgets` custom resources.

## Learn More

### Developer Guide

- [Building `snowplow`](https://github.com/krateoplatformops/snowplow/blob/main/howto/developer-guide.md)
- [ADR: Decoupling `authn` from `snowplow` for Testing and Operations](https://github.com/krateoplatformops/snowplow/blob/main/howto/decoupling-authn-from-snowplow-for-testing.md)

### User Guide

- [`Endpoint` reference](https://github.com/krateoplatformops/snowplow/blob/main/howto/endpoints.md)
- [`RESTAction` reference](https://github.com/krateoplatformops/snowplow/blob/main/howto/restactions.md)
- [Understanding the `Widget` Custom Resource](https://github.com/krateoplatformops/snowplow/blob/main/howto/widgets.md)
- [Installing `snowplow` on Kind](https://github.com/krateoplatformops/snowplow/blob/main/howto/install.md)

### Examples

- [RESTAction: list _cluster namespaces_](https://github.com/krateoplatformops/snowplow/blob/main/howto/restactions/example-cluster-namespaces.md)
- [RESTAction: invoke _external API_](https://github.com/krateoplatformops/snowplow/blob/main/howto/restactions/example-external-api.md)
