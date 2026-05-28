
## Goal

Professional infographic in English, executive enterprise style, vertical format 1080x1600, clean modern presentation design, light background, elegant typography, teal blue, sage green, warm sand, and subtle orange accents. Highly structured, symmetrical, premium strategic-slide look with generous white space, soft shadows, rounded cards, thin flow connectors, and minimal icons. No watermark, no device mockups, no cartoon style.

Title: "Krateo PlatformOps Core Overview"
Subtitle: "How the core platform components work together across access, orchestration, runtime, experience, data, and operator tooling"

Create a polished 4-section executive infographic that summarizes the full platform landscape, now explicitly including KrateoCTL and Frontend.

Section 1: "Platform Layers" with six horizontal stacked bands or six wide cards from top to bottom.
Band 1 title: "Operator Tooling" with terminal/cli icon.
Short text: "KrateoCTL gives operators a version-aware CLI for installation, upgrade, migration, and platform utility workflows."
Band 2 title: "Identity & Access" with shield/key icon.
Short text: "AuthN authenticates users and generates trusted platform access, including user-specific kubeconfig and identity context."
Band 3 title: "Platform Orchestration" with gears/platform icon.
Short text: "Core Provider publishes new platform service types, generates CRDs and governance, and activates dedicated dynamic controllers."
Band 4 title: "Runtime & Integration" with workflow/API icon.
Short text: "Snowplow bridges platform resources, RESTAction workflows, and backend-driven interactions using user-aware execution context."
Band 5 title: "Experience Layer" with UI/browser icon.
Short text: "Frontend turns platform definitions into dynamic user journeys with navigation, widgets, actions, and live feedback."
Band 6 title: "Observability & Data Services" with database/stream/search icon.
Short text: "Ingestion, storage maintenance, presenter services, and event streaming turn platform activity into searchable, operational data."

Section 2: "Key Components" as a balanced grid of 10 compact cards, readable and aligned, each with a small icon and one-line role summary.
Card 1: "KrateoCTL" — "CLI for install, upgrade, migration, and operational utilities"
Card 2: "AuthN" — "Authenticates users and generates platform access context"
Card 3: "Core Provider" — "Publishes and governs new platform capabilities"
Card 4: "CDC" — "Runs individual service instances operationally"
Card 5: "Snowplow" — "Executes RESTAction logic and powers dynamic runtime behavior"
Card 6: "Frontend" — "Delivers the user-facing platform experience layer"
Card 7: "Events Ingester" — "Captures and enriches Kubernetes events"
Card 8: "Deviser" — "Maintains event/resource schema, partitions, and storage health"
Card 9: "Events Presenter" — "Streams and serves event data to consumers"
Card 10: "Resources Ingester / Resources Presenter" — "Capture and expose current Kubernetes resource state"

Section 3: "How the Platform Flows" as a central multi-step flow diagram with soft arrows, simplified for stakeholders:
"Operators manage lifecycle with KrateoCTL" -> "Users authenticate" -> "Platform services receive trusted context" -> "Core Provider enables new service types" -> "CDC runs service instances" -> "Snowplow powers resource-aware interactions" -> "Frontend renders dynamic user journeys" -> "Ingesters capture events and resources" -> "Deviser maintains storage foundations" -> "Presenters expose searchable and streaming data"
Use small labels beneath the steps:
"tooling", "identity", "access", "enablement", "operations", "interaction", "experience", "capture", "storage", "delivery"

Section 4: "Business Value" as a 2x3 grid of six compact cards with green check icons:
- Faster onboarding of platform services
- Consistent governance and access control
- Scalable runtime operations
- Dynamic UI and API integration
- Better observability and troubleshooting
- Repeatable operator workflows across environments

Add a small highlighted footer bar titled "Why This Matters" with a soft pale orange accent and a short message:
"Together, these components turn Kubernetes into a governed, composable, operator-friendly, and user-facing platform rather than just an infrastructure layer."

Layout instructions: main title centered at top, subtitle directly below. Strong visual hierarchy, regular section spacing, premium slide aesthetic, all cards aligned and symmetrical. Keep the infographic easy to scan for stakeholders, emphasizing platform roles and relationships rather than low-level technical detail.

## Layout Block

Use this extra block if you want stronger control over layout consistency.

Use a highly structured and symmetrical layout with an executive slide aesthetic. Vertical composition with generous margins and a clear grid system. Divide the page into 4 distinct horizontal bands with consistent spacing between sections.

Top section: six stacked wide horizontal bands or cards with equal visual rhythm and clear separation. Each band should have a small icon, a strong heading, and one short descriptive sentence.

Second section: a balanced grid of 10 compact cards, aligned precisely and evenly spaced. Keep all cards visually consistent, with small icons and concise one-line descriptions.

Third section: a horizontal multi-step flow placed centrally and made visually prominent. Each step should sit inside a small box or pill shape with a visible label. Connect the steps with soft arrows or thin curved lines. Add a small label below each step.

Fourth section: a 2x3 grid of compact value cards, aligned and symmetrical, followed by a small highlighted footer bar for the final strategic message.

Main title centered at the top of the page, subtitle directly below it in a slightly smaller size.

Maintain a strong visual hierarchy:
- very prominent main title
- medium section headings
- smaller compact card text

Use a premium strategic-presentation look:
- lots of white space
- precise alignment
- consistent minimal icons
- no intrusive decorative elements
- no advertising-poster style
- no comic style

## Suggested Usage

To maximize similarity:

- keep the vertical format at `1080x1600`
- keep all 4 sections
- keep the palette unchanged
- use the full prompt without shortening it
- include the `Layout Block` when possible
- if the tool supports it, add a note like: `keep layout structured and presentation-ready`
