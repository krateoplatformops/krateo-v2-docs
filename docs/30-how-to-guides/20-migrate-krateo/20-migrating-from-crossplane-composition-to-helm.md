---
description: Migrating from Crossplane Composition to Helm
sidebar_label: Migrating from Crossplane Composition to Helm
---

# Migrating from Crossplane Composition to Helm

The release of Krateo PlatformOps v2 implies a change considering the templating engine used to implement the compositions. Until version 1, Crossplane has been used as a templating engine, using Composition to represent a higher-level abstraction of a stack of infrastructure and services. Since the release of Krateo PlatformOps v2, Helm has substituted Crossplane as the templating engine. This change allows you to overcome certain limits of Crossplane composition:

* Poor readability of Composition yaml file: splitting the YAML file into multiple modules is impossible. This limit makes the Composition not so reusable in similar use cases.
* There is a high probability of making a mistake during the patch implementation: every patch needs to define the entire JSON path of the source value and the target field of the patch.
* Understanding how every manifest will be patched is challenging because the base section contains only fields with default values. Thus, the base manifest must be completed with all fields that will be rendered evaluating the patch.
* It's not easy to render the composition without applying any manifest: at this time, there is no command to render and validate the composition.

On the other side, the adoption of Helm as the templating engine brings advantages like:

* **Parameterization and Reusability**: Helm templates allow users to parameterize Kubernetes manifests using Go templating syntax. Users can define placeholders (variables) within their templates and provide values for these placeholders at runtime. Parameterization enables users to create reusable templates customized for different environments, configurations, or use cases. This capability reduces duplication of configuration files and promotes consistency across deployments.
* **Dynamic Configuration Generation**: Helm templates enable the generation of Kubernetes manifests dynamically based on input values. This flexibility lets you define logic within your templates to include or modify resources based on the provided values conditionally. For example, you can generate different configurations for development, staging, and production environments using a single Helm chart by leveraging conditional statements and logic in your templates. This dynamic configuration generation capability enhances your confidence and adaptability in managing deployments.
* **Abstraction of Complexity**: Helm templates abstract away the complexity of Kubernetes manifests by providing a higher-level, declarative interface for defining resources. Instead of manually writing YAML manifests for each resource, users can use Helm's templating constructs to define resources more succinctly and intuitively. Templates can include loops, conditionals, functions, and other constructs to encapsulate complex logic and generate Kubernetes manifests efficiently. This abstraction of complexity simplifies the process of defining and managing Kubernetes deployments, particularly for applications with multiple components or configurations.
* **Integration with Values Files and Overrides**: Helm templates seamlessly integrate with values files, which are YAML files containing user-supplied configuration values for a Helm chart. Users can provide values files to Helm at deployment time to customize the behavior and configuration of their deployments. Helm supports using multiple values files and allows users to override specific values within these files, enabling fine-grained control over the deployment process. This integration with values files and overrides enhances Helm's flexibility, allowing users to tailor deployments to their requirements without modifying the underlying templates.

Overall, the Helm templating engine empowers developers and DevOps engineers to create dynamic, parameterized Kubernetes manifests that can adapt to various configurations and environments. By abstracting away complexity, promoting reusability, and integrating seamlessly with values files, Helm templates enhance the efficiency, flexibility, and maintainability of Kubernetes application deployments, giving you more control over your deployments.

## Crossplane compositions

Crossplane compositions are a core concept within the Crossplane project, an open-source Kubernetes add-on that extends the Kubernetes API to manage infrastructure and services from cloud providers. Compositions in Crossplane provide a way to define and manage complex infrastructure stacks as Kubernetes resources. Here's a more detailed explanation of Crossplane compositions:

1. **Definition**: A Crossplane composition is a Kubernetes Custom Resource (CR) representing a higher-level abstraction of a stack of infrastructure and services. It defines the desired state of the infrastructure resources that make up an application or a part of an application.
2. **Declarative Model**: Compositions follow a declarative model, where users define the desired state of their infrastructure stack using YAML manifests. These manifests specify the composition's parameters, resource types, and configurations.
3. **Reusable Building Blocks**: Compositions allow users to create reusable building blocks for common infrastructure patterns or applications. Instead of manually configuring each resource, users can define a composition that encapsulates a set of resources and configurations.
4. **Composition Templates**: Crossplane provides composition templates, which are reusable templates for defining compositions. These templates abstract away the details of provisioning and configuring individual resources, making it easier to define complex infrastructure stacks.
5. **Resource Composition and Relationships**: Compositions allow users to specify relationships and dependencies between resources. For example, a composition might define that an application deployment requires a specific database instance, and Crossplane ensures that the database is provisioned before deploying the application.
6. **Crossplane Resource Model (XRM)**: Compositions are part of the Crossplane Resource Model (XRM), which extends the Kubernetes API to support infrastructure resources as first-class citizens. XRM allows infrastructure resources to be managed alongside application resources using Kubernetes-native tools and workflows.
7. **CRD-based Approach**: Compositions are implemented as Kubernetes Custom Resource Definitions (CRDs) and controllers. This means that compositions are managed by Kubernetes controllers, ensuring that the actual state of the infrastructure matches the desired state specified in the composition manifests.
8. **Extensibility**: Crossplane compositions are highly extensible, allowing users to define custom compositions tailored to their specific infrastructure requirements. Users can create their composition templates and share them with the community.

