---
sidebar_label: Krateo Composable Portal
description: Find out more about Krateo Composable Portal (KCP) concepts
---
# What is Krateo Composable Portal (KCP)?

Our concept of a Krateo Composable Portal refers to a portal that is built using a modular architecture. This design allows for the flexible combination of different functionalities or services to create a tailored experience for users. In the context of Krateo - a platform operations solution- the Composable Portal could serve as a central hub for managing, integrating, and deploying various platform services with a focus on customizability and scalability.

Our composable portal includes:

* Modular Design: Enables the addition, removal, or update of features and services without changing a single line of code.
* User-Centric Interface: Offers a user-friendly interface for both administrators and end-users to interact with the platform's capabilities.
* Integration Capabilities: Facilitates the integration with other services, APIs, and tools to extend the portal's functionality.
* Customization and Flexibility: Allows users to customize the portal to meet specific operational needs, reflecting the unique workflows and processes of their organization.
* Scalability: Designed to scale with the organization's needs, supporting an increasing number of services, users, or data volumes efficiently.

It is important to note that Krateo does not have its own separate backend, but rather relies entirely on Kubernetes. To clarify, Krateo is an extension of Kubernetes and is not a standalone software that runs on Kubernetes. Krateo's Composable Portal serves as a graphical interface to interact with Kubernetes.

KCP consists of the following features:
* krateo-frontend
* authn
* bff
* backend

## krateo-frontend

Our frontend (https://github.com/krateoplatformops/krateo-frontend) can be defined as a data-driven meta-framework, but what does that mean exactly? Essentially, we created an architecture that ensures a consistent user experience by design. This is achieved by pre-packaging graphic elements and layouts that can be used and composed to build the portal pages.

It's important to note that the Krateo portal should not be seen as a black box, but rather as a central point for collecting valuable information for the platform's users, which is distributed across different systems.

Another important requirement is that the portal must be easily extendable without requiring any coding. All efforts should be focused on understanding how to display services in the catalog, rather than on maintaining forms for collecting information.

In summary, the Krateo frontend queries the backend (Kubernetes) via the backend for the frontend to know which layouts and graphic elements it must process with client-side runtime rendering.

## bff

A critical architectural choice behind Krateo is that there must be no channel-specific logic querying the backend. In other words, what is displayed and implemented via the portal must be exactly reproducible via the Kubernetes CLI (aka kubectl).

This ensures that all business logic is centralized.

The BFF (Backend for Frontend) repository is designed to serve as an intermediary layer between the Portal and Kubernetes APIs.

## backend

The task of bff (backend for frontend) is to declaratively provide how the graphic elements of krateo-frontend must be enhanced.

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

## authn

Kubernetes can provide different authentication modes (https://kubernetes.io/docs/reference/access-authn-authz/authentication/#authentication-strategies), but two are always present by default: authentication via token or certificate.

The first is theoretically used for access by 'technical' users, while the second is used by 'physical' users. We decided to use the second because it is conceptually more correct.

However, we wanted to ensure the user could use their identity provider, so we decided to act as a proxy for external authentication systems.

In the case of successful authentication, the authn-service generates a certificate signed with the CA of the Kubernetes cluster. Not only is the entire certificate generated, but the entire kubeconfig, which the user can download to query Krateo directly with the kubectl.

The API _strategies_ lists all the authentication strategie configured in the cluster.

Different authentication strategies are currently available:

### Basic authentication

```yaml
---
apiVersion: v1
kind: Secret
type: kubernetes.io/basic-auth
metadata:
  name: cyberjoker-password
  namespace: demo-system
stringData:
  password: "123456"
---
apiVersion: basic.authn.krateo.io/v1alpha1
kind: User
metadata:
  name: cyberjoker
  namespace: demo-system
spec:
  displayName: Cyber Joker
  avatarURL: https://i.pravatar.cc/256?img=70
  groups:
    - devs
  passwordRef:
    namespace: demo-system
    name: cyberjoker-password
    key: password
```

### LDAP authentication

```yaml
---
apiVersion: v1
kind: Secret
type: kubernetes.io/basic-auth
metadata:
  name: cyberjoker-password
  namespace: demo-system
stringData:
  password: "123456"
---
apiVersion: basic.authn.krateo.io/v1alpha1
kind: User
metadata:
  name: cyberjoker
  namespace: demo-system
spec:
  displayName: Cyber Joker
  avatarURL: https://i.pravatar.cc/256?img=70
  groups:
    - devs
  passwordRef:
    namespace: demo-system
    name: cyberjoker-password
    key: password
```

### Oauth authentication

```
apiVersion: v1
data:
  clientSecret: XX
kind: Secret
metadata:
  name: github
  namespace: krateo-system
type: Opaque
---
apiVersion: oauth.authn.krateo.io/v1alpha1
kind: GithubConfig
metadata:
  name: github-example
spec:
  organization: krateoplatformops
  clientID: "YY"
  clientSecretRef:
    name: github
    namespace: demo-system
    key: clientSecret
  authURL: https://github.com/login/oauth/authorize
  tokenURL: https://github.com/login/oauth/access_token
  redirectURL: http://localhost:8888/github/grant
  scopes:
  - read:user
  - read:org
```yaml
