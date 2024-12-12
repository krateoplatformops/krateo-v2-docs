# patch-provider

The [𝘱𝘢𝘵𝘤𝘩-𝘱𝘳𝘰𝘷𝘪𝘥𝘦𝘳](https://github.com/krateoplatformops/patch-provider) is the fourth component of Krateo Composable Operations (KCO) of Krateo PlatformOps.

🎯 Its primary purpose is to modify a Kubernetes resource's values by taking another resource's value as a source and possibly applying transformations.

↪ The need to implement the patch-provider arose from the need to establish dependencies between the outputs of one resource (for example, a field in its status) and the inputs of another.

👇 Attached is an example of a Patch that takes the 'data.value1' field from the 'foo' ConfigMap and encodes it in base64 by adding the 'prefix-' prefix and saving the result in the 'data.value2' field of the ConfigMap 'bar'.

```yaml
apiVersion: krateo.io/v1alpha1
kind: Patch
metadata:
  name: sample1
spec:
  from:
    objectReference:
      apiVersion: v1
      kind: ConfigMap
      name: foo
    fieldPath: data
  to:
    objectReference:
      apiVersion: v1
      kind: ConfigMap
      name: bar
    fieldPath: data.value2
    transforms:
      - b64enc .value1
      - printf "prefix-%s"
 ```