## Helm chart

Starting with Krateo PlatformOps v2 and adopting Helm as the templating engine, we have to understand how to migrate all the existing compositions implemented with Crossplane to a Helm chart.

>The core concept is that every manifest patched with the Crossplane composition will be a manifest of the Helm chart that represents the composition.

When working with Helm charts, adhering to best practices ensures smoother deployments, better maintainability, and scalability of your Kubernetes applications. Here are some best practices for Helm charts:

1. **Modularity and Reusability**:
   * Break down your application into modular components, each represented by a separate Helm chart.
   * Encapsulate common functionalities or configurations into reusable chart dependencies or libraries.
   * Follow the single responsibility principle: Each Chart should focus on managing a specific set of resources or configurations.

2. **Parameterization**:
   * Parameterize your Helm charts to make them configurable and reusable across different environments.
   * Use values files or environment-specific configuration files to customize chart behavior for various environments (dev, staging, production).
   * Leverage Helm's templating engine to dynamically generate Kubernetes manifests based on input values, promoting flexibility and consistency.

3. **Security**:
   * Avoid hardcoding sensitive information such as passwords or API keys directly into your Helm charts.
   * Use Kubernetes secrets or external secret management tools (like Vault) to manage sensitive data securely.
   * Follow security best practices for container images and ensure that images are scanned for vulnerabilities.

4. **Versioning and Dependency Management**:
   * Version your Helm charts to track changes and facilitate reproducible deployments.
   * Specify dependencies accurately in your Chart.yaml file, including the version constraints.
   * Regularly update dependencies to leverage bug fixes, new features, and security patches.

5. **Testing**:
   * Write tests for your Helm charts to ensure their correctness and reliability.
   * Use Helm's testing framework to define and execute tests that validate the behavior of your charts.
   * Implement linting checks to catch common issues and ensure compliance with best practices.

6. **Documentation**:
   * Document your Helm charts, including usage instructions, configuration options, and dependencies.
   * Provide examples and usage scenarios to help users understand how to deploy and configure your charts effectively.
   * Include information about compatibility, known issues, and troubleshooting tips to assist users in resolving issues.

7. **GitOps and Continuous Delivery**:
   * Integrate Helm charts into your GitOps workflows to automate deployments and ensure consistency across environments.
   * Leverage CI/CD pipelines to automate chart testing, validation, and release processes.
   * Use Git repositories to version control your Helm charts, enabling collaboration and traceability.

8. **Performance and Efficiency**:
   * Optimize your Helm charts for performance and efficiency by minimizing resource usage and reducing deployment times.
   * Use Helm's hooks judiciously to perform pre-installation, post-installation, pre-deletion, and post-deletion actions efficiently.
   * Use Helm's support for Kubernetes primitives like Job or CronJob for one-time or periodic tasks instead of reinventing the wheel.

Following these best practices ensures that your Helm charts are well-structured, secure, maintainable, and easily deployable, contributing to a smoother Kubernetes application lifecycle management experience.

## How to migrate from Crossplane to Helm chart

The migration requires two main tasks:

1. Definition of yaml templates, values file, and eventually other variables in `_helpers.tpl`
2. Implementation of value.schema.json

### Definition of yaml templates, values file, and eventually other variables in `_helpers.tpl`

The snippet reported below contains a Crossplane Composition that creates only a manifest with an ArgoCD Application. Starting from line 35 it's possible to see all the patches required to complete the manifest:

```yaml
apiVersion: apiextensions.crossplane.io/v1
kind: Composition
metadata:
  name: fireworksapp.deployment.krateo.io
spec:
  compositeTypeRef:
    apiVersion: deployment.krateo.io/v1alpha1
    kind: FireworksApp
  resources:
    - base:
        apiVersion: kubernetes.crossplane.io/v1alpha1
        kind: Object
        spec:
          forProvider:
            manifest:
              apiVersion: argoproj.io/v1alpha1
              kind: Application
              metadata:
                namespace: krateo-system
              spec:
                project: default
                source:
                  targetRevision: HEAD
                  path: chart
                destination:
                  server: https://kubernetes.default.svc
                  namespace: krateo-system
                syncPolicy:
                  automated:
                    prune: true
                    selfHeal: true
                  syncOptions:
                    - CreateNamespace=true
      patches:
        - fromFieldPath: "metadata.uid"
          toFieldPath: "metadata.labels[deploymentId]"
        - fromFieldPath: "metadata.uid"
          toFieldPath: "spec.forProvider.manifest.metadata.labels[deploymentId]"
        - fromFieldPath: "metadata.name"
          toFieldPath: "metadata.name"
          transforms:
            - type: string
              string:
                fmt: "%s-argocd-app-object"
        - fromFieldPath: "metadata.name"
          toFieldPath: "spec.forProvider.manifest.metadata.name"
        - fromFieldPath: metadata.name
          toFieldPath: spec.providerConfigRef.name
          transforms:
            - type: string
              string:
                fmt: "%s-provider-k8s-pc-in"
        - type: CombineFromComposite
          combine:
            variables:
              - fromFieldPath: "spec.values.toRepo.organizationName"
              - fromFieldPath: "spec.values.toRepo.repositoryName"
            strategy: string
            string:
              fmt: "https://github.com/%s/%s"
          toFieldPath: "spec.forProvider.manifest.spec.source.repoURL"
        - fromFieldPath: "spec.namespace"
          toFieldPath: "spec.forProvider.manifest.metadata.namespace"
        - fromFieldPath: "spec.namespace"
          toFieldPath: "spec.forProvider.manifest.spec.destination.namespace"
```

