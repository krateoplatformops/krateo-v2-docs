# Backend

The task of backend is to declaratively provide how the graphic elements of krateo-frontend must be enhanced.

👇 Below is an example snippet:

```yaml
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: typicode-endpoint
  namespace: demo-system
stringData:
  server-url: https://jsonplaceholder.typicode.com
---
apiVersion: templates.krateo.io/v1alpha1
kind: Widget
metadata:
  name: external-api
  namespace: demo-system
spec:
  type: card
  propsRef:
    name: card-props
    namespace: demo-system
  actions:
  - template:
      apiVersion: templates.krateo.io/v1alpha1
      resource: forms
      name: fireworksapp
      namespace: demo-system
  - template:
      apiVersion: templates.krateo.io/v1alpha1
      resource: widgets
      name: external-api
      namespace: demo-system
  app:
    template:
      title: ${ .api2.items[0] | (.name  + " -> " + .email) }
      content: ${ .api2.items[0].body }
  api:
  - name: api1
    path: "/todos/1"
    endpointRef:
      name: typicode-endpoint
      namespace: demo-system
    verb: GET
    headers:
    - 'Accept: application/json'
  - name: api2
    dependOn: api1
    path: ${ "/todos/" + (.api1.id|tostring) +  "/comments" }
    endpointRef:
      name: typicode-endpoint
      namespace: demo-system
    verb: GET
    headers:
    - 'Accept: application/json'
 ```

A _Widget_ is a Krateo graphic component composed of various properties (_spec.app_ section).

The widget includes call2actions such as deleting the cardTemplate itself (via the trash can button). Any action can be declared under the _spec.actions_ section.

Properties can be filled in manually or obtained by querying an API.

This API can represent a further call to the Kubernetes server API (and in this case the backend will make a call using the client certificate) or to an external API (and in this case it will use the explicit credentials).

The backend can also make a sequence of API calls and can also iterate an array arrived in response to the call.

Further examples can be found here: https://github.com/krateoplatformops/backend/tree/main/testdata.

## Summary

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API](#api)


## Overview

It provides all the APIs necessary for the Krateo Frontend.

This is an extension API server to work with the aggregation layer that allows the Kubernetes apiserver to be extended with Krateo additional APIs, which are not part of the core Kubernetes APIs.

## Architecture

![Krateo Backend](/img/backend-architecture.png)

## API


### List of all available APIs

To get the list of all available APIs:

```sh
$ kubectl api-resources --api-group=templates.krateo.io
```

### OpenAPI

To get the OpenAPI definitions for all available APIs:

```sh
$ kubectl get --raw /openapi/v3/apis/templates.krateo.io/v1alpha1
```

if you have a viewing tool you can redirect the output to a file:

```sh
$ kubectl get --raw /openapi/v3/apis/templates.krateo.io/v1alpha1 > krateo-backend-api.json
```

and then open the saved file with the tool.

