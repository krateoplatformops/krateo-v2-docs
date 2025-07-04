# eventsse

Streams events received from [Krateo EventRouter](https://github.com/krateoplatformops/eventrouter) using [Server-Sent Events (SSE)](https://en.wikipedia.org/wiki/Server-sent_events).

## Summary

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [API](#api)
4. [Examples](#examples)
5. [Configuration](#configuration)
<!-- 6. [FAQ](#faq) -->

## Overview

Subscribed to the eventrouter service as event receiver. 

- patches the received event adding a label that references the composition to which the event belongs 
- stores the event both in an internal queue and in an etcd storage

## Architecture

![EventSSE Architecture](/img/kcp/eventsse-architecture.png)

## API

This service exposes two main endpoints: 

- `/notifications`, which uses SSE to send events (either all events or only those belonging to a specific composition) to the client
- `/events`, which returns the list of all events; eventually filtered for a specific composition

Check the `/swagger/index.html` url for more details about all the API.

## Examples

In the following examples `$HOST` is the address of your eventsse instance and `$PORT` it's listening port.

### Receiving notifications

```sh 
$ curl -v "$HOST:$PORT/notifications
```

### Listing last events

```sh 
$ curl -v "$HOST:$PORT/events
```

By specific composition :

```sh 
$ curl -v "$HOST:$PORT/events/$COMPOSITION_ID
```

## Configuration

This service must be registered to the `eventrouter` (subscription) using a manifest like this:

```yaml
apiVersion: eventrouter.krateo.io/v1alpha1
kind: Registration
metadata:
  name: eventsse
  namespace: demo-system
spec:
  serviceName: Eventrouter SSE
  endpoint: $HOST:$PORT/handle
```

where: 

- `$HOST`: is the address of your eventsse instance (i.e. `http://eventsse-internal.demo-system.svc.cluster.local`)
- `$PORT`: is the listening port of your eventsse instance
