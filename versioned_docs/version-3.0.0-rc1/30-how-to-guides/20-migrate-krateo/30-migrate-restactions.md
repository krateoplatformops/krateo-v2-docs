---
description: RESTAction Migration
sidebar_label: RESTAction Migration
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