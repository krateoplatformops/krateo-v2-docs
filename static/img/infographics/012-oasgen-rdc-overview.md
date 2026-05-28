
## Goal

Create a polished PNG infographic in English for business stakeholders that explains, at a very high level, how Krateo `oasgen-provider` and `rest-dynamic-controller` work together.

This version should be simpler and more concise than a detailed architecture diagram, and suitable for a single presentation slide.

## Format

- Output type: PNG
- Orientation: landscape
- Aspect ratio: 16:9
- Use case: `infographic-diagram`
- Audience: business stakeholders, executives, platform leads, solution owners

## Visual Direction

Use an elegant enterprise technology visual language with:

- very light background
- minimal but intentional layout
- strong visual hierarchy
- blue / teal / amber accents
- polished vector-like illustrations
- highly legible typography
- premium presentation-slide quality

Avoid:

- clutter
- long paragraphs
- low-level implementation detail
- code blocks
- logos
- screenshots
- watermarks

## Main Content Prompt

Create a premium executive-summary PNG infographic in English for business stakeholders that explains, at a very high level, how Krateo OASGen Provider and Rest Dynamic Controller work together. This version must be simpler and more concise than a detailed architecture diagram, suitable for a single presentation slide.

Use case: infographic-diagram
Asset type: executive summary slide visual
Aspect ratio: landscape 16:9
Style: elegant enterprise platform graphic, very light background, minimal but intentional layout, strong visual hierarchy, blue/teal/amber accents, polished vector-like illustrations, highly legible typography.

Main title: "API-to-Kubernetes Automation at a Glance"
Subtitle: "How OASGen Provider and Rest Dynamic Controller turn REST APIs into managed platform resources"

Layout requirements:
- Top row with 3 simple summary statements:
  - "Define the API contract"
  - "Generate the Kubernetes model"
  - "Operate the external resource lifecycle"

- Center graphic with 4 large stages connected left to right:
  1. "OpenAPI + RestDefinition"
  2. "OASGen Provider"
  3. "Generated CRD + Controller"
  4. "Managed external API resource"

- Small secondary label under stage 2: "Generation and deployment"
- Small secondary label under stage 3: "Runtime reconciliation"

- Right-side or lower-side panel titled "Business value" with 4 concise points:
  - "Faster onboarding of new APIs"
  - "Less custom operator development"
  - "Consistent platform governance"
  - "Reusable Kubernetes operating model"

- Another small panel titled "Watch-outs" with 4 concise items:
  - "API quality matters"
  - "Schema drift must be managed"
  - "Some APIs require plugins"
  - "Auth and connectivity remain critical"

- Optional tiny side path between generated controller and external API labeled:
  "Optional plugin"

- Footer strip text:
  "From API contract to automated reconciliation"

Visual requirements:
- Keep the amount of text intentionally low
- Use simple but premium icons for API contract, generator, controller, Kubernetes resource, external API, warning
- Make the handoff from design-time to runtime obvious
- No logos, no screenshots, no watermark, no code blocks

## Suggested Layout

Top band:

- title and subtitle
- 3 short summary statements

Center:

- 4-stage left-to-right journey
- clear transition from generation to runtime

Side or lower support area:

- `Business value`
- `Watch-outs`

Bottom strip:

- short closing tagline

## Exact Text Inventory

Use these strings exactly where possible:

- `API-to-Kubernetes Automation at a Glance`
- `How OASGen Provider and Rest Dynamic Controller turn REST APIs into managed platform resources`
- `Define the API contract`
- `Generate the Kubernetes model`
- `Operate the external resource lifecycle`
- `OpenAPI + RestDefinition`
- `OASGen Provider`
- `Generated CRD + Controller`
- `Managed external API resource`
- `Generation and deployment`
- `Runtime reconciliation`
- `Business value`
- `Watch-outs`
- `Optional plugin`
- `From API contract to automated reconciliation`

## Notes

- This is the shortest and most executive-friendly version.
- Prioritize clarity, confidence, and speed of understanding.
- The message should fit comfortably into one presentation slide.
