---
sidebar_label: Krateo Composable Operations
description: Find out more about Krateo Composable Operations (KCO) key concepts
---
# What is Krateo Composable Operations (KCO)?

💡 KCO uses Kubernetes as the orchestration layer of the entire data center and the related processes that exploit the available services.

📚 The use cases are diverse, from infrastructure provisioning (legacy and cloud-native, from mainframe to lambda) to scaffolding the CI/CD toolchain to prepare for onboarding a new application.

🤝 The context is not only that of the green field, but KCO also adapts perfectly to a brownfield context, where the processes already exist and are distributed and implemented within different technologies that do not allow end-to-end automation of an entire blueprint.

🎯 Through its Operators, Kubernetes can represent the abstraction layer and standardization of the heterogeneity of systems, processes, and technologies within your organization.

💯 There are already several operators implemented; search within https://operatorhub.io/, within the Upbound marketplace (https://marketplace.upbound.io/), or point directly to the operators released by cloud providers such as Azure (https://azure.github.io/azure-service-operator/) or AWS (https://aws-controllers-k8s.github.io/community/). There are SDKs for writing an Operator, such as OperatorSDK (https://sdk.operatorframework.io/). It is also possible to interact directly with tools such as KubeBuilder (https://book.kubebuilder.io/quick-start.html).

KCO consists of the following features:
* core-provider
* composition-dynamic-controller
* provider-runtime
* patch-provider
* eventrouter
* eventsse

## core-provider

