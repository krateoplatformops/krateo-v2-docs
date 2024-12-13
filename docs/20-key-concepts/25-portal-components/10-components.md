# Krateo Composable Portal components

*Krateo PlatformOps* leverages a declarative approach to design components in *Krateo Composable Portal*. These components are divided into two groups:
- Collections: layout components that can contain other layouts and/or widgets
- Widgets: graphical elements that can be feeded via API

Each *Collection* contains a reference to other objects, building a dependency structure that is resolved by the backend. At each node of the structure, the backend analyzes if the authenticated user can retrieve that node.

References can be built iterating on an API response which can be a Kubernetes API or any other external API. Whenever the API request is related to a Kubernetes API, the backend propagates the authenticated user.

> Every component is namespace-scoped.

## Collections

A *Collection* is a layout component. In *Krateo PlatformOps* we provide two kinds of *Collections*:
- **Kind: Collections**: contains a static list of references to other *Collections* or *Widgets*
- **Kind: CollectionIterators**: contains a dynamic list of references to other *Collections* or *Widgets* which can be created iterating on an API response.

### Collection

This is the manifest of a Collection:

```yaml
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: templates-column
  namespace: krateo-system
spec:
  type: column
  propsRef:
    name: templates-column
    namespace: krateo-system
widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: templates-column-row
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collectioniterators
    name: compositions-column
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: widgets
    name: compositiondefinition-card
    namespace: krateo-system
```

The main structure is based on the following properties:

| Property     | Description  | 
|--------------|--------------|
| type         | Identifies the layout to leverage: it can be a *row*, a *column* or a *grid*  |
| propsRef     | Reference to a ConfigMap that contains properties that are not shown in the component |
| widgetsRefs  | Array of components references that will fill the component layout: each array element must specify *apiVersion*, *resource*, *name* and *namespace* of the element to include in the component  |

Based on the *spec.type* value, different *spec.propsRef* can be explicited.

### CollectionIterator

This is the manifest of a CollectionIterator:

```yaml
apiVersion: templates.krateo.io/v1alpha1
kind: CollectionIterator
metadata:
  name: compositiondefinitions-grid
  namespace: krateo-system
spec:
  type: grid
  propsRef:
    name: compositiondefinitions-grid
    namespace: krateo-system
  widgetsRefs:
  - iterator: .allCompositionDefinitions.items
    template:
      apiVersion: templates.krateo.io/v1alpha1
      resource: widgets
      name: ${ "template-" + .metadata.name + "-card" }
      namespace: ${ .metadata.namespace }
  api:
  - name: allCompositionDefinitions
    path: "/list?category=defs"
    verb: GET
    endpointRef:
      name: bff-endpoint
      namespace: krateo-system
    headers:
    - 'Accept: application/json'
```

The main structure is based on the following properties:

| Property     | Description  | 
|--------------|--------------|
| type         | Identifies the layout to leverage: it can be a *row*, *column*, *grid*, *tablist* or *tabpane*  |
| propsRef     | Reference to a ConfigMap that contains properties that are not shown in the component |
| widgetsRefs  | Array of components references that will fill the component layout |
! api          | API to call in order to feed *widgetsRefs.iterator* |

Based on the *spec.type* value, different *spec.propsRef* can be explicited.

The *widgetsRefs* array is able to iterate on the API response and can replace placeholders in values obtained from the single response element on which the iteration is looping.

### Types

Regardless if the layout component is a *Collection* or *CollectionIterator*, different types can be adopted.

#### Row

This is the manifest of a Collection of *spec.type=row*:

```yaml
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: templates-row
  namespace: krateo-system
spec:
  type: row
  widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: templates-row-column
    namespace: krateo-system
```

Type *row* doesn't have any *propsRef*.

#### Column

This is the manifest of a Collection of *spec.type=column*:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: templates-row-column
  namespace: krateo-system
data:
  width: "24"
---
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: templates-row-column
  namespace: krateo-system
spec:
  type: column
  propsRef:
    name: templates-row-column
    namespace: krateo-system
  widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collectioniterators
    name: compositiondefinitions-grid
    namespace: krateo-system
```

Type *column* supports *propsRef*:
- *width*: a full-width column is max 24. It is possible to have multiple columns in a row but the widths sum must be 24, i.e. column-1 with width 12 and column-2 with width 12 will divide in half a row (12 is 50% of 24).

#### Grid

This is the manifest of a CollectionIterator of *spec.type=grid*:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: compositiondefinitions-grid
  namespace: krateo-system
data:
  width: "8"
---
apiVersion: templates.krateo.io/v1alpha1
kind: CollectionIterator
metadata:
  name: compositiondefinitions-grid
  namespace: krateo-system
  annotations:
    "krateo.io/connector-verbose": "true"
spec:
  type: grid
  propsRef:
    name: compositiondefinitions-grid
    namespace: krateo-system
  widgetsRefs:
  - iterator: .allCompositionDefinitions.items
    template:
      apiVersion: templates.krateo.io/v1alpha1
      resource: widgets
      name: ${ "template-" + .metadata.name + "-card" }
      namespace: ${ .metadata.namespace }
  api:
  - name: allCompositionDefinitions
    path: "/list?category=defs"
    verb: GET
    endpointRef:
      name: bff-endpoint
      namespace: krateo-system
    headers:
    - 'Accept: application/json'
```

Type *gird* supports *propsRef*:
- *width*: the width of single cell of the grid. A full-width column is max 24. If the grid should show 4 cells per grid row, the width should be 6 (6x4=24).

#### Tablist

This is the manifest of a Collection of *spec.type=tablist*:

```yaml
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: composition-fireworksapp-tablist
  namespace: krateo-system
spec:
  type: tablist
  widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-overview
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-compositionstatus
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-applicationstatus
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-events
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-terminal
    namespace: krateo-system
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-yamlviewer
    namespace: krateo-system
```

Type *tablist* doesn't have any *propsRef*.

#### TabPane

This is the manifest of a Collection of *spec.type=tabpane*:

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: composition-fireworksapp-tabpane-overview
  namespace: krateo-system
data:
  label: Overview
---
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: composition-fireworksapp-tabpane-overview
  namespace: krateo-system
spec:
  type: tabpane
  propsRef:
    name: composition-fireworksapp-tabpane-overview
    namespace: krateo-system
  widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: collections
    name: composition-fireworksapp-tabpane-overview-row
    namespace: krateo-system
```

Type *tabpane* supports *propsRef*:
- *label*: label to show in the tab.

#### Panel

This is the manifest of a Collection of *spec.type=panel*:

```yaml
apiVersion: templates.krateo.io/v1alpha1
kind: Collection
metadata:
  name: composition-fireworksapp-tabpane-overview-row-column-1-panel
  namespace: krateo-system
spec:
  type: panel
  widgetsRefs:
  - apiVersion: templates.krateo.io/v1alpha1
    resource: widgets
    name: composition-fireworksapp-tabpane-overview-row-column-1-panel-paragraph
    namespace: krateo-system
```

Type *panel* doesn't have any *propsRef*.

## Widgets

A *Widget* is a graphical element that can be feeded via API. In *Krateo PlatformOps* we provide three kinds of *Widgets*:

### Widget
### Form
### CustomForm
