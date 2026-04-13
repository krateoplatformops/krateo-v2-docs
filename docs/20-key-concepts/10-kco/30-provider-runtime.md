# Provider Runtime

The [`provider-runtime`](https://github.com/krateoplatformops/provider-runtime) is our production-grade version of the [`controller-runtime`](https://github.com/kubernetes-sigs/controller-runtime). Both runtimes can be used to implement [**Kubernetes operators**](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/).

What additional features does provider-runtime introduce beyond controller-runtime? Three key enhancements:

* *pausing the reconciliation of the Custom Resource*: the use case is in which the infrastructure that exposes the API to the Operator has anomalies that lead to maintenance (planned or extraordinary), and you want to prevent the Operator from bombarding the API with unnecessary calls.

* *inhibiting one or more behaviors of the Custom Resource*: the example is when I want to prevent the deletion (deliberate or by mistake) of the Custom Resource in the production environment from also deleting the physical resource managed by the Operator. Another example is when I want to import a resource created before using an operator into Kubernetes.

* *forcing the writing of a Kubernetes event at each change of condition*: A Kubernetes event contains valuable information that lets you understand what happened, when, and who detected a change of condition in the managed resource (https://www.cncf.io/blog/2023/03/13/how-to-use-kubernetes-events-for-effective-alerting-and-monitoring/). Although extremely useful, an Operator does not necessarily write a Kubernetes event at every change of condition. The `provider-runtime` instead forces us to write an event.

An example of an Operator written with our `provider-runtime` is the [`core-provider`](https://github.com/krateoplatformops/core-provider).
