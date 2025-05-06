# Krateo Composable FinOps
The Krateo Composable FinOps module is a tool to collect costs and metrics from service providers and on-premises systems, to allow for the showback and optimization of resource utilization. The metrics collected include the costs, but also utilization of resources such as CPU, memory, and also carbon intensity, but this list could include any type of metric that we want to optimize for that is exposed through an API.

## Complete Architecture
The complete architecture is summarized by the following graph:
<p align="center">
<img src="https://github.com/user-attachments/assets/8e6eeb71-2170-421e-9ea6-e6b9d55611b7" width="800">
</p>

The architecture relies on the concept of exporters and scrapers, a duo of applications that is tasked with collecting information from an API source, exporting it, and then scraping it for storage and later utilization. The exporter is basically a webservice that exposes an endpoint where data can be read from in a certain format, in this case, Prometheus'. The scraper, instead, is a service that connects to the exporter and collects all the data (i.e., by scraping it) and then querying the database to store it.

The cost data is stored in the FinOps Cost and Usage Specification, FOCUS. It is a data representation that can show in a single view costs, discounts, commitments and usage, allowing to reduce significantly the overhead of data storage and analysis compared to traditional methods. It is also widely adopted and available in all major cloud service providers (e.g., Azure, GCP, AWS and Tencent cloud).

The usage data is also stored in the database, however, usages are usually timeseries data, which allow analysis, pattern recognition and forecasting to be done on it to gain useful insights.

### Data Collection
The first part of the module is responsible for data collection. This module is composed by the following units:
- [finops-data-types](https://github.com/krateoplatformops/finops-data-types)
- [finops-operator-exporter](https://github.com/krateoplatformops/finops-operator-exporter)
- [finops-operator-exporter-chart](https://github.com/krateoplatformops/finops-operator-exporter-chart)
- [finops-operator-scraper](https://github.com/krateoplatformops/finops-operator-scraper)
- [finops-operator-scraper-chart](https://github.com/krateoplatformops/finops-operator-scraper-chart)
- [finops-operator-focus](https://github.com/krateoplatformops/finops-operator-focus)
- [finops-operator-focus-chart](https://github.com/krateoplatformops/finops-operator-focus-chart)
- [finops-database-handler](https://github.com/krateoplatformops/finops-database-handler)
- [finops-database-handler-chart](https://github.com/krateoplatformops/finops-database-handler-chart)
- [finops-prometheus-exporter-generic](https://github.com/krateoplatformops/finops-prometheus-exporter-generic)
- [finops-prometheus-resource-exporter-azure](https://github.com/krateoplatformops/finops-prometheus-resource-exporter-azure)
- [finops-prometheus-scraper-generic](https://github.com/krateoplatformops/finops-prometheus-scraper-generic)

### Data Presentation
The second module is responsible for the showback of data inside Krateo's frontend. It includes one main module:
- [finops-composition-definition-parser](https://github.com/krateoplatformops/finops-composition-definition-parser)
- [finops-composition-definition-parser-chart](https://github.com/krateoplatformops/finops-composition-definition-parser-chart)

Additionally, as an example application or use case, there is the Azure pricing API plugin for KOG/RDC and its composition for automatic pricing upload:
- [azure-pricing-rest-dynamic-controller-plugin](https://github.com/krateoplatformops/azure-pricing-rest-dynamic-controller-plugin)
- [azure-pricing-rest-dynamic-controller-plugin-chart](https://github.com/krateoplatformops/azure-pricing-rest-dynamic-controller-plugin-chart)
- [focus-data-presentation-azure](https://github.com/krateoplatformops/focus-data-presentation-azure)

This component allows to show pricing information on the frontend cards through API calls to the [finops-database-handler](https://github.com/krateoplatformops/finops-database-handler) notebooks.
The full example can be found here: [Krateo FinOps Module Pricing Example](https://github.com/krateoplatformops/krateo-v2-template-finops-example-pricing-vm-azure)

### Optimization
The third module is responsible for optimizations, and is currently under development in collaboration with the University of Trento. It includes:
 - The main service providers operators (i.e., Azure, AWS and GCP)
 - A composition with a conditional creation policy that selects the best location and time for the scheduling of a resource
 - A webhook and a set of Open Policy Agent (OPA) policies that call upon a scheduler 
 - A scheduler that performs the scheduling of resources on the cloud based on the data coming from an ML-based forecaster (Tiny Time Mixers, TTMs)
 - MLFlow as the framework for orchestrating the model's training and inference

## Summary of Functionality
The complete flow of the architecture starts with the creation of a generic composition definition that includes FinOps tags and custom resources. When a new composition definition is created, it is immediately parsed by the [finops-composition-definition-parser](https://github.com/krateoplatformops/finops-composition-definition-parser) looking for resource annotations that will be used to connect the custom resources created with pricing information stored in the database. If pricing information is available, then it is displayed inside the frontend.

Then, when actually creating a composition, a mutating webhook gets called to apply a set of OPA policies which will perform several evaluations to decide how to best deploy the requested resources. These policies are split between "day 1" and "day 2". Day 1 policies are applied when the mutating webhook is called for a _CREATE_. Day 2 policies are applied when the mutating webhook is called for an _UPDATE_. These types of policies represent any kind of optimization or algorithm that needs to be applied to the resources. The _UPDATE_ events are triggered by actual resources updates or through a periodic cronjob, part of the composition definition. The policies can include any type of call or data, including custom performance targets or particular optimization objectives/functions.

An example "day 1" policy is the selection of the best time and location to minimize carbon intensity for a Virtual Machine (VM). This algorithm relies on a scheduler and forecaster. The forecaster runs periodically (triggered by the scheduler or through a periodic job) and predicts a window of data for each region of interest. The chosen model, TTMs, is extremely efficient and its inference can be executed hundreds of times per second on a single GPU. The forecasted data is then stored in the database (i.e., CrateDB in Krateo). The scheduler reads the data and, based on the forecasting, decides when and where to deploy the VM to minimize carbon intensity. Once decided, the mutating webhook finishes and the resource is mutated with the time and region. Then, the composition dynamic controller will create the resource at the right time in the selected region. The resource will be actually created by a dedicated service provider operator (e.g., Azure, AWS or GCP).

The creation of the composition will also include the resources for the [finops-operator-exporter](https://github.com/krateoplatformops/finops-operator-exporter), which will allow the collection of metrics for the resources created. This will allow the forecaster to work on the actual data to create more "ad-hoc" predictions for each resource. Also, this creates a feedback optimization system, that should ideally stabilize on the ideal amount of resources to reach the target objective.