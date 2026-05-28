## Goal

Create a polished PNG infographic in English for stakeholders that explains what the Krateo `rest-dynamic-controller` does, how it works, its strengths, limits, and operational risks.

The output should be suitable for:

- stakeholder reviews
- architecture overviews
- platform onboarding
- internal presentations
- documentation pages

## Format

- Output type: PNG
- Orientation: landscape
- Aspect ratio: 16:9
- Use case: `infographic-diagram`
- Audience: non-technical and semi-technical stakeholders

## Visual Direction

Use a clean enterprise technology visual language with:

- very light background
- structured card layout
- vector-like illustrations
- blue / teal / orange accents
- premium Kubernetes and API operations aesthetic
- highly readable typography
- subtle shadows and layered panels

Avoid:

- clutter
- developer-only language with no context
- logos
- screenshots
- code blocks
- watermarks

## Main Content Prompt

Create a polished PNG infographic in English for stakeholders that explains what the Krateo Rest Dynamic Controller does, how it works, its strengths, limits, and operational risks. The audience is non-technical and semi-technical stakeholders, but the content must remain technically credible and easy to follow.

Use case: infographic-diagram
Asset type: stakeholder-facing controller explainer
Aspect ratio: landscape 16:9
Style: clean enterprise technology infographic, very light background, structured card layout, vector-like illustrations, blue/teal/orange accents, premium Kubernetes and API operations aesthetic, highly readable typography.

Main title: "What Rest Dynamic Controller Does"
Subtitle: "Reconcile Kubernetes resources with external REST APIs"

Layout requirements:
- Top summary band with 3 concise value statements:
  - "Observes remote state"
  - "Creates, updates, and deletes external resources"
  - "Keeps external systems aligned with Kubernetes desired state"

- Central workflow diagram from left to right with labeled stages:
  1. "Custom Resource"
  2. "Load RestDefinition rules"
  3. "Observe remote resource"
  4. "Findby / Get"
  5. "Create / Update / Delete"
  6. "Update status and conditions"

- Left card titled "What it needs" with bullets:
  - "Generated CRD and Custom Resource"
  - "RestDefinition action mappings"
  - "Configuration and authentication"
  - "Connectivity to the external API"

- Right card titled "What it produces" with bullets:
  - "Managed resource lifecycle"
  - "Observed state in status"
  - "Drift detection and reconciliation"
  - "Condition-based feedback"

- Panel titled "Why it matters" with 4 points:
  - "Turns REST APIs into manageable platform resources"
  - "Reuses one controller pattern across many APIs"
  - "Reduces handwritten integration logic"
  - "Supports controlled reconciliation loops"

- Panel titled "Strengths" with 4 concise points:
  - "Generic reconciliation model"
  - "Works with generated resource types"
  - "Supports optional plugins for edge cases"
  - "Fits Kubernetes operational patterns"

- Panel titled "Limits" with 5 concise items:
  - "Depends on well-defined RestDefinition behavior"
  - "Relies on API response consistency"
  - "Complex APIs may need wrapper services"
  - "External latency affects reconciliation speed"
  - "Authentication and connectivity must be correct"

- Panel titled "Operational risks" with warning icons and 5 short items:
  - "Infinite drift from mismatched response formats"
  - "Failed status updates from schema mismatches"
  - "Large find-by collections can be inefficient"
  - "External API outages or throttling"
  - "Misconfigured mappings can break reconciliation"

- Show an optional side-path labeled "Optional plugin / wrapper service" between controller and external API

- Add footer strip text:
  "Typical loop: observe -> compare -> act -> update status -> repeat"

Visual requirements:
- Use icons for Kubernetes resource, controller, REST API, search, sync, warning, status, plugin
- Keep the flow understandable in one glance
- Make text exact, concise, and fully legible
- No logos, no screenshots, no watermark, no code blocks

## Suggested Layout

Top band:

- title and subtitle
- 3 short value statements

Left rail:

- `What it needs`

Center area:

- runtime reconciliation loop
- observe and action stages
- optional plugin before external API

Right rail:

- `What it produces`
- `Why it matters`
- `Strengths`
- `Limits`
- `Operational risks`

Bottom strip:

- lifecycle summary

## Exact Text Inventory

Use these strings exactly where possible:

- `What Rest Dynamic Controller Does`
- `Reconcile Kubernetes resources with external REST APIs`
- `Observes remote state`
- `Creates, updates, and deletes external resources`
- `Keeps external systems aligned with Kubernetes desired state`
- `Custom Resource`
- `Load RestDefinition rules`
- `Observe remote resource`
- `Findby / Get`
- `Create / Update / Delete`
- `Update status and conditions`
- `What it needs`
- `What it produces`
- `Why it matters`
- `Strengths`
- `Limits`
- `Operational risks`
- `Optional plugin / wrapper service`
- `Typical loop: observe -> compare -> act -> update status -> repeat`

## Notes

- Keep the message stakeholder-friendly but technically credible.
- Emphasize that this is the runtime reconciliation engine, not the CRD generator.
- Prioritize readability and fast comprehension.
