---
description: Migrating Krateo PlatformOps from v2.7.0 to v3.0.0rc
sidebar_label: Migrating Krateo PlatformOps from v2.7.0 to v3.0.0rc
---

# Migrating Krateo PlatformOps from v2.7.0 to v3.0.0rc

1. [Installation Migration](#installation-migration)
2. [RESTAction Migration Guide: Client-Side to Server-Side Pagination](#overview)
3. [EventList Migration Guide: eventsse / eventrouter to events-presenter](#overview-1)

---

# Installation Migration

`krateoctl` provides two commands for moving a legacy Krateo installation to the new `krateo.yaml` workflow:

- `krateoctl install migrate` for a manual migration
- `krateoctl install migrate-full` for an automated cutover

Both commands are designed for Krateo 2.7.0 installations managed by the installer controller.

If you are looking for the regular install or upgrade workflow, see [Install and Upgrade](../install-krateo/installing-krateo).

Secrets are managed separately from the migration workflow. Use Vault or create the required Kubernetes Secrets manually, then follow the [Secrets Spec](../install-krateo/secrets).

## Table Of Contents

- [Which Command Should I Use?](#which-command-should-i-use)
- [Automated Migration](#automated-migration)
- [Manual Migration](#manual-migration)
- [Inspect the Snapshot](#inspect-the-snapshot)
- [Notes](#notes)

## Which Command Should I Use?

Use `migrate` when you want to:

- generate `krateo.yaml`
- review the converted configuration before applying it
- run `install plan` and `install apply` yourself

Use `migrate-full` when you want `krateoctl` to:

- generate `krateo.yaml`
- apply the new configuration
- remove the legacy `KrateoPlatformOps` resource
- uninstall the old installer Helm releases

## Automated Migration

`krateoctl install migrate-full` performs the same conversion, then carries out the migration steps automatically.

### Usage

```sh
krateoctl install migrate-full [FLAGS]
```

### Flags

- `--type` installation type to use for the generated defaults: `nodeport`, `loadbalancer`, or `ingress`
- `--namespace` namespace containing the legacy `KrateoPlatformOps` resource, default `krateo-system`
- `--name` legacy resource name, default `krateo`
- `--output` optional path to save the generated `krateo.yaml`
- `--installer-namespace` namespace where the old installer is deployed, default the same as `--namespace`
- `--installer-release` Helm release name for the installer chart, default `installer`
- `--installer-crd-release` Helm release name for the installer CRD chart, default `installer-crd`
- `--force` overwrite the output file if it already exists
- `--debug` enable debug logging, or set `KRATEOCTL_DEBUG`

### What It Does

1. Reads the legacy `KrateoPlatformOps` resource from the cluster.
2. Converts it into a new `krateo.yaml` document.
3. Optionally writes the generated file to disk when `--output` is provided.
4. Scales the old installer down.
5. Applies the new configuration automatically.
6. Deletes the legacy `KrateoPlatformOps` resource.
7. Uninstalls the old installer Helm releases.

### Examples

```sh
# Run the full automatic migration
krateoctl install migrate-full --type nodeport
```

```sh
# Run the full migration and also save the generated file
krateoctl install migrate-full --type nodeport --output ./krateo.yaml
```

```sh
# Run the migration with custom Helm release names
krateoctl install migrate-full \
  --type ingress \
  --installer-release my-installer \
  --installer-crd-release my-installer-crd
```

## Manual Migration

`krateoctl install migrate` reads a legacy `KrateoPlatformOps` resource from the cluster, converts it into the new configuration format, and writes the result to disk.

### Usage

```sh
krateoctl install migrate [FLAGS]
```

### Flags

- `--type` installation type to use for the generated defaults: `nodeport`, `loadbalancer`, or `ingress`
- `--namespace` namespace containing the legacy `KrateoPlatformOps` resource, default `krateo-system`
- `--name` legacy resource name, default `krateo`
- `--output` path for the generated file, default `krateo.yaml`
- `--force` overwrite the output file if it already exists
- `--debug` enable debug logging, or set `KRATEOCTL_DEBUG`

### What It Does

1. Connects to the cluster using the current kubeconfig.
2. Reads the legacy `KrateoPlatformOps` custom resource.
3. Converts its spec into a new `krateo.yaml` document.
4. Adds the default components definition for the selected installation type.
5. Writes the generated file to disk and stops.

### Typical Workflow

1. Run `krateoctl install migrate`.
2. Review the generated `krateo.yaml`.
3. Run `krateoctl install plan` to preview the new installation.
4. Run `krateoctl install apply` when you are ready to switch over.
5. Remove the old controller and legacy `KrateoPlatformOps` resource manually when the migration is complete.

### Inspect the Snapshot

After `install apply` or `migrate-full`, `krateoctl` stores the resolved installation snapshot as an `Installation` resource named `krateoctl` in the install namespace.

You can inspect it with:

```sh
kubectl get installation krateoctl -n krateo-system -o yaml
```

This is the easiest way to review what was actually persisted after the installation or migration finished.

### Examples

```sh
# Generate krateo.yaml from the default legacy resource
krateoctl install migrate
```

```sh
# Generate a file for a specific installation type
krateoctl install migrate --type ingress --output ./krateo.yaml
```

```sh
# Generate the file, then review and apply it manually
krateoctl install migrate --type nodeport
krateoctl install plan --config ./krateo.yaml --type nodeport
krateoctl install apply --config ./krateo.yaml --type nodeport
```

## Notes

- `migrate` is the safer choice when you want to review the generated configuration first.
- `migrate-full` is the faster choice when you want `krateoctl` to handle the cutover end-to-end.
- If you are unsure which installation type to use, start with the one that matches your current environment: `nodeport`, `loadbalancer`, or `ingress`.

---

# RESTAction Migration Guide: Client-Side to Server-Side Pagination

## Overview

This guide covers the migration of `RESTAction` resources that previously queried the Kubernetes API directly and implemented pagination client-side (via JQ filters), to the new pattern that leverages the `resources-presenter` service for server-side, cursor-based pagination.

### Compatibility

The new `resources-presenter` APIs do not limit or break any existing RESTAction in any way. The old Kubernetes API-based approach and client-side pagination remain fully functional, and while migration is strongly recommended for performance reasons, it is **not** mandatory. Old APIs will continue to be available indefinetly since they are Kubernetes' APIs. The JQ pagination instead is **deprecated**, and could be removed in a future release. Currently, removal is not planned. However, we suggest migrating from JQ pagination.

### Migration Motivations

The old approach:
1. Called the Kubernetes API to fetch **all** resources across all namespaces, which translated in a very high number of calls.
2. Applied pagination logic entirely in JQ within the `RESTAction`'s `filter` field.
3. Required `snowplow` to process the full dataset on every page load, regardless of how many items the user actually needed.

The new approach:
1. Calls the `resources-presenter` HTTP API, which queries a PostgreSQL-backed cache of Kubernetes resource state.
2. Delegates pagination to the server using **keyset cursors**, only the requested page is returned.
3. Eliminates expensive full-dataset scans on every request.

---

## Step 1: Migrate the `RESTAction`

### Before

The old `RESTAction` fetched all namespaces, then iterated over them to gather resources, and finally applied a large JQ filter to sort and paginate the results in memory:

```yaml
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: compositions-panels
  namespace: {{ .Release.Namespace }}
  annotations:
    "krateo.io/verbose": "true"
spec:
  api:
  - name: namespaces
    path: "/api/v1/namespaces"
    filter: "[.namespaces.items[] | .metadata.name]"
  - name: compositionspanels
    dependsOn:
      name: namespaces
      iterator: .namespaces
    path: ${ "/apis/widgets.templates.krateo.io/v1beta1/namespaces/" + (.) + "/panels" }
    continueOnError: true
  filter: >
    {
      compositionspanels: (
        (if (.compositionspanels | type) == "array" then
          [.compositionspanels[]?.items[]? | select((.metadata.labels // {})["krateo.io/portal-page"] == "compositions")]
        elif (.compositionspanels | type) == "object" then
          [.compositionspanels.items[]?    | select((.metadata.labels // {})["krateo.io/portal-page"] == "compositions")]
        else
          []
        end) as $items
        | ($items | sort_by(.metadata.creationTimestamp // "") | reverse) as $sorted
        | (.slice.offset  // 0)                 as $offset
        | (.slice.perPage // ($sorted | length)) as $perPage
        | [
            $sorted
            | length as $len
            | range($offset; $offset + $perPage)
            | select(. < $len)
            | $sorted[.]
          ]
      )
    }
```

### After

The new `RESTAction` makes a single call to `resources-presenter`, passing pagination parameters (page size and cursor) directly in the query string. The server handles filtering, sorting, and pagination:

```yaml
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: compositions-panels
  namespace: {{ .Release.Namespace }}
  annotations:
    "krateo.io/verbose": "true"
spec:
  api:
  - name: compositionspanels
    endpointRef:
      name: resources-presenter-endpoint
      namespace: {{ .Release.Namespace }}
    path: >
      ${
        if .slice.cursor? != "" then
          ( "/resources?group=widgets.templates.krateo.io&resource=panels&version=v1beta1&namespace=*&limit=" + (.slice.perPage | tostring) + "&raw=true&cursor=" + .slice.cursor + "&labels={\"krateo.io/portal-page\":\"compositions\"}" )
        elif (.slice.perPage? != "" and .slice.perPage? != "NULL") then
          ( "/resources?group=widgets.templates.krateo.io&resource=panels&version=v1beta1&namespace=*&limit=" + (.slice.perPage | tostring) + "&raw=true&labels={\"krateo.io/portal-page\":\"compositions\"}" )
        else
          ( "/resources?group=widgets.templates.krateo.io&resource=panels&version=v1beta1&namespace=*&limit=5000&raw=true&labels={\"krateo.io/portal-page\":\"compositions\"}" )
        end
      }
    verb: GET
    continueOnError: true
    exportJwt: true
    errorKey: allCompositionsError
  filter: >
    {
      compositionspanels: [ .compositionspanels.items[] | .raw ],
      slice: {
        cursor: .compositionspanels.cursor,
        perPage: .slice.perPage
      }
    }
```

### Key changes in the `RESTAction`

| Aspect | Before | After |
|---|---|---|
| **API calls** | n (namespace list + per-namespace resource fetch) | 1 (single `resources-presenter` call) |
| **Pagination** | Client-side JQ (offset/limit on full dataset) | Server-side keyset cursor |
| **Namespace handling** | Iterated over each namespace individually | Single call with `namespace=*` |
| **Label filtering** | JQ `select()` applied after fetching everything | `labels` query parameter, filtered server-side |
| **`endpointRef`** | Pointed at Kubernetes API endpoint | Points at `resources-presenter-endpoint` in `Krateo's namespace` |
| **`filter`** | Large JQ block for sorting and slicing | Slim extraction of `.items[].raw` and forwarding the cursor |
| **`exportJwt`** | Not set | Set to `true` (passes user JWT to `resources-presenter` for RBAC) |

#### Filter explained

The output `filter` now has two responsibilities:

- **`compositionspanels`**: extracts the `.raw` Kubernetes object from each item returned by `resources-presenter`.
- **`slice`**: forwards the `cursor` token (returned by `resources-presenter` when more pages exist) and the current `perPage` value back into the context, so the next page request can use them.

---

## Step 2: Understand the `resources-presenter` path structure

The `path` field in the new `RESTAction` is a JQ expression that builds a `resources-presenter` query string at runtime. This section breaks down every component so you can adapt the pattern to any resource type.

### Anatomy of the base URL

A fully resolved path looks like this:

```
/resources?group=widgets.templates.krateo.io&resource=panels&version=v1beta1&namespace=*&limit=5&raw=true&cursor=<token>&labels={"krateo.io/portal-page":"compositions"}
```

Each query parameter maps to a specific filtering or pagination concern:

| Parameter | Example value | Purpose |
|---|---|---|
| `group` | `widgets.templates.krateo.io` | **Required.** The API group of the resource to query. |
| `resource` | `panels` | The plural resource name (lowercase). Narrows the discovery query within the group. |
| `version` | `v1beta1` | The API version. Optional but recommended for precision. |
| `namespace` | `*` | Namespace scope. Use `*` for all namespaces, or a specific name to restrict. Defaults to `default` if omitted. |
| `limit` | `5` | Page size, i.e., how many items to return in this response. |
| `raw` | `true` | When `true`, includes the full Kubernetes object under each item's `.raw` field. Required if the consumer needs the full spec/status. |
| `cursor` | `<base64 token>` | Opaque keyset cursor from the previous response. Pass this to retrieve the next page. Omit on the first request. |
| `labels` | `{"krateo.io/portal-page":"compositions"}` | JSON object for server-side label filtering (JSONB containment). Replaces the JQ `select()` calls from the old pattern. |

### How the JQ path expression works

The `path` field evaluates a JQ expression (delimited by `${ ... }`) against the current request context. The context includes the `slice` object forwarded from the previous response (or injected by `snowplow` on the first load).

```jq
if .slice.cursor? != "" then
  # Case 1: a cursor exists, user is on page 2+
  "/resources?..." + "&cursor=" + .slice.cursor + ...

elif (.slice.perPage? != "" and .slice.perPage? != "NULL") then
  # Case 2: no cursor but a page size is known, first page
  "/resources?..." + "&limit=" + (.slice.perPage | tostring) + ...

else
  # Case 3: no pagination context at all, fetch everything up to the fallback limit
  "/resources?...&limit=5000..."
end
```

The three branches handle the full lifecycle of a paginated session:

**Case 1: Subsequent pages.** Once the frontend has received the first page, it holds a `cursor` token (returned by `resources-presenter` in the response). On the next page request, `snowplow` injects this cursor into the context under `.slice.cursor`, and the expression appends `&cursor=<token>` to the path. The server uses this token to resume from exactly where the previous page ended.

**Case 2: First page.** On the initial load there is no cursor yet. If `.slice.perPage` is set (injected from the `Page` resource's `slice.perPage` field), the expression uses it as the `&limit`. The server returns the first `perPage` items and, if more exist, a `cursor` for the next page.

**Case 3: No pagination context (fallback).** If neither a cursor nor a page size is available, the expression falls back to `&limit=5000`. This acts as a safety net but should be treated as a worst case, tune the limit to your expected dataset size.

### Adapting the path for a different resource type

To query a different Krateo resource, change `group`, `resource`, `version`, and `labels` accordingly. Everything else (cursor logic, `limit`, `namespace`, `raw`) stays the same:

```jq
// Example: querying Fireworks widgets across all namespaces
if .slice.cursor? != "" then
  ( "/resources?group=widgets.templates.krateo.io&resource=fireworks&version=v1alpha1&namespace=*&limit=" + (.slice.perPage | tostring) + "&raw=true&cursor=" + .slice.cursor )
elif (.slice.perPage? != "" and .slice.perPage? != "NULL") then
  ( "/resources?group=widgets.templates.krateo.io&resource=fireworks&version=v1alpha1&namespace=*&limit=" + (.slice.perPage | tostring) + "&raw=true" )
else
  ( "/resources?group=widgets.templates.krateo.io&resource=fireworks&version=v1alpha1&namespace=*&limit=5000&raw=true" )
end
```

> **Note:** The `cursor` returned by `resources-presenter` is sort-order-aware. Do not reuse a cursor from a response with one `sort_by`/`sort_order` combination in a request that uses a different combination.

---

## Step 3: Update the wrapping `Widget` resource

Pagination is triggered the `slice` field on each `resourceRef` item in the calling widget. The `page` field should be removed to opt into the new cursor-based pagination, its presence activates the old offset-based logic instead.

> **Deprecation notice:** The `page` field and the client-side offset pagination it triggers are **deprecated** as of this release. They will remain available through **Krateo 3.0** and there is no planned removal date. However, it is strongly recommended to migrate.

### Before

```yaml
- id: compositions-page-datagrid
  apiVersion: widgets.templates.krateo.io/v1beta1
  name: compositions-page-datagrid
  namespace: {{ .Release.Namespace }}
  resource: datagrids
  verb: GET
  slice:
    page: 1       # Remove this to trigger new pagination
    perPage: 5
```

### After

```yaml
- id: compositions-page-datagrid
  apiVersion: widgets.templates.krateo.io/v1beta1
  name: compositions-page-datagrid
  namespace: {{ .Release.Namespace }}
  resource: datagrids
  verb: GET
  slice:
    perPage: 5    # Only perPage for new cursor-based pagination
```

> **Important:** The `page` field is no longer mandatory and must **not** be set. If `page` is present, the system will fall back to the old client-side offset pagination behavior.

---

## Step 4: Ensure the `resources-presenter-endpoint` exists

The new `RESTAction` references an `Endpoint` (i.e., `Secret`) resource named `resources-presenter-endpoint` in the `krateo-system` namespace. Verify it exists before deploying:

```bash
kubectl get secrets resources-presenter-endpoint -n krateo-system
```

If it does not exist, create it pointing at your `resources-presenter` service. Refer to the [Endpoint documentation](https://github.com/krateoplatformops/snowplow/blob/main/howto/endpoints.md) for the exact spec.

---

## Pagination flow (new behavior)

```
Frontend requests page
        │
        ▼
  snowplow loads RESTAction
        │
        ▼
  RESTAction calls resources-presenter
  (passes cursor + limit as query params)
        │
        ▼
  resources-presenter returns:
  - items[] for the current page
  - cursor (opaque token for next page, absent on last page)
        │
        ▼
  RESTAction filter extracts .raw objects
  and forwards cursor + perPage in slice
        │
        ▼
  Frontend receives page data + cursor
  Next page request passes cursor back
```

---

# EventList Migration Guide: eventsse / eventrouter to events-presenter

## Overview

This guide covers the migration of `EventList` widgets and their associated `RESTAction` resources from the old `eventsse` / `eventrouter` / `eventsse-etcd` stack to the new `events-presenter` service.

### Breaking change notice

> **This migration is mandatory.** The `eventsse`, `eventrouter`, and `eventsse-etcd` components are being **phased out immediately** and will no longer be available after this release. Any `EventList` widget or `RESTAction` still pointing at `eventsse-internal-endpoint` will stop working. There is no backwards compatibility window.

### Migration Motivations

The old approach:
1. Routed event queries through `eventsse`, a service backed by `etcd` via `eventsse-etcd`, with `eventrouter` handling dispatch. Because Kubernetes generates a very high volume of events, this stack experienced significant performance degradation under load. `etcd` is not designed for high-throughput event streaming and became a bottleneck, causing slowdowns across the entire platform.
2. Required the widget's `widgetDataTemplate` to perform heavy client-side JQ normalization of raw Kubernetes event objects, patching missing timestamps, stripping metadata fields, and normalizing empty strings.

The new approach:
1. Calls `events-presenter` directly: a lightweight service backed by PostgreSQL, designed to handle the high volume of Kubernetes events without performance degradation. The new stack can sustain a much larger event throughput without slowing down.
2. Returns clean, normalized event objects, eliminating all client-side JQ transformation in the widget.
3. Uses a standard query-string API (`/events?composition_id=<id>&limit=<n>`), consistent with the rest of the Krateo presenter layer.
4. Supports real-time SSE notifications through the same service (`/notifications`), removing the need for a separate SSE endpoint.

---

## Step 1: Migrate the `RESTAction`

### Before

The old `RESTAction` queried `eventsse` using a path-based composition ID and exposed the raw Kubernetes response to the widget layer:

```yaml
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events
  namespace: {{ .Values.global.compositionNamespace }}
spec:
  api:
  - name: getEvents
    path: "/events/{{ .Values.global.compositionId }}?limit=50"
    verb: GET
    endpointRef:
      name: eventsse-internal-endpoint
      namespace: {{ .Values.global.krateoNamespace }}
    headers:
    - 'Accept: application/json'
    continueOnError: true
    errorKey: getEventsError
  filter: >
    {
      list: (
        (.getEvents // [])
      )
    }
```

### After

The new `RESTAction` queries `events-presenter` using a standard query-string API. Event objects are returned already normalized, so the `filter` is minimal:

```yaml
apiVersion: templates.krateo.io/v1
kind: RESTAction
metadata:
  name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events
  namespace: {{ .Values.global.compositionNamespace }}
spec:
  api:
  - name: getEvents
    path: "/events?composition_id={{ .Values.global.compositionId }}&limit=200"
    verb: GET
    endpointRef:
      name: events-presenter-endpoint
      namespace: {{ .Values.global.krateoNamespace }}
    headers:
    - 'Accept: application/json'
    continueOnError: true
    errorKey: getEventsError
  filter: >
    {
      list: (.getEvents.resources // [])
    }
```

### Key changes in the `RESTAction`

| Aspect | Before | After |
|---|---|---|
| **Endpoint** | `eventsse-internal-endpoint` | `events-presenter-endpoint` |
| **Path format** | `/events/<compositionId>?limit=50` | `/events?composition_id=<compositionId>&limit=200` |
| **Default limit** | 50 | 200 |
| **Response shape** | Raw array of Kubernetes event objects | Wrapped response object with `.resources[]` |
| **`filter`** | Extracts raw event array as `list` from `getEvents` | Extracts normalized event array as `list` from `getEvents.resources` |

#### Path explained

The new path uses a standard query-string format consistent with the rest of the presenter layer:

| Parameter | Example value | Purpose |
|---|---|---|
| `composition_id` | `{{ .Values.global.compositionId }}` | Filters events by composition. Resolved at render time from Helm values. |
| `limit` | `200` | Maximum number of events to return. Adjust to your expected event volume. |

#### Filter explained

The `filter` extracts the event list from the `events-presenter` response envelope and exposes it as `list` for the widget layer. The `// []` fallback ensures the widget renders an empty list gracefully if the call fails or returns no events.

---

## Step 2: Migrate the `EventList` widget

### Before

The old `EventList` widget applied the full JQ normalization expression directly in `widgetDataTemplate` to patch missing timestamps, normalise empty fields, and strip internal metadata from raw Kubernetes event objects. It also used a trailing slash on the SSE endpoint:

```yaml
kind: EventList
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events-panel-eventlist
  namespace: {{ .Values.global.compositionNamespace }}
spec:
  widgetData:
    events: []
    sseEndpoint: "/notifications/"
    sseTopic: "{{ .Values.global.compositionId }}"
  widgetDataTemplate:
    - forPath: events
      expression: >
        ${
          .list
          | map(
              .firstTimestamp = ( if (.firstTimestamp // "") == ""
                                  then (.eventTime // .lastTimestamp // null)
                                  else .firstTimestamp
                                end ) |
              .lastTimestamp  = ( if (.lastTimestamp // "") == ""
                                  then (.firstTimestamp // .eventTime // null)
                                  else .lastTimestamp
                                end ) |
              .eventTime      = ( if (.eventTime // "") == ""
                                  then (.firstTimestamp // .lastTimestamp // null)
                                  else .eventTime
                                end ) |
              .message        = ( if (.message // "") == ""
                                  then (.reason // "")
                                  else .message
                                end ) |
              .involvedObject.namespace = (.involvedObject.namespace // "") |
              del(
                .metadata.resourceVersion,
                .metadata.annotations,
                .metadata.labels,
                .metadata.managedFields,
                .metadata.generatedName,
                .involvedObject.resourceVersion,
                .series
              )
            )
        }
  apiRef:
    name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events
    namespace: {{ .Values.global.compositionNamespace }}
```

### After

The new `EventList` widget delegates all normalization to `events-presenter`. The `widgetDataTemplate` expression becomes a direct passthrough, and the SSE endpoint takes the `composition_id` as a query string parameter:

```yaml
kind: EventList
apiVersion: widgets.templates.krateo.io/v1beta1
metadata:
  name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events-panel-eventlist
  namespace: {{ .Values.global.compositionNamespace }}
spec:
  widgetData:
    events: []
    sseEndpoint: "/notifications?composition_id={{ .Values.global.compositionId }}"
    sseTopic: "krateo"
  widgetDataTemplate:
    - forPath: events
      expression: "${ .list }"
  apiRef:
    name: {{ .Values.global.compositionKind | lower }}-{{ .Values.global.compositionName }}-composition-events
    namespace: {{ .Values.global.compositionNamespace }}
```

### Key changes in the `EventList` widget

| Aspect | Before | After |
|---|---|---|
| **`sseEndpoint`** | `/notifications/` | `/notifications?composition_id={{ .Values.global.compositionId }}` |
| **`sseTopic`** | `{{ .Values.global.compositionId }}` | `krateo` |
| **`widgetDataTemplate` expression** | Large JQ block normalizing every event field | `"${ .list }"` for direct passthrough |

---

## Step 3: Ensure the `events-presenter-endpoint` exists

The new `RESTAction` references an `Endpoint` (i.e., `Secret`) resource named `events-presenter-endpoint` in the namespace specified by `{{ .Values.global.krateoNamespace }}`. Verify it exists before deploying:

```bash
kubectl get secrets events-presenter-endpoint -n <krateoNamespace>
```

This endpoint should be created by the installer during the upgrade to Krateo 3.0.

---

## Step 4: Propagate the changes through the Helm chart

Because `EventList` widgets and their `RESTAction` resources are Helm templates managed by the Composition Dynamic Controller (CDC), **changes cannot be applied directly to the cluster**. Any resource patched manually would be reverted at the next reconciliation loop triggered by the CDC. The correct way to propagate these changes is to update the Helm templates and then upgrade the `CompositionDefinition`.

The upgrade path depends on how your automation chart uses `portal-composition-page-generic`.

---

### Layout A: Using the Krateo-provided `portal-composition-page-generic` unmodified

If your automation chart depends on the official `portal-composition-page-generic` chart from the Krateo marketplace without any local modifications, the updated templates are already published in version `1.5.0`. You only need to bump the dependency and upgrade the `CompositionDefinition`.

**1. Update the dependency in every automation chart that uses it.**

For each automation chart that declares `portal-composition-page-generic` as a dependency, update the version in its `Chart.yaml`:

```yaml
dependencies:
  - name: portal-composition-page-generic
    version: "1.5.0"
    repository: "https://marketplace.krateo.io"
```

Publish the new automation chart version.

**2. Upgrade the `CompositionDefinition`.**

Apply the new automation chart version to the `CompositionDefinition` and let the CDC reconcile:

```yaml
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: your-composition-definition
  namespace: krateo-system
spec:
  chart:
    version: "<new-automation-chart-version>"
```

```bash
kubectl apply -f compositiondefinition.yaml
```

The CDC will detect the version change, deploy a new controller for the updated chart, and reconcile all `Composition` instances automatically.

---

### Layout B: Forked or customized `portal-composition-page-generic`

If you have forked `portal-composition-page-generic` and maintain your own copy, you need to apply the template changes manually before releasing a new version.

**1. Apply the template changes to your fork.**

Update the `EventList` and `RESTAction` templates in your fork as described in Steps 1 and 2, then release a new version of your shared chart:

```yaml
# your forked shared chart Chart.yaml
version: 1.5.0   # bump from 1.4.0
```

**2. Update the dependency in every automation chart that uses your fork.**

For each automation chart that pulls in your forked shared chart, update the version constraint in its `Chart.yaml`:

```yaml
dependencies:
  - name: portal-composition-page-generic
    version: "1.5.0"
    repository: "https://your-chart-repository"
```

Publish the new automation chart version.

**3. Upgrade the `CompositionDefinition`.**

Apply the new automation chart version to the `CompositionDefinition` and let the CDC reconcile:

```yaml
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: your-composition-definition
  namespace: krateo-system
spec:
  chart:
    version: "<new-automation-chart-version>"
```

```bash
kubectl apply -f compositiondefinition.yaml
```

---

### Layout C: Inline templates

If the `EventList` and `RESTAction` templates are defined directly inside each automation chart's `templates/` directory without a shared dependency, every chart that renders an `EventList` must be updated individually.

**1. Update the templates in each affected automation chart.**

Apply the changes from Steps 1 and 2 directly to the template files in each affected chart, then bump the chart version:

```yaml
# automation chart Chart.yaml
version: "<new-version>"
```

Publish the new automation chart version.

**2. Upgrade the `CompositionDefinition` for each affected chart.**

For each `CompositionDefinition` that references an updated chart, set the new version and apply it:

```yaml
apiVersion: core.krateo.io/v1alpha1
kind: CompositionDefinition
metadata:
  name: your-composition-definition
  namespace: krateo-system
spec:
  chart:
    version: "<new-version>"
```

```bash
kubectl apply -f compositiondefinition.yaml
```

Repeat for every `CompositionDefinition` that uses a chart containing an `EventList` widget.

> **Tip:** If multiple `Composition` instances exist for the same `CompositionDefinition`, the CDC will reconcile all of them automatically once the `CompositionDefinition` is updated.

---

## New Event Flow

```
Kubernetes generates an event
        │
        ▼
  events-ingester stores event
  in PostgreSQL (krateo_events table)
  and notifies via LISTEN/NOTIFY
        │
        ▼
  events-presenter receives notification
  and broadcasts to SSE subscribers
        │
        ├──────────────────────────────┐
        ▼                              ▼
  EventList widget               RESTAction polls
  receives SSE push              /events?composition_id=...
  on /notifications              and refreshes the list
```