The 𝘤𝘰𝘳𝘦-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳 (https://github.com/krateoplatformops/core-provider) is the first function of Krateo Composable Operations (KCO) and is vital in the Krateo PlatformOps product.

📌 The product assumes that Kubernetes is the standard for IT process orchestration, bringing together business application developers and infrastructure automation developers.

📈 Helm is the most widely used tool for composing multiple Kubernetes manifests.

☝ However, it's important to note that Helm is not a resource natively recognized by Kubernetes. To install a Helm chart, you need to use the relevant CLI or tools configured to acknowledge Helm charts and install them on the cluster. For example, ArgoCD or FluxCD are two well-known options, but many others are available.

⚡️ The 𝘤𝘰𝘳𝘦-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳 is a Kubernetes operator that downloads a Helm chart using one of three possible methods (via tgz, Helm repo, or OCI image). It checks for the existence of values.schema.json for linting the Helm chart and uses it to generate a Custom Resource Definition in Kubernetes. This definition accurately represents the possible values that can be expressed for the installation of the chart.

💯 We chose to write the 𝘤𝘰𝘳𝘦-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳 instead of using an existing tool because no existing tool provides input validation. Some tools accept incorrect inputs and only generate error messages after receiving them.

❗However, Kubernetes is designed to validate resource inputs before applying them to the cluster, and we adhere to this hard requirement throughout Krateo development.

✌ That's why we created the 𝘤𝘰𝘳𝘦-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳, which provides input validation and ensures that incorrect inputs are not even accepted in the first place.

Check the detailed [README](https://github.com/krateoplatformops/core-provider/blob/main/README.md).

## composition-dynamic-controller

The second component of Krateo Composable Operations (KCO) in Krateo PlatformOps is the 𝘤𝘰𝘮𝘱𝘰𝘴𝘪𝘵𝘪𝘰𝘯-𝘥𝘺𝘯𝘢𝘮𝘪𝘤-𝘤𝘰𝘯𝘵𝘳𝘰𝘭𝘭𝘦𝘳, which is an operator that is instantiated by the 𝘤𝘰𝘳𝘦-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳 to manage the Custom Resources whose Custom Resource Definition is generated by the core provider.

Check the detailed [README](https://github.com/krateoplatformops/composition-dynamic-controller/blob/main/README.md).

## provider-runtime

The third component of Krateo Composable Operations (KCO) in Krateo PlatformOps is the 𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳-𝘳𝘶𝘯𝘵𝘪𝘮𝘦 (https://github.com/krateoplatformops/provider-runtime), our production-grade version of the controller-runtime (https://github.com/kubernetes-sigs/controller-runtime). Both runtimes can be used to implement Kubernetes operators.

🆚 What more have we added to the provider-runtime compared to the controller-runtime? Three features:

* 𝘱𝘢𝘶𝘴𝘪𝘯𝘨 𝘵𝘩𝘦 𝘳𝘦𝘤𝘰𝘯𝘤𝘪𝘭𝘪𝘢𝘵𝘪𝘰𝘯 𝘰𝘧 𝘵𝘩𝘦 𝘊𝘶𝘴𝘵𝘰𝘮 𝘙𝘦𝘴𝘰𝘶𝘳𝘤𝘦: the use case is in which the infrastructure that exposes the API to the Operator has anomalies that lead to maintenance (planned or extraordinary), and you want to prevent the Operator from bombarding the API with unnecessary calls.

* 𝘪𝘯𝘩𝘪𝘣𝘪𝘵𝘪𝘯𝘨 𝘰𝘯𝘦 𝘰𝘳 𝘮𝘰𝘳𝘦 𝘣𝘦𝘩𝘢𝘷𝘪𝘰𝘳𝘴 𝘰𝘧 𝘵𝘩𝘦 𝘊𝘶𝘴𝘵𝘰𝘮 𝘙𝘦𝘴𝘰𝘶𝘳𝘤𝘦: the example is when I want to prevent the deletion (deliberate or by mistake) of the Custom Resource in the production environment from also deleting the physical resource managed by the Operator. Another example is when I want to import a resource created before using an operator into Kubernetes.

* 𝘧𝘰𝘳𝘤𝘪𝘯𝘨 𝘵𝘩𝘦 𝘸𝘳𝘪𝘵𝘪𝘯𝘨 𝘰𝘧 𝘢 𝘒𝘶𝘣𝘦𝘳𝘯𝘦𝘵𝘦𝘴 𝘦𝘷𝘦𝘯𝘵 𝘢𝘵 𝘦𝘢𝘤𝘩 𝘤𝘩𝘢𝘯𝘨𝘦 𝘰𝘧 𝘤𝘰𝘯𝘥𝘪𝘵𝘪𝘰𝘯. A Kubernetes event contains valuable information that lets you understand what happened, when, and who detected a change of condition in the managed resource (https://www.cncf.io/blog/2023/03/13/how-to-use-kubernetes-events-for-effective-alerting-and-monitoring/). Although extremely useful, an Operator does not necessarily write a Kubernetes event at every change of condition. Our provider runtime instead forces us to write an event.

An example of an Operator written with our provider runtime is the github-provider; look at it 👉 https://github.com/krateoplatformops/github-provider.

## patch-provider

The [𝘱𝘢𝘵𝘤𝘩-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳](https://github.com/krateoplatformops/patch-provider) is the fourth component of Krateo Composable Operations (KCO) of Krateo PlatformOps.

🎯 Its primary purpose is to modify a Kubernetes resource's values by taking another resource's value as a source and possibly applying transformations.

↪ The need to implement the patch-provider arose from the need to establish dependencies between the outputs of one resource (for example, a field in its status) and the inputs of another.

👇 Attached is an example of a Patch that takes the 'data.value1' field from the 'foo' ConfigMap and encodes it in base64 by adding the 'prefix-' prefix and saving the result in the 'data.value2' field of the ConfigMap 'bar'.

```yaml
apiVersion: krateo.io/v1alpha1
kind: Patch
metadata:
  name: sample1
spec:
  from:
    objectReference:
      apiVersion: v1
      kind: ConfigMap
      name: foo
    fieldPath: data
  to:
    objectReference:
      apiVersion: v1
      kind: ConfigMap
      name: bar
    fieldPath: data.value2
    transforms:
      - b64enc .value1
      - printf "prefix-%s"
 ```

## eventrouter

The fifth component of Krateo Composable Operation (KCO) in Krateo PlatformOps is the 𝘦𝘷𝘦𝘯𝘵𝘳𝘰𝘶𝘵𝘦𝘳 - a cutting-edge Kubernetes Event aggregation and dispatching solution.

The 𝘦𝘷𝘦𝘯𝘵𝘳𝘰𝘶𝘵𝘦𝘳 is a pivotal solution for enterprises and DevOps teams seeking to enhance their monitoring and observability strategies. Efficiently routing Kubernetes cluster events to various sinks provides a consolidated view of the operational health and performance of applications running on Kubernetes.

Key Features:

* 𝗘𝘃𝗲𝗻𝘁 𝗔𝗴𝗴𝗿𝗲𝗴𝗮𝘁𝗶𝗼𝗻: Collects events from all corners of a Kubernetes cluster, offering a unified stream of insights into your infrastructure's state.
* 𝗙𝗹𝗲𝘅𝗶𝗯𝗹𝗲 𝗗𝗶𝘀𝗽𝗮𝘁𝗰𝗵𝗶𝗻𝗴: Supports multiple sinks, enabling customized event processing and integration with monitoring tools of your choice.
* 𝗢𝗽𝗲𝗻 𝗦𝗼𝘂𝗿𝗰𝗲: As part of our commitment to community-driven development, 𝘦𝘷𝘦𝘯𝘵𝘳𝘰𝘶𝘵𝘦𝘳 is fully open source, inviting worldwide contributions and developer feedback.

For more details and to get started, visit our GitHub repository: https://github.com/krateoplatformops/eventrouter

## eventsse

The EventSSE project provides a simple yet powerful service to enable Server-Sent Events (SSE) with message broadcasting capabilities. The service is designed to offer an efficient mechanism for streaming real-time updates from a server to client applications over HTTP, with persistent connections that automatically handle client reconnections. Users can easily interact with the SSE service by subscribing to specific event streams and broadcasting messages to all clients connected to a particular event. Key features include a lightweight setup with support for custom events, message filtering by channels, and scalability, making it ideal for real-time notifications and updates in web applications.

For more details and to get started, visit our GitHub repository: https://github.com/krateoplatformops/eventsse
