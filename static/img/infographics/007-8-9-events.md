
## Goal


Professional infographic in English, same visual tone and design language as a previous executive enterprise infographic: vertical format 1080x1600, clean modern presentation style, light background, elegant typography, teal blue, sage green, warm sand, and subtle orange accents. Highly structured, symmetrical, premium strategic-slide look with generous white space, soft shadows, rounded cards, thin flow connectors, and minimal icons. No watermark, no device mockups, no cartoon style.

Title: "Krateo Event Pipeline: Deviser, Events-Ingester, and Events-Presenter"
Subtitle: "Who stores events, who ingests them, and who delivers them to users"

Use a clear 4-section layout.

Section 1: "Roles" with three equal side-by-side cards across the width.
Card 1 title: "events-ingester" with an intake/stream icon. Short bullets:
- Captures Kubernetes events from the cluster
- Enriches and normalizes event records
- Batches writes into PostgreSQL
- Feeds the downstream event pipeline
Card 2 title: "deviser" with a database/maintenance icon. Short bullets:
- Manages PostgreSQL event partitions automatically
- Enforces retention and storage policies
- Keeps the event store performant over time
- Reduces manual database maintenance
Card 3 title: "events-presenter" with a broadcast/API icon. Short bullets:
- Listens for new events from PostgreSQL
- Streams updates to clients via SSE
- Exposes REST endpoints for event queries
- Delivers a user-facing event access layer

Section 2: "How They Work Together" as a horizontal 5-step flow with soft arrows and numbered boxes:
"1. Kubernetes emits events" -> "2. events-ingester collects and enriches them" -> "3. PostgreSQL stores the event data" -> "4. deviser maintains partitions and retention" -> "5. events-presenter exposes events to users and systems"
Under each step add micro-labels:
"signal capture", "normalization", "persistent store", "data hygiene", "delivery"

Section 3: "Value for Business and Operations" as a 2x2 grid of four compact cards:
- End-to-end event visibility
- Scalable and maintainable storage
- Faster troubleshooting and observability
- Clear separation between ingestion, storage care, and delivery
Use subtle green check icons.

Section 4: highlighted bottom panel titled "Risks If One Layer Is Missing" with a soft pale orange background and elegant warning icons. Include three mini-columns or grouped bullets:
"Without events-ingester"
- Events are not reliably captured or enriched
- Downstream visibility becomes incomplete
"Without deviser"
- Event storage grows without control
- Retention, cleanup, and DB performance degrade over time
"Without events-presenter"
- Events stay in the database but are hard to access in real time
- Consumers lose a simple streaming and query interface

Small centered footer sentence:
"In short: events-ingester captures events, deviser keeps the store healthy, and events-presenter delivers insight to consumers."

Layout instructions: main title centered at top, subtitle directly below. Section spacing regular and balanced. Roles cards equal size in one row. The flow section centered and visually prominent. The value section as a neat 2x2 grid. The risk section spans nearly full width at bottom. Strong visual hierarchy: large title, medium section headings, smaller bullet text. Keep everything presentation-ready and easy to scan for stakeholders.

## Layout Block

Use this extra block if you want stronger control over layout consistency.

Use a highly structured and symmetrical layout with an executive slide aesthetic. Vertical composition with generous margins and a clear grid system. Divide the page into 4 distinct horizontal bands with consistent spacing between sections.

Top section: three side-by-side cards of equal size and equal visual weight, with rounded corners and a soft shadow. Place a small icon in the upper-left area of each card and a clearly visible heading. Keep all bullets left-aligned with even spacing.

Second section: a horizontal 5-step flow on a single row. Each step should sit inside a small box or pill shape with a visible number. Connect the steps with soft arrows or thin curved lines. Add a small label below each step.

Third section: a 2x2 grid of four compact value cards, all equal in size, with a small icon above or beside the text. Keep the grid highly aligned and visually balanced.

Bottom section: one wide highlighted horizontal panel spanning almost the full width of the page, with a soft light orange or pale red background. Inside, place the section heading and three grouped risk areas laid out as compact columns or clearly separated blocks.

Main title centered at the top of the page, subtitle directly below it in a slightly smaller size. Small understated footer centered at the bottom.

Maintain a strong visual hierarchy:
- very prominent main title
- medium section headings
- smaller compact bullet text

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