The same manifest can be rendered using Helm:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: {{ include "fireworks-app.fullname" . }}
  namespace: {{ .Values.argocd.namespace | default "argocd" }}
  labels:
    {{- include "fireworks-app.labels" . | nindent 4 }}
spec:
  project: {{ .Values.argocd.application.project | default "default" }}
  source:
    repoURL: {{ include "fireworks-app.toRepoUrl" . }}
    targetRevision: {{ .Values.git.toRepo.branch }}
    path: {{ .Values.argocd.application.source.path }}
  destination:
    server: {{ .Values.argocd.application.destination.server }}
    namespace: {{ .Values.argocd.application.destination.namespace }}
  syncPolicy:
    automated:
      prune: {{ .Values.argocd.application.syncPolicy.automated.prune }}
      selfHeal: {{ .Values.argocd.application.syncPolicy.automated.selfHeal }}
    syncOptions:
    {{- range .Values.argocd.application.syncPolicy.syncOptions }}
      - {{ . }}
    {{- end }}
```

Every value retrieved from the Crossplane deployment file like `spec.values.toRepo.organizationName`:

```yaml
- type: CombineFromComposite
  combine:
    variables:
      - fromFieldPath: "spec.values.toRepo.organizationName"
      - fromFieldPath: "spec.values.toRepo.repositoryName"
    strategy: string
    string:
      fmt: "https://github.com/%s/%s"
  toFieldPath: "spec.forProvider.manifest.spec.source.repoURL"
```

can be managed using the values file of a Helm chart, eventually specifying some variables inside `_helpers.tpl`:

```yaml
{{/*
Compose toRepo URL
*/}}
{{- define "fireworks-app.toRepoUrl" -}}
{{- printf "%s/%s/%s" .Values.git.toRepo.scmUrl .Values.git.toRepo.org .Values.git.toRepo.name }}
{{- end }}
```

### Implementation of value.schema.json

Helm charts use values.schema.json files extensively. It plays a pivotal role in defining the structure and validation rules for the values that can be passed to a chart during installation or upgrade. Understanding its role is key to mastering the best practices for Helm charts:

1. **Validation and Schema Enforcement**:
   * Utilize Values.schema.json to enforce a schema for the values passed to your Helm chart. This ensures that users' values adhere to a predefined structure and format.
   * Define the expected format, data types, and constraints for each value parameter in the schema file. This helps prevent misconfigurations and ensures that the chart operates as intended.
   * Use tools like `helm lint` or IDE integrations to validate values files against the schema during development, catching potential errors early in development.

2. **Documentation and Self-Discovery**:
   * Include documentation within the Values.schema.json file describing each parameter's purpose, allowed values, and constraints.
   * The schema file is a form of self-discovery for users deploying your Helm chart. They can inspect the schema to understand the available configuration options and how they should be formatted.
   * Enhanced documentation and self-discovery capabilities improve the usability of your Helm chart and reduce the likelihood of misconfigurations or errors during deployment.

3. **Enhanced User Experience**:
   * Providing a well-defined schema for chart values improves the user experience by guiding users in providing the correct configuration options.
   * Errors and misconfigurations are caught early during deployment, reducing troubleshooting efforts and ensuring smoother deployments.
   * Clear validation rules communicated through the schema file help users understand what configurations are supported and how they should be formatted, reducing ambiguity and confusion.

By incorporating Values.schema.json into your Helm chart development process, you're not just enhancing validation, documentation, and user experience. You're also significantly boosting the reliability and maintainability of your Kubernetes applications deployed via Helm.

Krateo uses the values.schema.json to generate dynamically the Custom Resource Definition of the composition and the rendering of the WebUI form presented to the end user while instantiating the template. To consult every kind of check available through JSON Schema: [https://json-schema.org/draft/2020-12/json-schema-validation](https://json-schema.org/draft/2020-12/json-schema-validation)

There is an example of Krateo template (krateo-template-fireworksapp) already converted to an Helm chart available here:

* [https://github.com/krateoplatformops/krateo-template-fireworksapp](https://github.com/krateoplatformops/krateo-template-fireworksapp)
* [https://github.com/krateoplatformops/krateo-v2-template-fireworksapp](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp)

Here you can verify a valid `values.schema.json` generated for this template: [https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/chart/values.schema.json](https://github.com/krateoplatformops/krateo-v2-template-fireworksapp/blob/main/chart/values.schema.json)
