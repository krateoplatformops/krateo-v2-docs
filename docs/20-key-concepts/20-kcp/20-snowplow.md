# `snowplow`

Snowplow is a web service that plays a key role within the suite of components that make up Krateo PlatformOps. 

It serves multiple purposes, primarily acting as a bridge between Krateo's custom resources and the UI. By enabling a dynamic and declarative approach to defining UI components and layouts, Snowplow ensures that the interface is interpreted and rendered seamlessly by Krateo Frontend.

It handles on-demand resolution of the `RESTAction` custom resource and all Krateo Frontend `Widgets` custom resources.

## Learn More

### User Guide

- [`Endpoint` reference](./22-snowplow-endpoints.md)
- [`RESTAction` reference](./21-snowplow-RESTAction.md)
- [Understanding the `Widget` Custom Resource](./23-snowplow-widgets.md)

### Examples

- [RESTAction: list _cluster namespaces_](https://github.com/krateoplatformops/snowplow/blob/0.20.5/howto/restactions/example-cluster-namespaces.md)
- [RESTAction: invoke _external API_](https://github.com/krateoplatformops/snowplow/blob/0.20.5/howto/restactions/example-external-api.md)