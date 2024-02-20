---
sidebar_label: Krateo Composable FinOps
description: Find out more about Krateo Composable FinOps (KCF) concepts
---
# What is Krateo Composable FinOps (KCF)?

The FinOps module aims to help manage costs and optimize performance in cloud-based services and applications. The need for such a platform arises due to the increasing complexity of modern cloud systems, especially in multi-cloud applications.

However, there are several complex challenges in the cost-collection process. One challenge is the collection problem since it takes time and effort to gather the required data from multiple sources. Another challenge is the capacity to store and analyze data because different sources might present their schema, making it challenging to store everything in a single, unified database. The third challenge is handling the large amount of data and analyzing it, which takes a lot of work. Lastly, there is a need for more automation to enable automatic cost collection, storage, and data processing, as well as planning for corrective actions to be taken in the event of detecting wasted resources.

Fortunately, Krateo's FinOps module addresses these problems pragmatically and modularly, allowing for ease of use, efficient performance, and customization.

To start, the module introduces a standardization layer comprising two industry-standard specifications: the FinOps Foundation's FOCUS specification and Prometheus. The FOCUS specification is an industry-wide cost-measuring standard that helps standardize cost-related data presentation. We use this standard to have a common cost-collection starting point for the API endpoints. This is achieved by a set of Prometheus exporters, which are placed as interposers between the cloud providers' APIs and our FinOps module, allowing for the translation and presentation of data in a completely standardized format.

The data storage problem is simplified thanks to the standardization layer, and it is solved using a data lake: Databricks Delta Lake. This storage solution allows the use of a standardized communication format, the Parquet file, which helps the quick transfer and storage of the standardized data coming from the exporting layer. To move the data from the export layer to the data lake, we use generic and configurable scrapers that can quickly move the data from the exporters to our data lake.

Once the data is stored in the data lake, we have another challenge: more than cost data is needed to optimize a cloud-based service. For example, a simple web server hosted on the cloud and a cost-optimization algorithm. The algorithm's goal is to reduce the cost as much as possible. With only the cost data available, this translates into shutting down the web server. This means there is a need for additional information, namely, performance metrics from the virtual machine running the web server and the key performance metrics (e.g., average response time), along with a performance goal. To obtain these data, we can use the FOCUS specification to develop a new set of exporters targeting usage and performance metrics. To allow for the seamless integration of these new exporters, we task the scrapers to analyze the data before uploading and identify all resources, then request new exporters and scrapers for these cloud resources. Since our scrapers are generic and configurable, we can reuse them to upload the data to our data lake.

With all the data collected in the data lake, we can analyze it to find avenues for cost optimization. This can be achieved with multivariable optimization functions and statistical analysis with pattern recognition. Another way of analyzing large quantities of data is by querying LLMs. We can give an LLM the context and data of our problem and then query it for possible scenarios, uncovering cost-cutting measures that would be invisible to traditional algorithms or would otherwise require a team of data analysts.

Finally, to act upon newly found cost-related deficiencies, we transform all the optimizations into a set of Kubernetes-standard metrics and forward them into a Kubernetes Full Metrics Pipeline. This allows us to use Kubernetes scalers and operators (the operators are explicitly coded to interact with cloud services) to monitor these metrics and act automatically when the metrics changes demand it.

In conclusion, Krateo's FinOps module covers the entire spectrum of cost-related optimization, considering all the challenges and complexities involved in managing costs and optimizing performance in cloud-based services and applications.
