# Krateo 2.6.0 – Expanding the Marketplace, Enhancing Performance

Krateo 2.6.0 builds on the foundation set in 2.5.1, delivering better scalability in the frontend, expanding the Blueprint Marketplace, and improving FinOps capabilities.

## 🚀 What’s New

**DataGrid Pagination**
	•	Snowplow and the frontend now support pagination in DataGrid, making it possible to handle thousands of items with smooth, progressive loading.

**Admin Page Improvements**
	•	UI fixes and refinements to improve readability and usability.

**FinOps Blueprints in the Marketplace**
The following FinOps-related blueprints are now available directly in the Marketplace:
	•	FinOps Dashboard
	•	Generic Composition Page
	•	Azure Configuration
	•	Azure Pricing

**KOG Providers in the Marketplace**
We’ve moved key providers into the Marketplace repository for easier discovery and adoption:
	•	GitHub Provider
	•	GitLab Provider
	•	Azure DevOps Provider KOG

⸻

## ⚠️ Breaking Changes (from 2.5.1)

**Frontend**
Some widgets now require new properties to ensure consistency and error-free behavior:
	•	A new property headers is required in widgets that use actions of type rest.
	•	Example: [portal-blueprint-page](https://github.com/krateoplatformops-blueprints/portal-blueprint-page/blob/main/blueprint/templates/button.panel-button-cleanup.yaml#L19)
	•	A new property allowedResources is required to explicitly define supported child resources. This applies to the following widgets:
	•	Column
	•	DataGrid
	•	NavMenu
	•	NavMenuItem
	•	Page
	•	RoutesLoader
	•	Row
	•	TabList
	•	Table

⸻

## ⏳ Not in 2.6.0 (but coming soon)

CDC Performance
	•	Significant work has been done to reduce memory footprint for handling thousands of concurrent composition creations.
	•	This feature is not yet included in 2.6.0 but will arrive in an upcoming release.

⸻

👉 With this release, Krateo continues to evolve towards a scalable, composable, and marketplace-driven platform that empowers teams to move faster while keeping governance in place.