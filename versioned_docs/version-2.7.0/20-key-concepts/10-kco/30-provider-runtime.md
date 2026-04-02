# provider-runtime

The third component of Krateo Composable Operations (KCO) in Krateo PlatformOps is the 𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳-𝘳𝘶𝘯𝘵𝘪𝘮𝘦 (https://github.com/krateoplatformops/provider-runtime), our production-grade version of the controller-runtime (https://github.com/kubernetes-sigs/controller-runtime). Both runtimes can be used to implement Kubernetes operators.

🆚 What more have we added to the provider-runtime compared to the controller-runtime? Three features:

* 𝘱𝘢𝘶𝘴𝘪𝘯𝘨 𝘵𝘩𝘦 𝘳𝘦𝘤𝘰𝘯𝘤𝘪𝘭𝘪𝘢𝘵𝘪𝘰𝘯 𝘰𝘧 𝘵𝘩𝘦 𝘊𝘶𝘴𝘵𝘰𝘮 𝘙𝘦𝘴𝘰𝘶𝘳𝘤𝘦: the use case is in which the infrastructure that exposes the API to the Operator has anomalies that lead to maintenance (planned or extraordinary), and you want to prevent the Operator from bombarding the API with unnecessary calls.

* 𝘪𝘯𝘩𝘪𝘣𝘪𝘵𝘪𝘯𝘨 𝘰𝘯𝘦 𝘰𝘳 𝘮𝘰𝘳𝘦 𝘣𝘦𝘩𝘢𝘷𝘪𝘰𝘳𝘴 𝘰𝘧 𝘵𝘩𝘦 𝘊𝘶𝘴𝘵𝘰𝘮 𝘙𝘦𝘴𝘰𝘶𝘳𝘤𝘦: the example is when I want to prevent the deletion (deliberate or by mistake) of the Custom Resource in the production environment from also deleting the physical resource managed by the Operator. Another example is when I want to import a resource created before using an operator into Kubernetes.

* 𝘧𝘰𝘳𝘤𝘪𝘯𝘨 𝘵𝘩𝘦 𝘸𝘳𝘪𝘵𝘪𝘯𝘨 𝘰𝘧 𝘢 𝘒𝘶𝘣𝘦𝘳𝘯𝘦𝘵𝘦𝘴 𝘦𝘷𝘦𝘯𝘵 𝘢𝘵 𝘦𝘢𝘤𝘩 𝘤𝘩𝘢𝘯𝘨𝘦 𝘰𝘧 𝘤𝘰𝘯𝘥𝘪𝘵𝘪𝘰𝘯. A Kubernetes event contains valuable information that lets you understand what happened, when, and who detected a change of condition in the managed resource (https://www.cncf.io/blog/2023/03/13/how-to-use-kubernetes-events-for-effective-alerting-and-monitoring/). Although extremely useful, an Operator does not necessarily write a Kubernetes event at every change of condition. Our provider runtime instead forces us to write an event.

An example of an Operator written with our provider runtime is the github-provider; look at it 👉 https://github.com/krateoplatformops/github-provider.