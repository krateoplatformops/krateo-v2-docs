# Version Management Model

Krateo Core Provider supports sophisticated versioning patterns, allowing platform engineers to manage Helm chart upgrades with precision and zero downtime.

## The Model

In Krateo, a `CompositionDefinition` represents a managed API. When you want to upgrade the underlying Helm chart, you can choose from three distinct patterns based on your risk tolerance and requirements.

### Pattern 1: Full Migration
Upgrade all existing `Composition` instances to the new chart version simultaneously.
- **How**: Update the `version` field in the `CompositionDefinition`.
- **Effect**: All CDCs will detect the change and perform a `helm upgrade` on all managed releases.
- **Best for**: Routine patches and non-breaking updates.
- **Guide**: [How to perform a Full Migration](../../../30-how-to-guides/30-kco-operations/50-full-migration.md)

### Pattern 2: Parallel Versioning
Run two versions of the same service side-by-side without affecting existing instances.
- **How**: Create a *new* `CompositionDefinition` with a different name (e.g., `app-v2`).
- **Effect**: A new API and a new CDC are created. Old instances remain on `app-v1`.
- **Best for**: Major version upgrades with breaking changes.
- **Guide**: [How to setup Parallel Versioning](../../../30-how-to-guides/30-kco-operations/60-parallel-versioning.md)

### Pattern 3: Selective Migration
Migrate individual `Composition` instances to a new version on your own schedule.
- **How**: Use the `krateo.io/desired-version` annotation on a specific `Composition`.
- **Effect**: The CDC will prioritize the version requested in the annotation over the one defined in the `CompositionDefinition`.
- **Best for**: Critical production services that require manual validation during upgrade.
- **Guide**: [How to perform a Selective Migration](../../../30-how-to-guides/30-kco-operations/70-selective-migration.md)

---

## Multi-Version Constraints

- **CRD Evolution**: Krateo manages the lifecycle of the generated CRD. If a new chart version introduces schema changes, Krateo handles the CRD update.
- **Controller Isolation**: Each `CompositionDefinition` gets its own CDC instance, ensuring that an upgrade process for one API does not impact others.
