
## Goal

Create a polished PNG infographic in English for non-technical and semi-technical stakeholders that explains what the Krateo `oasgen-provider` does, how it works, its value, limits, and operational risks.

The output should be suitable for:

- stakeholder reviews
- architecture overviews
- onboarding decks
- product/platform documentation
- internal presentations

## Format

- Output type: PNG
- Orientation: landscape
- Aspect ratio: 16:9
- Use case: `infographic-diagram`
- Audience: business stakeholders, platform leads, architects, solution engineers

## Visual Direction

Use a clean enterprise technology visual language with:

- white or very light background
- structured card layout
- blue / teal / amber accents
- crisp vector-like illustrations
- premium platform-engineering aesthetic
- subtle shadows and layered panels
- highly legible typography
- balanced spacing and clear reading order

Avoid:

- clutter
- tiny unreadable labels
- code blocks
- logos
- screenshots
- watermarks
- overly developer-centric jargon without context

## Main Content Prompt

Create a polished PNG infographic in English for non-technical and semi-technical stakeholders that explains what the Krateo OASGen Provider does, how it works, its value, limits, and risks. The graphic should feel clear, trustworthy, executive-friendly, and suitable for documentation, presentations, or stakeholder reviews.

Use case: infographic-diagram
Asset type: stakeholder-facing architecture explainer
Aspect ratio: landscape 16:9
Style: clean enterprise technology infographic, white or very light background, structured card layout, crisp vector-like illustrations, blue/teal/amber accents, premium platform-engineering aesthetic, excellent typography, fully readable text.

Main title: "What OASGen Provider Does"
Subtitle: "Turn OpenAPI specifications into Kubernetes-managed resources"

Layout requirements:
- Top summary band with 3 short value statements:
  - "Generate CRDs from OpenAPI"
  - "Deploy dynamic controllers automatically"
  - "Manage external APIs as Kubernetes resources"

- Central left-to-right workflow diagram with labeled stages:
  1. "RestDefinition"
  2. "Fetch OpenAPI spec"
  3. "Generate CRD schema"
  4. "Deploy Rest Dynamic Controller"
  5. "Create Kubernetes resource"
  6. "Reconcile with external API"

- On the left, a small context card titled "Inputs" with bullets:
  - "OpenAPI 3.0 / 3.1 specification"
  - "Resource mapping and actions"
  - "Authentication and configuration"

- On the right, a small context card titled "Outputs" with bullets:
  - "Generated CRD"
  - "Configuration resource"
  - "Isolated controller per RestDefinition"
  - "Managed external resource lifecycle"

- Add a panel titled "Why stakeholders care" with 4 concise points:
  - "Faster onboarding of new APIs"
  - "Less custom operator code to build and maintain"
  - "Stronger consistency with the API contract"
  - "Reduced blast radius through isolated controllers"

- Add a panel titled "Advantages" with 4 concise points:
  - "OpenAPI as source of truth"
  - "Type-safe CRDs and validation"
  - "Optional plugin layer for inconsistent APIs"
  - "Reuse Kubernetes secrets for credentials"

- Add a panel titled "Limits" with 5 concise items:
  - "Requires OpenAPI 3.0 or 3.1"
  - "Some OpenAPI features are not supported"
  - "Inconsistent APIs may require a plugin"
  - "Only basic and bearer authentication are supported"
  - "Changing OAS carelessly can cause schema drift"

- Add a panel titled "Operational risks" with warning icons and 5 short items:
  - "Schema drift when APIs evolve"
  - "Validation failures from mismatched response types"
  - "Inefficient find-by patterns on large collections"
  - "Plugin dependency for non-conforming APIs"
  - "Cluster-to-API connectivity or auth failures"

- Add a narrow footer strip with this text:
  "Typical flow: RestDefinition -> generated CRD -> dynamic controller -> Kubernetes resource -> external API reconciliation"

Visual requirements:
- Use meaningful icons for OpenAPI, CRD, controller, Kubernetes resource, external API, plugin, security, warning
- Show the optional plugin as a small side-path between controller and external API, labeled "Optional plugin / wrapper service"
- Keep the visual balanced, not crowded
- Make the text exact, concise, and easy to read
- No logos, no watermarks, no screenshots, no code blocks

## Suggested Layout

Top band:

- title and subtitle
- 3 short value statements

Left rail:

- `Inputs`
- compact supporting context

Center area:

- main workflow from RestDefinition to reconciliation
- visual emphasis on generated artifacts and automated controller deployment
- optional plugin shown as a side-path before the external API

Right rail:

- `Outputs`
- `Why stakeholders care`
- `Advantages`
- `Limits`
- `Operational risks`

Bottom strip:

- lifecycle summary

## Exact Text Inventory

Use these strings exactly where possible:

- `What OASGen Provider Does`
- `Turn OpenAPI specifications into Kubernetes-managed resources`
- `Generate CRDs from OpenAPI`
- `Deploy dynamic controllers automatically`
- `Manage external APIs as Kubernetes resources`
- `RestDefinition`
- `Fetch OpenAPI spec`
- `Generate CRD schema`
- `Deploy Rest Dynamic Controller`
- `Create Kubernetes resource`
- `Reconcile with external API`
- `Inputs`
- `Outputs`
- `Why stakeholders care`
- `Advantages`
- `Limits`
- `Operational risks`
- `Optional plugin / wrapper service`
- `Typical flow: RestDefinition -> generated CRD -> dynamic controller -> Kubernetes resource -> external API reconciliation`

## Message Framing

The infographic should communicate these business-level ideas:

- This provider reduces the effort required to expose external APIs as Kubernetes resources.
- It uses the OpenAPI contract as a reusable source of truth.
- It decreases custom operator development but does not eliminate the need for API quality and governance.
- It is strongest when APIs are reasonably consistent and well-described.
- It may require plugins or adaptation layers for non-conforming APIs.

## Notes

- Prioritize readability and trustworthiness.
- Keep the tone executive-friendly, but technically credible.
- Show both opportunity and risk in a balanced way.
- Make the infographic understandable in a single glance.
