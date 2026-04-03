---
description: EventList Migration
sidebar_label: EventList Migration
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