## Goal

Professional infographic in English, same visual tone and design language as the previous executive enterprise infographics: vertical format 1080x1600, clean modern presentation style, light background, elegant typography, teal blue, sage green, warm sand, and subtle orange accents. Highly structured, symmetrical, premium strategic-slide look with generous white space, soft shadows, rounded cards, thin flow connectors, and minimal icons. No watermark, no device mockups, no cartoon style.

Title: "Krateo Resource Pipeline"
Subtitle: "How resources-ingester, deviser, and resources-presenter turn Kubernetes state into searchable platform data"

Use a clear 4-section layout.

Section 1: "Roles" with three equal side-by-side cards across the width.
Card 1 title: "resources-ingester" with a Kubernetes intake icon. Short bullets:
- Watches Kubernetes resources at scale
- Supports static and dynamic CRD-driven discovery
- Enriches and normalizes resource records
- Stores current state into PostgreSQL
Card 2 title: "deviser" with a database/schema icon. Short bullets:
- Creates and maintains the resource database schema
- Keeps storage structures consistent over time
- Supports operational health of the persistence layer
- Reduces manual database maintenance effort
Card 3 title: "resources-presenter" with a search/API icon. Short bullets:
- Exposes read-only resource query APIs
- Supports filters, sorting, and keyset pagination
- Enforces RBAC-aware resource access
- Returns current resource state to consumers

Section 2: "How They Work Together" as a horizontal 5-step flow with soft arrows and numbered boxes:
"1. Kubernetes resources change" -> "2. resources-ingester captures and enriches them" -> "3. PostgreSQL stores current resource state" -> "4. deviser maintains schema and storage structure" -> "5. resources-presenter exposes searchable resource views"
Under each step add micro-labels:
"change", "ingestion", "persistence", "schema care", "access"

Section 3: "Value for Business and Operations" as a 2x2 grid of four compact cards:
- Centralized visibility into platform resources
- Scalable storage for current-state resource data
- Faster search, troubleshooting, and automation
- Clear separation between ingestion, schema care, and presentation
Use subtle green check icons.

Section 4: highlighted bottom panel titled "Risks If One Layer Is Missing" with a soft pale orange background and elegant warning icons. Include three grouped risk areas:
"Without resources-ingester"
- Resource state is not captured reliably
- Search and visibility become incomplete
"Without deviser"
- Schema creation and storage consistency become manual
- Database structure becomes harder to govern over time
"Without resources-presenter"
- Stored resource data becomes harder to access and reuse
- Consumers lose a simple RBAC-aware query interface

Small centered footer sentence:
"In short: resources-ingester captures resource state, deviser keeps the storage foundation healthy, and resources-presenter turns it into consumable platform data."

Layout instructions: main title centered at top, subtitle directly below. Section spacing regular and balanced. The top section uses three equal cards in one row. The middle flow section is centered and visually prominent. The value section is a neat 2x2 grid. The risk section spans nearly full width at bottom. Strong visual hierarchy: large title, medium section headings, smaller bullet text. Keep everything presentation-ready and easy to scan for stakeholders.

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
