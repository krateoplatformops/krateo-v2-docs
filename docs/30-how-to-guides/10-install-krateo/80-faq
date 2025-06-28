# FAQ

### ❓ How can I install Krateo PlatformOps on EKS?

Krateo PlatformOps **cannot be installed directly on Amazon EKS**, as EKS has disabled the `CertificateSigningRequest` API used by Kubernetes to issue client certificates. This limitation prevents essential components of Krateo from functioning properly.

For more details, see the official AWS documentation:  
👉 [Amazon EKS and CertificateSigningRequest limitations](https://docs.aws.amazon.com/eks/latest/userguide/cert-signing.html)

To work around this limitation, we recommend installing Krateo on an **ephemeral Kubernetes control plane** such as:

- [`vCluster`](https://www.vcluster.com/) — a lightweight, cost-effective virtual Kubernetes cluster that runs inside a namespace  
- [`kcp`](https://github.com/kcp-dev/kcp) — a Kubernetes-like control plane for multi-tenant workloads and APIs

These environments support the full set of Kubernetes APIs required by Krateo and provide flexibility for platform engineering use cases.

