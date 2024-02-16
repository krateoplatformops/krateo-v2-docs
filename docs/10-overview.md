---
slug: /
sidebar_label: Overview
description: Find out more about Krateo - a self-service platform for multi-cloud native resources based on Kubernetes

---

# What is Krateo PlatformOps?

**Krateo Platformops** is an open source platform that gives users the capability to create any desired resource on basically any infrastructure they'd like. Be it a K8s cluster, microservice, application, pipeline, database or anything else, Krateo has got your back. The only requirement is for the resource to be descriptible via a YAML file representing the resource's _desired state_ (rings a bell? 😉).

Krateo allows for:

- **Creating any kind of resources within and outside the Kubernetes cluster it runs on**: whilst Krateo runs as a Deployment in a Kubernetes cluster, it can also create resources _outside_ the cluster. You can use Krateo to create anything from new Kubernetes clusters, Logstash pipelines, Docker registries, API gateways, and many others.
- **Focusing on the management of services**: Krateo frees the user from most of the burden of cluster management, giving them the ability to entirely focus on the services that must be run. This results a phenomenal user experience that drastically reduces wastes of time.
- **Single-handedly monitoring and controlling resources**: Krateo also acts as a centralized control plane, letting users monitor anything ranging from CI/CD pipelines to pod statuses and open tickets on your JIRA. All the information you need is present on a single page -- you'll never have to guess the correct dashboard ever again.

:::caution
Krateo PlatformOps v2 is undergoing active development and everyone is invited to [join us](https://github.com/krateoplatformops/krateo) in the journey to a GA release (`v2.0.0`)! Please expect breaking changes between pre-GA releases (`v2.x.x-x`).
:::

:::info
Join the Krateo Community [Discord server](https://discord.gg/sjca4QvVTa)!
:::


## Architecture

![Architecture](../static/img/krateo-architecture.png)

## Next Steps

To learn more about Krateo PlatformOps, consider checking out our key concepts or get hands-on right away with our
[quickstart](./quickstart)!
