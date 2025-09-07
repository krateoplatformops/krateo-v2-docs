# action-button-guide

## Prerequisites

NB: This guide depends on [Simple page guide](./10-simple-page-guide.md) complete it first.

## Where we left off

We have created a `Button` and a `Page` that references it. In order to see display the page we created a `NavMenuItem` that navigates to it.

## Next steps

We will update the `Button` to trigger an action on click, there are different types of actions that can be triggered by a button, in this guide we will use the `openDrawer` action, more info about actions can be found in [docs](../20-key-concepts/10-frontend.md)

NB: the namespace and the name of the `Button` is the same as the one used in the [Simple page guide](../simple-page/simple-page.md), so beware that we will overwrite the one created in the previous guide.

```sh
cat <<EOF | kubectl apply -f -
kind: Button
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-button
  namespace: simple-guide
spec:
  widgetData:
    icon: fa-sun
    label: I was updated again!!!
    clickActionId: openDrawer-action-id # <- this needs to match the id of an action declared below in spec.actions
    actions: 
      openDrawer:
        - id: openDrawer-action-id 
          resourceRefId: paragraph-id # <- this needs to match the id of a resource declared below in spec.resourcesRefs
          type: openDrawer
          title: Composition form
          size: large
  resourcesRefs:
    items:
      - id: paragraph-id
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: simple-guide-paragraph
        namespace: simple-guide
        resource: paragraphs
        verb: GET
---
kind: Paragraph
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-paragraph
  namespace: simple-guide
spec:
  widgetData:
    text: "This is a paragraph"
EOF
```

Try clicking the button, you should see a drawer with the content of the `Paragraph` widget we declared in the `resourcesRefs` section.

![drawer-paragraph](/img/action-button-guide/01_drawer_paragraph.gif)

## Lets make a step forward

Le's introduce a new widget, the `Form` widget, this widget can be used to create a new resource in the cluster.

```sh
cat <<EOF | kubectl apply -f -
kind: Button
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-button
  namespace: simple-guide
spec:
  widgetData:
    icon: fa-sun
    label: I open a drawer with a form
    clickActionId: openDrawer-action-id # <- this needs to match the id of an action declared below in spec.actions
    actions: 
      openDrawer:
        - id: openDrawer-action-id 
          resourceRefId: form-id # <- this needs to match the id of a resource declared below in spec.resourcesRefs
          type: openDrawer
          title: Composition form
          size: large
  resourcesRefs:
    items:
      - id: form-id
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: simple-guide-form
        namespace: simple-guide
        resource: forms
        verb: GET
EOF
```

```sh
kubectl apply -f - <<'YAML'
kind: Form
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-form
  namespace: simple-guide
spec:
  widgetData:
    stringSchema: |
      {
        "type": "object",
        "properties": {
          "name": {
            "type": "string",
            "title": "Pod Name",
            "description": "The name of your Nginx pod"
          }
        },
        "required": ["name"]
      }
    submitActionId: submit-action-id
    actions:
      rest:
        - id: submit-action-id
          resourceRefId: resource-ref-1
          type: rest
          payloadKey: spec
          payloadToOverride:
            - name: metadata.name
              value: '${ .name }'
          payload:
            apiVersion: v1
            kind: Pod
            metadata:
              name: "aa"
            spec:
              containers:
                - image: 'nginx:latest'
                  name: nginx
                  ports:
                    - containerPort: 80
  resourcesRefs:
    items:
      - id: resource-ref-1
        apiVersion: v1
        resource: pods
        name: my-pod-name
        namespace: krateo-system
        verb: POST
YAML
```

NB: this is a different file that the previous one that uses the same `Button` widget but with a different widget referenced in the action, so it will overwrite the previous one.

Clicking the button should open a drawer with a form, fill the form and click submit, you should see a new pod created in the cluster.

![drawer-form](/img/action-button-guide/02_drawer_form.png)

### how it works

The `Form` rest action is used to create a new resource in the cluster, in this example it uses a static stringSchema, usually this schema or a resource is retrieved from the cluster using a restAction.

The `payloadToOverride` is used to override the payload of the `rest` action with the value from the form.
The `payloadKey` section is used to specify the key of the payload to override, in this case `spec`