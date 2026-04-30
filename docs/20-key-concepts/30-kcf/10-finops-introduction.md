# Krateo Composable FinOps

Krateo Composable FinOps is a tool to collect costs and metrics from service providers and on-premises systems, to allow for the showback and optimization of resource utilization. The metrics collected include costs and resource utilization such as CPU and memory, but the list can include any type of metric exposed through an API, including carbon intensity for GreenOps.

## Complete Architecture

The architecture relies on the concept of exporters and scrapers, a duo of applications tasked with collecting information from an API source, exporting it, and then scraping it for storage and later use. The exporter is a webservice that exposes an endpoint where data can be read in Prometheus format. The scraper connects to the exporter, collects all the data, and uploads it to the database.

Cost data is stored according to the FinOps Cost and Usage Specification, FOCUS. It is a data representation that can show in a single view costs, discounts, commitments, and usage, significantly reducing the overhead of data storage and analysis compared to traditional methods. It is also widely adopted and available in all major cloud service providers such as Azure, GCP, AWS, and Tencent Cloud.

Usage data is also stored in the database as timeseries, which allows analysis, pattern recognition, and forecasting to be performed on it to gain useful insights.

### Data Collection

The first part of the module is responsible for data collection, composed by the following units:

- [finops-data-types](https://github.com/krateoplatformops/finops-data-types)
- [finops-operator-exporter](https://github.com/krateoplatformops/finops-operator-exporter)
- [finops-operator-scraper](https://github.com/krateoplatformops/finops-operator-scraper)
- [finops-operator-focus](https://github.com/krateoplatformops/finops-operator-focus)
- [finops-database-handler](https://github.com/krateoplatformops/finops-database-handler)
- [finops-database-handler-uploader](https://github.com/krateoplatformops/finops-database-handler-uploader)
- [finops-prometheus-exporter](https://github.com/krateoplatformops/finops-prometheus-exporter)
- [finops-prometheus-scraper](https://github.com/krateoplatformops/finops-prometheus-scraper)

### Data Presentation

The second module is responsible for the showback of data inside Krateo's frontend. Cost and usage information collected by the pipeline is made available through the Krateo Composable Portal via the [finops-dashboard](https://github.com/krateoplatformops/finops-dashboard).

### Optimization

The third module is responsible for optimizations. The optimizations rely on Open Policy Agent (OPA), installed automatically through the [finops-webhook-template-chart](https://github.com/krateoplatformops/finops-webhook-template-chart). Policies mutate compositions through the [finops-webhook-template](https://github.com/krateoplatformops/finops-webhook-template), adding optimization results to the field `spec.optimization`, which is then displayed in the frontend.

The modules involved are:

- [opa](https://github.com/krateoplatformops/opa-chart)
- [policies](https://github.com/krateoplatformops/finops-moving-window-policy-chart)
- [finops-moving-window-microservice](https://github.com/krateoplatformops/finops-moving-window-microservice)
- [finops-moving-window-microservice-chart](https://github.com/krateoplatformops/finops-moving-window-microservice-chart)
- [finops-webhook-template-chart](https://github.com/krateoplatformops/finops-webhook-template-chart)
- [kserve-controller](https://github.com/krateoplatformops/kserve-controller)

## Summary of Functionality

The complete flow of the architecture starts with the creation of a generic composition definition that includes FinOps tags and custom resources. When a composition is created, a mutating webhook is called to apply a set of OPA policies which perform evaluations to decide how to best deploy the requested resources. These policies are split between "day 1" and "day 2". Day 1 policies are applied on a _CREATE_ event. Day 2 policies are applied on an _UPDATE_ event, triggered either by actual resource updates or through a periodic CronJob embedded in the composition definition.

An example day-1 policy is the selection of the best time and location to minimize carbon intensity for a Virtual Machine. This algorithm relies on a scheduler and a forecaster. The forecaster runs periodically and predicts a window of data for each region of interest using TTMs, a highly efficient model capable of running hundreds of inferences per second on a single GPU. The forecasted data is stored in the database. The scheduler reads it and decides when and where to deploy the VM to minimize carbon intensity. The resource is then created at the right time in the selected region by a dedicated service provider operator.

An example day-2 policy is the moving window algorithm, implemented in [finops-moving-window-policy](https://github.com/krateoplatformops/finops-moving-window-policy), which searches usage patterns of deployed virtual machines to identify wasted resources.

Forecasting models are integrated into compositions through the `kserve-controller`. It manages `InferenceConfig` and `InferenceRun` custom resources, spawning Kubernetes Jobs (or CronJobs for scheduled runs) that fetch input data from the database via the `finops-database-handler`, call a KServe model endpoint, and write the results back for consumption by OPA policies. Data transformations between storage and inference are handled by Python notebooks registered in the `finops-database-handler` through the `finops-database-handler-uploader`.

The creation of a composition also provisions the resources for the `finops-operator-exporter`, enabling the collection of metrics for the resources created. This feeds actual usage data back into the forecaster, creating a closed feedback loop that should ideally converge toward the optimal resource allocation for the target objective.