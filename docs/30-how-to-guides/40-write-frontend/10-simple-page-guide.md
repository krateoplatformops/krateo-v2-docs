# simple-page-guide

By following this guide you'll learn how to:

- create a Button widget
- Create a page widget that show the Button
- Create a link in the sidebar to navigate the page

## Prerequisites

### A cluster running krateo v2.5.1+

For testing/demo purposed a new cluster can be crated using kind ([more info](https://docs.krateo.io/quickstart)) by running:

```sh
curl -L https://github.com/krateoplatformops/krateo-v2-docs/releases/latest/download/kind.sh | sh
```

Launch this command to wait the Krateo platform to initialize

```sh
kubectl wait krateoplatformops krateo --for condition=Ready=True --namespace krateo-system --timeout=500s
```

When ready it will print:

```sh
krateoplatformops.krateo.io/krateo condition met
```

From now on you should be able to reach the Krateo's frontend at `http://localhost:30080`

#### Login

The credential to login this test cluster are
username: `admin`
password: created during init, retrievable running `kubectl get secret admin-password  -n krateo-system -o jsonpath="{.data.password}" | base64 -d` (beware of trailing `%` symbol in the terminal, it is not part of the password)

![login-page](/img/quickstart/01_login.png)

#### The Krateo UI

After logging in you will be presented the Krateo's starter UI
![dashboard-page](/img/quickstart/04_dashboard_1blueprint_true.png)

### Create a namespace for our widgets.

```sh
kubectl create ns simple-guide
```

## Creating a Button widget.

The creation of a Button widget is as simple as applying a yaml a kind of type Button with the required properties inside `spec.widgetData`. (widgetData validation is run when doing an apply to make sure required properties are present)

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
    label: My Custom Button
    clickActionId: none
    actions: {}
EOF
```

To verify the widget has been correctly created, run

```sh
kubectl get button -n  simple-guide
```

## Showing the Button widget in a new Page

The Button widget is correctly created in the cluster, but in order for it to be visible is needs to be references by another visible widget.

We will insert the `Button` in a new `Page` widget.

```sh
cat <<EOF | kubectl apply -f -
kind: Page
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-page
  namespace: simple-guide
spec:
  widgetData:
    allowedResources:
      - buttons
    items:
      - resourceRefId: simple-button-id # <- this need to match the id of and item in spec.resourcesRefs
  resourcesRefs:
    items:
      - id: simple-button-id
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: simple-guide-button # <- matches metadata.name of the button widgetw e created
        namespace: simple-guide
        resource: buttons
        verb: GET
EOF
```

by examining the previous yaml we can see that we referenced our Button by name in `spec.resourcesRefs.items[0]` and added an id (`simple-button-id`).

Declaring resurces in `spec.resourcesRefs` is the way Krateo knows to load these widgets, they can be declare manually like in our case or dynamically (see `resourcesRefsTemplate` section in [docs](../../20-key-concepts/10-frontend.md) for more info.) This concept is generic to any widget and is used to load other resources.

## Where is the Page?

We have created a `Button` and a `Page` that references the `Button` but nothing is yet visible in the UI.

### Creating a new link in the sidebar

We need a way to navigato to this page, to do so we will create a `NavMenuItem` that point reference the newly created page by running

```sh
cat <<EOF | kubectl apply -f -
kind: NavMenuItem
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-nav-menu-item
  namespace: simple-guide
spec:
  widgetData:
    allowedResources:
      - pages
    resourceRefId: page-id # <- reference the id of a widget declared below in spec.resourcesRefs
    label: Guide New Page
    icon: fa-sun
    path: /simple-guide
    order: 90 # <- this is used to order the item in the menu, anything with a lower order will be placed before this one
  resourcesRefs:
    items:
      - id: page-id
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: simple-guide-page # <- matches metadata.name of the page widget we created in the previous step
        namespace: simple-guide
        resource: pages
        verb: GET
EOF
```

Now refreshing the page will show the newly navigation item in the sidebar
![sidebar-item](/img/simple-page-guide/01_sidebar_item.png)

### Visiting the new page

Clicking to the new sidebar menu will navigate to the path declared in the `NavMenuItem` `spec.widgetData.path` property and finally display our `Button` widget!

![simple-guide-page](/img/simple-page-guide/02_simple_guide_page.png)

## Recap

We created a hierarchy or widget declaratively
`NavMenuItem` -> `Page` -> `Button`

- Widgets load other widgets via by referencing them inside `spec.resourcesRefs` and display them by using referencing the `resourcesRef` id inside `spec.widgetData`

## Testing the declarative nature of widgets

Try editing the `spec.label` prop of the yaml file in `guide-simple-button.yaml` or `guide-simple-navmenuitem.yaml` and apply the changes.

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
    label: I was updated
    clickActionId: none
    actions: {}
---
kind: NavMenuItem
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: simple-guide-nav-menu-item
  namespace: simple-guide
spec:
  widgetData:
    allowedResources:
      - pages
    resourceRefId: page-id # <- reference the id of a widget declared below in spec.resourcesRefs
    label: Updated link
    icon: fa-sun
    path: /simple-guide
    order: 90 # <- this is used to order the item in the menu, anything with a lower order will be placed before this one
  resourcesRefs:
    items:
      - id: page-id
        apiVersion: widgets.templates.krateo.io/v1beta1
        name: simple-guide-page # <- matches metadata.name of the page widget we created in the previous step
        namespace: simple-guide
        resource: pages
        verb: GET
EOF
```

After a refresh of the page you'll be able to see the changes reflected in the UI

![simple-guide-page-updated](/img/simple-page-guide/03_simple_guide_page_updated.png)

## Next steps

A `Button` that does nothing is not very useful, in the next guide we will see how to update the `Button` to trigger an action on click.

Next: [Action button](./11-action-button-guide.md)