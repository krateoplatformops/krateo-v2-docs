# Release 2.5.0 - Shaping the Future of the Platform

Krateo version 2.5.0 marks a significant milestone in the evolution of the platform. This release introduces foundational changes—especially in the frontend experience and FinOps integration—that set the stage for a more composable, multi-tenant, and cost-aware future.

### **What’s New in 2.5.0**

**Composable Portal v2**
The frontend architecture has been redesigned for better performance and flexibility
- Progressive page loading for improved responsiveness, especially in case of a large number of resources to list
- New widget definition structure
- Simplified Page composition flow
- Field order in forms now follows the CompositionDefinition
- Filters on DataTable widgets
- Filters for widget visibility within pages

**AuthN supporting JWT**
Authentication now includes support for JWT tokens, improving interoperability and security.

**Upgrade SnowPlow & RestAction**
Both have evolved to support the new Composable Portal v2 features.

**Multi-tenancy core**
Core platform changes to support isolated, namespace-aware configurations and user contexts.

**Extended Operator Generator Documentation** 
The oasgen-provider documentation has been extended introducing a step-by-step guide to create an operator from scratch.
Explore the guide here https://github.com/krateoplatformops/oasgen-provider?tab=readme-ov-file

**Github provider rewritten with oasgen-provider**
The GitHub provider has been rewritten using the Operator generator. 
It's not part of the default installation process, but you can find it here https://github.com/krateoplatformops/github-provider-kog-chart
A usage example is present in the firework-app-v2 repository https://github.com/krateoplatformops/krateo-v2-template-fireworksapp

**FinOps 1.1**
The FinOps module continues to evolve with more intelligence and policy-driven automation:
	•	Integration with Open Policy Agent (OPA) for customizable cost control
	•	A new “moving window” optimization algorithm for dynamic resource efficiency
	•	Azure cost showback is now visible directly in the Composition tab (FinOps section)

### How to Upgrade 
```
helm upgrade installer installer \
 --repo https://charts.krateo.io \
 --namespace krateo-system \
 --create-namespace \
 --set krateoplatformops.service.type=LoadBalancer \
 --set krateoplatformops.service.externalIpAvailable=true \
 --install \
 --version 2.5.0\
 --wait
```

### Breaking Changes
**Composable Portal v2**
* To be able to use the new version of the composable portal, it's necessary to add some portal yaml definition to your Composition Definition. 
* Check the Migration guide doc https://github.com/orgs/krateoplatformops/discussions/49
* Check the fireworks-app repository as an example https://github.com/krateoplatformops/krateo-v2-template-fireworksapp
* Chek the Finops composition as another example https://github.com/krateoplatformops/krateo-v2-template-finops-example-pricing-vm-azure
* Check the portal documentation (_comming soon_) 

**Resource-Tree Handler:**
- The CompositionReference object for the resource-tree-handler, which is used as the root object of the resource tree (i.e., composition status tree), is now identified by the composition-id and composition-installed-version labels instead of name, namespace, group, apiversion, kind. These labels are applied automatically if you install the CompositionReference as part of a composition, however, if you installed the CompositionReference CR outside of a composition, you will need to manually patch the composition id. See [here](https://github.com/krateoplatformops/resource-tree-handler?tab=readme-ov-file#configuration) for more information.

### Compatibility Matrix & repository release notes
You can find a detailed Release notes for every componet here https://github.com/krateoplatformops/installer-chart/releases 

# What's coming next
Looking ahead to 2.6, we’re working on:
- Centralized Logging
- An Administrator Dashboard to monitor Krateo components and manage RBAC
- Blueprints: opinionated Krateo configurations for common use cases
- A new marketplace to distribute Blueprints, Operators, and configurations
