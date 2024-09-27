#!/bin/sh

set -x

# Check requirements
if ! kubectl >/dev/null 2>&1 ; then
  echo "Missing Kubectl binary, please install it from https://kubernetes.io/docs/tasks/tools/"
  exit 1
fi

if ! kind --version >/dev/null 2>&1 ; then
  echo "Missing Kind binary, please install it from https://github.com/kubernetes-sigs/kind"
  exit 1
fi

helm repo add krateo https://charts.krateo.io

helm repo update krateo

kind create cluster --wait 120s --image kindest/node:v1.30.4 --config - <<EOF
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: krateo-quickstart
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
  extraPortMappings:
  - containerPort: 30080 # Krateo Portal
    hostPort: 30080
  - containerPort: 30081 # Krateo BFF
    hostPort: 30081
  - containerPort: 30082 # Krateo AuthN Service
    hostPort: 30082
  - containerPort: 30083 # Krateo EventSSE
    hostPort: 30083
  - containerPort: 30084 # Krateo Terminal Server
    hostPort: 30084
  - containerPort: 30084 # Krateo FireworksApp Frontend
    hostPort: 30085
  - containerPort: 31443 # vCluster API Server Port
    hostPort: 31443
networking:
  # By default the API server listens on a random open port.
  # You may choose a specific port but probably don't need to in most cases.
  # Using a random port makes it easier to spin up multiple clusters.
  apiServerPort: 6443
EOF

helm upgrade installer installer \
  --repo https://charts.krateo.io \
  --namespace krateo-system \
  --create-namespace \
  --install \
  --version 2.1.8 \
  --wait
