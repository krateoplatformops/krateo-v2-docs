
## Goal

Professional infographic in English, same visual tone and design language as the previous executive enterprise infographics: vertical format 1080x1600, clean modern presentation style, light background, elegant typography, teal blue, sage green, warm sand, and subtle orange accents. Highly structured, symmetrical, premium strategic-slide look with generous white space, soft shadows, rounded cards, thin flow connectors, and minimal icons. No watermark, no device mockups, no cartoon style.

Title: "Krateo AuthN"
Subtitle: "The identity layer that authenticates users and generates platform access"

Use a clear 4-section layout.

Section 1: "What It Does" with three equal side-by-side cards across the width.
Card 1 title: "Authentication" with a shield/key icon. Short bullets:
- Supports multiple login strategies
- Handles basic, LDAP, OAuth, and OIDC flows
- Returns a unified user identity response
- Standardizes authentication across the platform
Card 2 title: "Access Generation" with a certificate/kubeconfig icon. Short bullets:
- Generates user-specific Kubernetes access
- Builds kubeconfig data for authenticated users
- Produces certificates and access context
- Maps identity to platform permissions
Card 3 title: "Platform Integration" with a connection/workflow icon. Short bullets:
- Supports downstream platform services
- Enables secure user-aware API interactions
- Can enrich identity through RESTAction-based lookups
- Bridges login flows and runtime platform access

Section 2: "How It Works" as a horizontal 5-step flow with soft arrows and numbered boxes:
"1. User chooses a login strategy" -> "2. AuthN validates credentials or auth code" -> "3. User profile and groups are resolved" -> "4. AuthN generates kubeconfig and access material" -> "5. Platform services use that context for authorized actions"
Under each step add micro-labels:
"entry", "verification", "identity", "access", "usage"

Section 3: "Value for Business and Operations" as a 2x2 grid of four compact cards:
- Consistent login experience across environments
- Secure platform access tied to user identity
- Lower friction for integrating enterprise identity providers
- Stronger foundation for role-aware platform operations
Use subtle green check icons.

Section 4: highlighted bottom panel titled "Risks Without AuthN" with a soft pale orange background and elegant warning icons. Include 5 clear bullets:
- User access would be harder to standardize and govern
- Platform services would need custom authentication logic
- Secure generation of user-specific kubeconfig would be fragmented
- Integration with enterprise identity providers would be slower
- Authorization flows across the platform would be less consistent

Small centered footer sentence:
"In short: AuthN turns user identity into trusted platform access that other services can safely use."

Layout instructions: main title centered at top, subtitle directly below. Section spacing regular and balanced. The top section uses three equal cards in one row. The middle flow section is centered and visually prominent. The value section is a neat 2x2 grid. The risk section spans nearly full width at bottom. Strong visual hierarchy: large title, medium section headings, smaller bullet text. Keep everything presentation-ready and easy to scan for stakeholders.

## Layout Block

Use this extra block if you want stronger control over layout consistency.

Use a highly structured and symmetrical layout with an executive slide aesthetic. Vertical composition with generous margins and a clear grid system. Divide the page into 4 distinct horizontal bands with consistent spacing between sections.

Top section: three side-by-side cards of equal size and equal visual weight, with rounded corners and a soft shadow. Place a small icon in the upper-left area of each card and a clearly visible heading. Keep all bullets left-aligned with even spacing.

Second section: a horizontal 5-step flow on a single row. Each step should sit inside a small box or pill shape with a visible number. Connect the steps with soft arrows or thin curved lines. Add a small label below each step.

Third section: a 2x2 grid of four compact value cards, all equal in size, with a small icon above or beside the text. Keep the grid highly aligned and visually balanced.

Bottom section: one wide highlighted horizontal panel spanning almost the full width of the page, with a soft light orange or pale red background. Inside, place the section heading and 5 readable bullets in a single clean column.

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
