---
description: Krateo PlatformOps github-provider KOG (generated via OASGen-provider)
sidebar_label: github-provider-kog
---

# Krateo PlatformOps github-provider-kog

* [github-provider-kog](https://doc.crds.dev/github.com/krateoplatformops/github-provider-kog-chart)

# GitHub Provider Helm Chart

This is a [Helm Chart](https://helm.sh/docs/topics/charts/) that deploys the Krateo GitHub Provider leveraging the [Krateo OASGen Provider](https://github.com/krateoplatformops/oasgen-provider) and using [OpenAPI Specifications (OAS) of the GitHub REST API](https://github.com/github/rest-api-description/blob/main/descriptions/api.github.com/api.github.com.2022-11-28.yaml).
This provider allows you to manage GitHub resources such as repositories, collaborators, and workflow runs using the Krateo platform.

> [!NOTE]  
> This chart is going to replace the [original Krateo github-provider](https://github.com/krateoplatformops/github-provider) in the future. 

## Summary

- [Summary](#summary)
- [Requirements](#requirements)
- [How to install](#how-to-install)
- [Supported resources](#supported-resources)
  - [Resource details](#resource-details)
    - [Repo](#repo)
    - [Collaborator](#collaborator)
    - [TeamRepo](#teamrepo)
    - [Workflow](#workflow)
    - [RunnerGroup](#runnergroup)
  - [Resource examples](#resource-examples)
- [Authentication](#authentication)
- [Configuration](#configuration)
  - [values.yaml](#valuesyaml)
  - [Verbose logging](#verbose-logging)
- [Chart structure](#chart-structure)
- [Troubleshooting](#troubleshooting)

## Requirements

[Krateo OASGen Provider](https://github.com/krateoplatformops/oasgen-provider) should be installed in your cluster. Follow the related Helm Chart [README](https://github.com/krateoplatformops/oasgen-provider-chart) for installation instructions.

## How to install

To install the chart, use the following commands:

```sh
helm repo add krateo https://charts.krateo.io
helm repo update krateo
helm install github-provider krateo/github-provider-kog
```

> [!NOTE]
> Due to the nature of the providers leveraging the [Krateo OASGen Provider](https://github.com/krateoplatformops/oasgen-provider), this chart will install a set of RestDefinitions that will in turn trigger the deployment of controllers in the cluster. These controllers need to be up and running before you can create or manage resources using the Custom Resources (CRs) defined by this provider. This may take a few minutes after the chart is installed.

You can check the status of the controllers by running:
```sh
until kubectl get deployment github-provider-<RESOURCE>-controller -n <YOUR_NAMESPACE> &>/dev/null; do
  echo "Waiting for <RESOURCE> controller deployment to be created..."
  sleep 5
done
kubectl wait deployments github-provider-<RESOURCE>-controller --for condition=Available=True --namespace <YOUR_NAMESPACE> --timeout=300s
```

Make sure to replace `<RESOURCE>` to one of the resources supported by the chart, such as `repo`, `collaborator`, `teamrepo`, `workflow` or `runnergroup`, and `<YOUR_NAMESPACE>` with the namespace where you installed the chart.

## Supported resources

This chart supports the following resources and operations:

| Resource     | Get  | Create | Update | Delete |
|--------------|------|--------|--------|--------|
| Collaborator | ✅   | ✅     | ✅     | ✅     |
| Repo         | ✅   | ✅     | ✅     | ✅     |
| TeamRepo     | ✅   | ✅     | ✅     | ✅     |
| Workflow     | 🚫 Not applicable   | ✅     | 🚫 Not applicable    | 🚫 Not applicable     |
| RunnerGroup     | ✅   | ✅     | ✅     | ✅     |

> [!NOTE]  
> 🚫 *"Not applicable"* indicates that the operation is not supported by this provider because it probably does not make sense for the resource type.  For example, GitHub Workflow runs are typically not updated or deleted directly; they are triggered and if a new run is needed, a new workflow run is created.

The resources listed above are Custom Resources (CRs) defined in the `github.krateo.io` API group. They are used to manage GitHub resources in a Kubernetes-native way, allowing you to create, update, and delete GitHub resources using Kubernetes manifests.

### Resource details

#### Repo

The `Repo` resource allows you to create, update, and delete GitHub repositories. 
You can specify the repository name, description, visibility (public or private), and other settings that can be seen in the [GitHub REST API documentation](https://docs.github.com/en/rest/repos?apiVersion=2022-11-28) and the selected OpenAPI Specification in the `/assets` folder of this chart.

An example of a Repo resource is:
```yaml
apiVersion: github.kog.krateo.io/v1alpha1
kind: Repo
metadata:
  name: test-repo
  namespace: ghp
  annotations:
    krateo.io/connector-verbose: "true"
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  org: krateoplatformops-test
  name: test-repo
  description: A short description of the repository set by Krateo
  visibility: public
  has_issues: true
```

#### Collaborator 

The `Collaborator` resource allows you to add and remove collaborators from a GitHub repository. 
You can specify the username of the collaborator and the permission level among `admin`, `pull`, `push`, `maintain`, and `triage`.
Updating a collaborator's permission level is also supported.

In addition, this resource supports adding "external collaborators" to a repository, meaning users who are not members of the organization that owns the repository.
In this case, an invitation will be sent to the user with the specified permission level.
Updating and deleting invitations is supported through the same resource.
You can verify whether the user is directly added as a collaborator or if the invitation is pending by checking the `message` field in the Collaborator resource status.
Note that the Collaborator resource will remain in a `Pending` state until the user accepts the invitation.


An example of a Collaborator resource is:
```yaml
apiVersion: github.kog.krateo.io/v1alpha1
kind: Collaborator
metadata:
  name: add-collaborator
  namespace: ghp
  annotations:
    krateo.io/connector-verbose: "true"
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  owner: krateoplatformops-test
  repo: collaborator-tester
  username: vicentinileonardo
  permission: pull
```

#### TeamRepo

The `TeamRepo` resource allows you to manage team access to GitHub repositories. 
You can specify the `team_slug`, repository name, and permission level among `admin`, `pull`, `push`, `maintain`, and `triage`.

An example of a TeamRepo resource is:
```yaml
apiVersion: github.kog.krateo.io/v1alpha1
kind: TeamRepo
metadata:
  name: test-teamrepo
  namespace: ghp
  annotations:
    krateo.io/connector-verbose: "true"
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  org: krateoplatformops-test
  owner: krateoplatformops-test
  team_slug: testteam
  repo: teamrepo-tester
  permission: pull
```

#### Workflow

The `Workflow` resource allows you to trigger GitHub Actions workflow runs (`workflow_dispatch`). 
You can specify the repository name, workflow file name, and any input parameters required by the workflow. 
You must configure your GitHub Actions workflow to run when the [`workflow_dispatch` webhook](/developers/webhooks-and-events/webhook-events-and-payloads#workflow_dispatch) event occurs. 
The `inputs` must configured in the workflow file.
Please refer to the [GitHub REST API documentation](https://docs.github.com/en/rest/actions/workflows?apiVersion=2022-11-28#create-a-workflow-dispatch-event) for more information.

An example of a Workflow resource is:
```yaml
apiVersion: github.kog.krateo.io/v1alpha1
kind: Workflow
metadata:
  name: workflow-tester
  namespace: ghp
  annotations:
    krateo.io/connector-verbose: "true"
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  owner: krateoplatformops-test
  repo: workflow-tester
  workflow_id: test.yaml
  ref: main
  inputs:
    environment: development
    version: "v1.2.3"
    debug_enabled: "false"
    custom_message: "Test 04/06 at 13:42 from Krateo"
```

#### RunnerGroup

The `RunnerGroup` resource allows you to manage GitHub runner groups. You can specify the runner group name, and any additional settings required by the runner group such as `visibility` and `allows_public_repositories`.

An example of a RunnerGroup resource is:
```yaml
apiVersion: github.kog.krateo.io/v1alpha1
kind: RunnerGroup
metadata:
  name: runnergroup-test
  namespace: ghp
  annotations:
    krateo.io/connector-verbose: "true"
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  name: runner-test-by-krateo
  org: krateoplatformops-test
  allows_public_repositories: false
```

### Resource examples

You can find example resources for each supported resource type in the `/samples` folder of the chart.
These examples Custom Resources (CRs) show every possible field that can be set in the resource based reflected on the Custom Resource Definitions (CRDs) that are generated and installed in the cluster.

## Authentication

The authentication to the GitHub REST API is managed using 2 resources (both are required):

- **Kubernetes Secret**: This resource is used to store the GitHub Personal Access Token (PAT) that is used to authenticate with the GitHub REST API. The PAT should have the necessary permissions to manage the resources you want to create or update.

In order to generate a GitHub token, follow this instructions: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-personal-access-token-classic

Example of a Kubernetes Secret that you can apply to your cluster:
```sh
kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: gh-token
  namespace: krateo-system
type: Opaque
stringData:
  token: <PAT>
EOF
```

Replace `<PAT>` with your actual GitHub Personal Access Token.

- **BearerAuth**: This resource references the Kubernetes Secret and is used to authenticate with the GitHub REST API. It is used in the `authenticationRefs` field of the resources defined in this chart.

Example of a BearerAuth resource that references the Kubernetes Secret, to be applied to your cluster:
```sh
kubectl apply -f - <<EOF
apiVersion: github.kog.krateo.io/v1alpha1
kind: BearerAuth
metadata:
  name: bearer-gh-ref
  namespace: ghp
spec:
  tokenRef:
    key: token
    name: gh-token
    namespace: krateo-system
EOF
```

## Configuration

### values.yaml

You can customize the chart by modifying the `values.yaml` file.
For instance, you can select which resources the provider should support in the oncoming installation by setting the `restdefinitions` field in the `values.yaml` file. 
This may be useful if you want to limit the resources managed by the provider to only those you need, reducing the overhead of managing unnecessary controllers.
The default configuration enables all resources supported by the chart.

### Verbose logging

In order to enable verbose logging for the controllers, you can add the `krateo.io/connector-verbose: "true"` annotation to the metadata of the resources you want to manage, as shown in the examples above. 
This will enable verbose logging for those specific resources, which can be useful for debugging and 2.0.2 as it will provide more detailed information about the operations performed by the controllers.

## Chart structure

Main components of the chart:

- **RestDefinitions**: These are the core resources needed to manage resources leveraging the Krateo OASGen Provider. In this case, they refers to the OpenAPI Specification to be used for the creation of the Custom Resources (CRs) that represent GitHub resources.
They also define the operations that can be performed on those resources. Once the chart is installed, RestDefinitions will be created and as a result, specific controllers will be deployed in the cluster to manage the resources defined with those RestDefinitions.

- **ConfigMaps**: Refer directly to the OpenAPI Specification content in the `/assets` folder.

- **/assets** folder: Contains the selected OpenAPI Specification files for the GitHub REST API.

- **/samples** folder: Contains example resources for each supported resource type as seen in this README. These examples demonstrate how to create and manage GitHub resources using the Krateo GitHub Provider.

- **Deployment**: Deploys a [plugin](https://github.com/krateoplatformops/github-rest-dynamic-controller-plugin) that is used as a proxy to resolve some inconsistencies of the GitHub REST API. The specific endpoins managed by the plugin are described in the [plugin README](https://github.com/krateoplatformops/github-rest-dynamic-controller-plugin/blob/main/README.md)

- **Service**: Exposes the plugin described above, allowing the resource controllers to communicate with the GitHub REST API through the plugin, only if needed.

# Troubleshooting

## Summary

- [Summary](#summary)
- [Checking RestDefinitions](#checking-restdefinitions)
- [Checking CRDs](#checking-crds)
- [Checking controllers](#checking-controllers)
- [Resources](#resources)
  - [Repo](#repo)
    - [Squash Merge Commit Message and Title](#squash-merge-commit-message-and-title)
      - [Valid Combinations](#valid-combinations)
    - [Wiki and Private Repositories](#wiki-and-private-repositories)
    - [`private` and `visibility` fields](#private-and-visibility-fields)
  - [Collaborator](#collaborator)
    - [Note on Organization Base Permissions](#note-on-organization-base-permissions)
  - [Workflow](#workflow)
    - [Wrong input fields set](#wrong-input-fields-set)

## Checking RestDefinitions

To check that the `restdefinitions` for the GitHub provider are correctly installed in the Kubernetes cluster, you can run the following command:
```sh
kubectl get restdefinition -n <YOUR_NAMESPACE>
```

You should see output similar to this:
```sh
NAME               READY
ghp-collaborator   True
ghp-repo           True
ghp-runnergroup    True
ghp-teamrepo       True
ghp-workflow       True
```

Note: if you confifure to install just a subset of `restdefinitions`, you may not see all of the above `restdefinitions`.

Note: the prefix `ghp-` came from the Helm release name and therefore may differ in your case.

## Checking CRDs

To check that the Custom Resource Definitions (CRDs) for the GitHub provider are installed in the Kubernetes cluster, you can run the following command:
```sh
kubectl get crds | grep github
```

If the CRDs are installed, you should see output similar to this:
```sh
bearerauths.github.kog.krateo.io                    2025-06-12T16:24:23Z
collaborators.github.kog.krateo.io                  2025-06-12T16:24:23Z
repoes.github.kog.krateo.io                         2025-06-12T16:24:23Z
runnergroups.github.kog.krateo.io                   2025-06-12T16:24:24Z
teamrepoes.github.kog.krateo.io                     2025-06-12T16:24:23Z
workflows.github.kog.krateo.io                      2025-06-12T16:24:24Z
```

Note: if you configure to install just a subset of `restdefinitions`, you may not see all of the above CRDs.

## Checking controllers

You can check the status of the controllers by running:
```sh
until kubectl get deployment github-provider-<RESOURCE>-controller -n <YOUR_NAMESPACE> &>/dev/null; do
  echo "Waiting for <RESOURCE> controller deployment to be created..."
  sleep 5
done
kubectl wait deployments github-provider-<RESOURCE>-controller --for condition=Available=True --namespace <YOUR_NAMESPACE> --timeout=300s
```

Make sure to replace `<RESOURCE>` to one of the resources supported by the chart, such as `repo`, `collaborator`, `teamrepo`, `workflow` or `runnergroup`, and `<YOUR_NAMESPACE>` with the namespace where you installed the chart.

## Resources

### Repo

#### Squash Merge Commit Message and Title

When configuring `squash_merge_commit_message` and `squash_merge_commit_title` fields, you must use a valid combination according to the [GitHub API documentation](https://docs.github.com/rest/repos/repos#create-an-organization-repository).

##### Valid Combinations

| `squash_merge_commit_title` | `squash_merge_commit_message` |
|-----------------------------|-------------------------------|
| `PR_TITLE`                  | `PR_BODY`                     |
| `PR_TITLE`                  | `BLANK`                       |
| `PR_TITLE`                  | `COMMIT_MESSAGES`             |
| `COMMIT_OR_PR_TITLE`        | `COMMIT_MESSAGES`             |

Make sure to avoid any combinations outside of the above to prevent API errors or unexpected behavior.

#### Wiki and Private Repositories

When enabling the wiki for a repository (using the `has_wiki: true` field in the Repo CR), you must ensure that the repository is public if your organization does not have a GitHub Pro, GitHub Team, GitHub Enterprise Cloud, or GitHub Enterprise Server plan.
The `has_wiki` field should be set to `true` only for public repositories unless your organization has the appropriate GitHub plan that allows wikis in private repositories.

[GitHub Docs](https://docs.github.com/en/communities/documenting-your-project-with-wikis/adding-or-editing-wiki-pages) state:
> Who can use this feature? Wikis are available in public repositories with GitHub Free and GitHub Free for organizations, and in public and private repositories with GitHub Pro, GitHub Team, GitHub Enterprise Cloud and GitHub Enterprise Server. For more information, see GitHub’s plans.

The combination of `has_wiki: true` and the fact that the repo is private will result in an error.
Wiki will not be enabled and the controller will be constantly see discrepancy between the desired state and the actual state of the repository.

#### `private` and `visibility` fields

When setting the `private` and `visibility` fields in the Repo CR, you must ensure that they are consistent with each other.
The `private` field is a boolean that indicates whether the repository is private or not, while the `visibility` field is a string that can be set to either `public`, `private`.
The field `private` is set to `false` by default.

### Collaborator

When configuring the `permissions` field for collaborators, ensure you're using one of the valid permission levels:

| Valid Permission Levels |
|-------------------------|
| `admin`                 |
| `maintain`              |
| `push`                  |
| `triage`                |
| `pull`                  |

#### Note on Organization Base Permissions

If the organization's "Base permissions" are set to `read`, and you attempt to add a collaborator (who is already a member of the organization) to a repository with `pull` permissions **as the initial permission**, the collaborator may **not** appear in the repository's collaborators list.
Practically this is just a visual choice of the GitHub UI, as the collaborator does have `pull` access to the repository.
Instead, an external collaborator with `pull` permissions will still be visible in the list with the `Pending Invite` label.

On the other hand, if you first add the collaborator with a higher permission level (e.g., `push`), and then downgrade the permission to `pull`, the collaborator **will** be visible in the list in the GitHub UI.

This behavior is related to how GitHub handles permission inheritance from organization-level settings.

### Workflow

#### Wrong input fields set

In your workflow file, you are able to set arbitrary input fields, like:
```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production
      version:
        description: 'Version to deploy'
        required: false
        default: 'latest'
        type: string
      debug_enabled:
        description: 'Enable debug mode'
        required: false
        default: false
        type: boolean
      custom_message:
        description: 'Custom message for this run'
        required: false
        type: string
jobs:
  dispatch-job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
    - name: Display inputs
      run: |
        echo "Running workflow with the following inputs:"
        echo "Environment: ${{ github.event.inputs.environment }}"
        echo "Version: ${{ github.event.inputs.version }}"
        echo "Debug enabled: ${{ github.event.inputs.debug_enabled }}"
        echo "Custom message: ${{ github.event.inputs.custom_message }}"
```

If in the Workflow CR you set the `inputs` field to something like this:
```yaml
spec:
  authenticationRefs:
    bearerAuthRef: bearer-gh-ref
  owner: krateoplatformops-test
  repo: workflow-tester
  workflow_id: test.yaml   # Can be the workflow file name
  ref: main                # branch or tag name
  inputs:
    environment: production
    version: "v1.2.3"
    debug_enabled: "false"
    custom_message: "Test from Krateo"
    field_not_in_workflow: "This field is not in the workflow file"
```

The workflow will not be triggered at all and you will receive an error like this when trying to dispatch the workflow:
```json
{
  "message": "Unexpected inputs provided: [\"field_not_in_workflow\"]",
  "documentation_url": "https://docs.github.com/rest/actions/workflows#create-a-workflow-dispatch-event",
  "status": "422"
}
```

This error can be seen by setting the annotation `krateo.io/connector-verbose: "true"` in the Workflow CR and checking the logs of the workflow controller.
To resolve this issue, ensure that the `inputs` field in your Workflow CR only contains keys that are defined in the workflow file. 
Remove any extraneous fields that do not match the workflow's input definitions.