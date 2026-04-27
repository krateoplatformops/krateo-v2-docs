---
description: Bring Your Own PostgreSQL
sidebar_label: Bring Your Own PostgreSQL
---

# Bring Your Own PostgreSQL

If you already operate an existing PostgreSQL instance and prefer to use it instead of the default CNPG installation by Krateo, you can easily skip the CNPG installation and connect the services to your database instead.

## Setup Instructions

To use your own PostgreSQL instance, you need to:
1. Create a database and user for Krateo in your existing PostgreSQL instance.
2. Create a Kubernetes Secret with the connection details for your existing database.
3. Create a custom config file for `krateoctl` to point to your existing PostgreSQL instance.
4. Install Krateo without the default CNPG component and pointing to your existing PostgreSQL instance.

### 1. Create a database and user for Krateo in your existing PostgreSQL instance

You need to create a **database** and a **user** for Krateo in your existing PostgreSQL instance. 
This can be done using the following SQL commands:

```sql
CREATE DATABASE krateo-db;
CREATE USER krateo-db-user WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE krateo-db TO krateo-db-user;
```

The database will be used by Krateo to store Krateo resources and Kubernetes events, and the user will be used by the Krateo components to connect to the database.

### 2. Create a Kubernetes Secret with the connection details for your existing database

You need to create a Kubernetes Secret with the connection details for your existing database as described at: [Secrets Spec](../../key-concepts/krateoctl/secrets).
This secret is used by the Krateo components that need database access: `deviser`, `resources-ingester`, `resources-presenter`, `events-ingester` and `events-presenter`.

### 3. Create a custom config file for `krateoctl` to point to your existing PostgreSQL instance

You need to create a custom config file for `krateoctl` to point to your existing PostgreSQL instance. 
This yaml file should contain the connection details for your database, such as the host, port, database name. 
Additionally it should reference, for each component, the Kubernetes Secret created in step 2 that contains the database credentials.

An example config file might look like this:

```yaml
components:
  db-maintenance:
    stepConfig:
      install-deviser:
        with:
          values:
            config:
              DB_HOST: <your-db-host> 
              DB_PORT: <your-db-port>
              DB_NAME: krateo-db # Change if you used a different database name
        secret:
          name: krateo-db # Change if you used a different secret name
  
  resources-stack:
    stepConfig:
      install-resources-ingester:
        with:
          values:
            config:
              DB_HOST: <your-db-host> 
              DB_PORT: <your-db-port>
              DB_NAME: krateo-db # Change if you used a different database name
            secret:
              name: krateo-db # Change if you used a different secret name
      install-resources-presenter:
        with:
          values:
            config:
              DB_HOST: <your-db-host>  # This is the only place where you can also specify the read-only connection string if your database has different endpoints for read-write and read-only connections.
              DB_PORT: <your-db-port> # This is the only place where you can also specify the read-only connection string if your database has different endpoints for read-write and read-only connections.
              DB_NAME: krateo-db # Change if you used a different database name
            dbSecret:
              name: krateo-db # Change if you used a different secret name
  
  events-stack:
    stepConfig:
      install-events-ingester:
        with:
          values:
            config:
              DB_HOST: <your-db-host> 
              DB_PORT: <your-db-port>
              DB_NAME: krateo-db # Change if you used a different database name
            secret:
              name: krateo-db # Change if you used a different secret name
      install-events-presenter:
        with:
          values:
            config:
              DB_HOST: <your-db-host> 
              DB_PORT: <your-db-port>
              DB_NAME: krateo-db # Change if you used a different database name
            dbSecret:
              name: krateo-db # Change if you used a different secret name
```

:::note
The connection string is formed by the `DB_HOST`, `DB_PORT`, `DB_NAME` and `DB_PARAMS` fields. The `DB_PARAMS` field is optional and can be used to specify **additional parameters** for the connection string, such as SSL settings or connection timeouts. Therefore, if your database requires specific parameters for the connection, you can add them in the `DB_PARAMS` field in the format of a query string, for example: `sslmode=require&connect_timeout=10`.
:::

:::note
The `resources-presenter` component is the only one that can be configured with a connection string for **read-only connections**, if your database provides different endpoints for read-write and read-only connections. In that case, you can specify the read-only connection details in the `DB_HOST` and `DB_PORT` fields under `install-resources-presenter`. All the other components need to use a read-write connection string of your database.
:::

### 4. Install Krateo without the default CNPG component and pointing to your existing PostgreSQL instance

You can finally install Krateo without the default CNPG component and pointing to your existing PostgreSQL instance by running the following command:

```sh
krateoctl install apply --profile no-cnpg --config <path-to-your-config-file>
```

## What happens to your own PostgreSQL instance?

When you choose to bring your own PostgreSQL instance, a Krateo component called `deviser` will connect to your database and create the necessary tables and partitions for Krateo to operate.
You can find more details about `deviser` operations in the [related section of the documentation](./deviser).
