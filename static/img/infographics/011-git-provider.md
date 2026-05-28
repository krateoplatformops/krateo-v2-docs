
## Goal

Create a polished PNG infographic in English that explains what the Krateo `git-provider` does and how it works.

The output should be suitable for:

- internal engineering documentation
- architecture overviews
- onboarding material
- product or platform enablement slides

## Format

- Output type: PNG
- Orientation: landscape
- Aspect ratio: 16:9
- Use case: `infographic-diagram`
- Style: clean technical explainer

## Visual Direction

Use a modern DevOps / platform-engineering visual language with:

- white or very light background
- crisp vector-like shapes
- blue / teal / orange accents
- subtle shadows and layered cards
- highly legible typography
- structured spacing and alignment
- premium technical-diagram feel

Avoid:

- clutter
- screenshots
- logos
- watermarks
- code blocks
- tiny unreadable labels
- generic clip-art look

## Main Content Prompt

Create a polished PNG infographic in English that explains what the Krateo git-provider does and how it works.

Style: clean technical explainer, modern DevOps aesthetic, white or very light background, crisp vector-like shapes, blue/teal/orange accents, highly legible typography, suitable for engineering documentation or an internal architecture slide.

Aspect ratio: landscape 16:9.

Use case: infographic-diagram
Asset type: internal engineering documentation graphic
Primary request: explain the purpose and workflow of git-provider in a clear, compact visual

Content requirements:
- Big title at top: "How git-provider Works"
- Short subtitle: "Clone, transform, and publish Git content across repositories"

- Section 1: "What it does" with 3 short bullets:
  - Clones a source repository and branch
  - Optionally applies templates and ignore rules
  - Pushes the result to a destination repository and branch

- Main center flow diagram from left to right with labeled boxes and arrows:
  1. "Repo CR" with small YAML icon
  2. "Controller"
  3. "Clone fromRepo"
  4. "Load values from ConfigMap (optional)"
  5. "Copy files / apply .krateoignore / render templates"
  6. "Commit changes"
  7. "Push to toRepo"

- Show source side on the left with label "Source repo" and small notes:
  - "branch"
  - "path"
  - "krateoIgnorePath"

- Show destination side on the right with label "Target repo" and small notes:
  - "branch"
  - "path"
  - "override"
  - "cloneFromBranch"

- Add a small side panel titled "Key behaviors" with 4 short points:
  - If target branch exists, update it
  - If target branch is missing, create it
  - If cloneFromBranch is set, branch starts from that base
  - If cloneFromBranch is empty, a new orphan branch may be created

- Add another small panel titled "Common failure cases" with warning icons and these short items:
  - Missing target branch base
  - Empty or invalid cloneFromBranch
  - Nothing copied from source path
  - Commit fails because worktree is empty
  - Push/authentication errors

- Add a tiny footer strip:
  "Typical lifecycle: Observe -> Create/Update -> SyncRepos -> Commit -> Push -> Status update"

Visual direction:
- Use distinct icons for Git repos, branch, config, copy, commit, push, warning
- Use layered cards and arrows with subtle depth and soft shadows
- Make the diagram feel intentional and premium, not generic clip-art
- Keep text exact, concise, and fully readable
- No logos, no watermark, no code blocks, no screenshots


## Suggested Layout

Top band:

- large title
- concise subtitle

Left column:

- `What it does`
- short bullet summary
- source repository context

Center area:

- main workflow diagram
- left-to-right sequence with arrows
- each stage visually distinct

Right column:

- `Key behaviors`
- `Common failure cases`

Bottom strip:

- lifecycle summary line

## Exact Text Inventory

Use these strings exactly where possible:

- `How git-provider Works`
- `Clone, transform, and publish Git content across repositories`
- `What it does`
- `Repo CR`
- `Controller`
- `Clone fromRepo`
- `Load values from ConfigMap (optional)`
- `Copy files / apply .krateoignore / render templates`
- `Commit changes`
- `Push to toRepo`
- `Source repo`
- `Target repo`
- `Key behaviors`
- `Common failure cases`
- `Typical lifecycle: Observe -> Create/Update -> SyncRepos -> Commit -> Push -> Status update`

## Notes

- Prioritize readability over decoration.
- Keep the flow understandable in a single glance.
- Make sure all text remains legible when embedded in a README or slide deck.
- Preserve a balance between architecture clarity and visual polish.
