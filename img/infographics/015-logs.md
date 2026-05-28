Use case: infographic-diagram
Primary request: create a polished infographic in the same visual style, layout language, and overall theme as the provided Krateo reference infographic, but about the Logs Ingester and Logs Presenter services.
Input images: Image 1: reference image for style, composition, typography, spacing, icon treatment, and color atmosphere.
Scene/backdrop: bright editorial infographic on a warm white background with subtle paper texture, generous whitespace, thin teal divider lines, soft rounded cards with very light shadows, elegant section numbering, and restrained accent colors.
Subject: Krateo logs data pipeline from Kubernetes pod logs to PostgreSQL and query APIs.
Composition: portrait infographic, approximately 1024x1536, with four major sections mirroring the reference structure.
Style reference: same premium enterprise infographic feel as the reference; deep teal headings, dark slate body text, desaturated green and amber accents, rounded icon badges, clean modern icons, consistent spacing, and subtle gradients.
Text rendering: crisp, legible, and accurate English text only.
Avoid: clutter, dark background, cartoon style, purple palette, low contrast text, distorted icons, gibberish, tiny unreadable labels.

Exact infographic text and structure:

Top title:
Krateo Logs Pipeline

Subtitle:
How logs-ingester and logs-presenter turn Kubernetes pod logs into searchable platform data

Section 1 title:
1. ROLES

Three role cards across the page:

Card 1 heading:
logs-ingester
Bullets:
• Watches Kubernetes pods and container logs
• Accepts structured JSON log lines only
• Enriches records with pod, node, and workload metadata
• Stores partitioned log data into PostgreSQL
Icon idea: Kubernetes badge plus ingestion/funnel cue in teal

Card 2 heading:
PostgreSQL
Bullets:
• Stores logs in the pod_logs table
• Partitions data by created_at for retention and scale
• Preserves raw payload, trace data, and deduplication keys
• Supports indexed lookup for operations and troubleshooting
Icon idea: database cylinder in green

Card 3 heading:
logs-presenter
Bullets:
• Exposes read-only /logs query APIs
• Supports filters across log metadata and raw payload
• Uses stable keyset pagination with cursor-based navigation
• Returns consumable log views for users and tools
Icon idea: search/magnifier in teal

Section 2 title:
2. HOW THEY WORK TOGETHER

Five connected steps in one horizontal flow with arrows, matching the reference style:

Step 1 label inside card:
Kubernetes pods emit structured logs
Caption below:
source
Icon: Kubernetes / pod logs

Step 2 label inside card:
logs-ingester captures and normalizes them
Caption below:
ingestion
Icon: funnel / stream / processing

Step 3 label inside card:
PostgreSQL stores partitioned log records
Caption below:
persistence
Icon: database

Step 4 label inside card:
Indexes and metadata make queries efficient
Caption below:
query ready
Icon: gear / tuning / schema

Step 5 label inside card:
logs-presenter exposes searchable log APIs
Caption below:
access
Icon: magnifier / API

Section 3 title:
3. VALUE FOR BUSINESS AND OPERATIONS

Four value cards across the page:

Card A text:
Centralized visibility into application and platform logs
Icon: eye or observability symbol

Card B text:
Scalable time-based storage with retention-friendly partitions
Icon: database stack

Card C text:
Faster troubleshooting through trace, service, workload, and raw-payload search
Icon: speedometer or search analytics

Card D text:
Clear separation between ingestion, storage, and presentation concerns
Icon: gears / modular blocks

Section 4 title:
4. RISKS IF ONE LAYER IS MISSING

Three warning cards in a single row:

Card 1 heading:
Without logs-ingester
Bullets:
• Log data is not collected consistently
• Metadata enrichment and normalization are lost

Card 2 heading:
Without PostgreSQL storage discipline
Bullets:
• Retention and partition lifecycle become harder to control
• Search performance and data consistency degrade over time

Card 3 heading:
Without logs-presenter
Bullets:
• Stored logs are harder to access and reuse
• Consumers lose a simple query interface for operations

Bottom summary line with target icon:
In short: logs-ingester captures and enriches logs, PostgreSQL keeps them queryable and durable, and logs-presenter turns them into consumable operational data.

Make the output feel like a sibling of the reference infographic, not a different design system.
