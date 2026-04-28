# Deviser Overview

**Deviser** is a specialized maintenance service within the Krateo Composable Portal (KCP) backend. Its primary responsibility is to manage the lifecycle, partitions, and data retention of the PostgreSQL databases used by Krateo.

## Key Responsibilities

- **PostgreSQL Partition Management**: Automatically creates and maintains daily partitions for time-series data (e.g., resources and events), ensuring optimal query performance.
- **Data Retention & Quotas**: Enforces retention policies by dropping expired partitions and managing storage quotas.
- **Soft-Delete Purge**: Periodically performs hard-deletes of resources marked as soft-deleted in the `krateo_resources` table.
- **Database Readiness**: Ensures the database schema is correctly applied and ready for use by other KCP components at startup.

## How it works

![Deviser Flow](/img/diagrams/deviser-flow.png)

Deviser runs a scheduled main loop that performs the following routine:
1.  **DB Connect**: Checks connectivity to the PostgreSQL instance.
2.  **Schema Check**: Validates and applies required SQL schemas.
3.  **Partition Ensure**: Creates partitions for a configured number of days ahead.
4.  **Partition Maintenance**: Drops old partitions based on expiration or storage quotas.
5.  **Soft-Delete Purge**: Cleans up resources that have been marked for deletion.

## Technical Reference

### Environment Variables

| Name | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Service port for health probes (`/livez`, `/readyz`) | `8081` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database username | - |
| `DB_PASS` | Database password | - |
| `DB_PARTITIONS_DAYS` | Number of days ahead to create partitions | `7` |
| `PM_MAX_PARTITIONS_SIZE`| Maximum allowed total size of all partitions | `10GB` |
| `PM_RETENTION_DAYS` | Number of days to retain partitions | `2` |
| `PM_TRIGGER_RATIO` | Fraction of max size to trigger cleanup | `0.75` |
| `PM_DRY_RUN` | If true, cleanup actions are logged but not executed | `false` |
| `OTEL_ENABLED` | Enable OpenTelemetry metrics exporter | `true` |

---

## Documentation
