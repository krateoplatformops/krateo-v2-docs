# **Krateo 2.5.1 – The Blueprint Marketplace is Live!**

Krateo 2.5.1 is a cornerstone release. Krateo 2.5.1 builds on the foundations of 2.5 and takes an important step forward: it officially opens the door to the **Blueprint Marketplace**.

With Blueprints, you can start from ready-made, opinionated solutions that address common use cases — install them as they are, or use them as a foundation for your own customization. From now on, every Blueprint will be tied to a minimum Krateo version, starting with 2.5.1.

## Blueprint Marketplace

The Marketplace is now live! 🎉
Explore the first set of available Blueprints here:

https://github.com/krateoplatformops-blueprints

## Blueprint

All the blueprints involving the frontend have been made multi-tenancy aware.

Highlights in this release:

- *Multi-tenancy support has been added across all frontend-related Blueprints.*
- github-scaffolding
- github-scaffolding-with-composition-page
- portal
- portal-blueprint-page
- portal-composition-page-generic
- portal-admin-page

## Generators

Starting from Krateo 2.6, the Marketplace will also include all providers developed with the oasgen-provider.

- **New:**
    - Azure DevOps Provider KOG: Supporting the gitrepository, pipeline and pipelinepermission resources. The previous Azure DevOps provider remains available until all the resources are migrated to the KOG.
- **Rewritten with oasgen-provider evolution:**
    - GitHub Provider
    - GitLab Provider

## Components

Blueprint development is directly driving the evolution of Krateo’s core components.

### Installer - improved upgrade workflow
The Krateo installer-chart now has the CRD of the installer as a dependency, this allows for: 
- smoother updates and upgrades
- avoiding manually upgrading the CRD of the installer

### Frontend - more usability & control

Frontend improvements focus on usability and control:

- **Improved data handling**: Now it’s possible to add filters in the EventList.
- **More flexibility**: Add buttons to table cells, edit composition values directly, and customize success messages in the Toaster.
- **Improved reliability**: Cache now invalidates automatically when tokens expire; fixes to breadcrumb, filters, and navigation.
- **New visualization options**: Markdown widget added.
- **Operational control:** Users can now pause a composition’s reconciliation cycle. Users can edit the values in a Composition drawer and apply the changes to the cluster.

### SnowPlow - more flexibility

- Frontend updates to support all the features above.
- RestAction enhancement: Custom function, “serverless” REST action, exposes the jq engine to the frontend.
- Support for all HTTP Verbs

### Core components - Scale and performance

- Gracefully pause a composition. A composition will be paused only when all related resources are effectively paused.
- Queue Optimization: User Event has priorities against Service Event. Event from Compositions modified by the user have higher processing priority in comparison of service reconciliation Events. It’s useful when we have thousands of compositions deployed, and the creation of a new composition doesn’t have to wait a full cycle of reconciliation before being applied
- Queue Optimization:  User-initiated events have processing priority over service reconciliation events. It’s useful when we have thousands of compositions deployed, and the creation of a new composition doesn’t have to wait a full cycle of reconciliation before being applied
- Git-provider revision and bug fixing

### OASGen Provider

The OASGen provider underwent a massive refactoring, paving the way for new functionality and easier extensions. 

- Better separation of responsibility: new Configuration resource for every managed resource to handle authentication and configuration parameters.
- Improved documentation: the documentation goes into details about architecture, workflow and Rest Definition, and adds a section on the new Configuration resources and a reference to the renewed Usage Guide.

### Documentation Improvement
In this release, we continued our work on expanding and refining existing documentation, as well as creating new documentation to describe new features.

- Frontend 
   - [Widgets Reference](https://github.com/krateoplatformops/frontend/blob/main/docs/widgets-api-reference.md) 
   - [General Widget description](https://github.com/krateoplatformops/frontend/blob/main/docs/docs.md)
   - [Action Button Guide](https://github.com/krateoplatformops/frontend/blob/main/docs/guides/action-button/action-button.md)
   - [Simple Page Guide](https://github.com/krateoplatformops/frontend/blob/main/docs/guides/simple-page/simple-page.md) 
- Oasgen provider
   - [General provider description](https://github.com/krateoplatformops/oasgen-provider/blob/main/README.md)
   - [Usage Guide](https://github.com/krateoplatformops/oasgen-provider/blob/main/docs/USAGE_GUIDE.md) 
- Azure DevOps provider Kog
  - [General Provider Description](https://github.com/krateoplatformops/azuredevops-provider-kog-chart/blob/main/README.md)
  - [Migration Guide](https://github.com/krateoplatformops/azuredevops-provider-kog-chart/blob/main/docs/migration_guide.md)  
- Composition Dynamic Controller
  - [General controller description](https://github.com/krateoplatformops/composition-dynamic-controller/blob/main/README.md) 


## FinOps

FinOps module now has some new portal element. Staring from Krateo 2.6 the portal section will be moved in the marketplace as a dedicated blueprint.

- Dashboard Introduction: A new dashboard has been introduced
- Notebook upload: It’s now possible to upload a notebook defining algorithms to the FinOps engine.

## Breaking Changes

To add some essential functionality we had to introduce some breaking changes.

### Frontend
- most widgets are now required to include the `allowedResources` property within `widgetData`, which specifies the widgets that can be added as children or referenced through `resourcesRefs`
- the `Table` widget enforces strong typing for the `data` property: rows and cells must follow the new format. Tables and REST actions that populate `data` should be updated accordingly
- the `resourcesRefs` property has changed format: previously an array, it is now an object with an `items` property containing the resource list
- in the `FlowChart` component, the `health` property has been removed and replaced by `icon` and `statusIcon`.

### OASGen provider

- Changed API group of RestDefinition from: `swaggergen.krateo.io/v1alpha1` to `ogen.krateo.io/v1alpha1`
- Dropped the use of standalone, shared authentication resources in favour of Configuration resources specific for every managed resource (Kind).

### GitHub Provider KOG

Changes in resources' schema due to OASGen updates:
- `authenticationRefs` is substituted by `configurationRef` and therefore the need of substitution of the authentication CR with the configuration CR 
- Runner group resource: removed some fields from the resource CRD that can now be set on the specific configuration CR (kind: RunnerGroupConfiguration) 

### GitLab Provider KOG

Changes in resources' schema due to OASGen updates:
- `authenticationRefs` is substituted by `configurationRef` and therefore the need of substitution of the authentication CR with the configuration CR 

### Azure DevOps Provider KOG

Changes in resources' schema due to OASGen updates:
- `authenticationRefs` is substituted by `configurationRef` and therefore the need of substitution of the authentication CR with the configuration CR 

## What’s next for 2.6

With version 2.6, the Marketplace will expand further: 
- operators will move into the Marketplace repository, 
- new Admin Page updates are forthcoming, 
- Introduction to the GitOps Blueprint.
- Improved documentation of existing BluePrint
- DataGrid pagination, enabling the display of thousands of compositions on a page