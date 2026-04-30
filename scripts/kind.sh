#!/bin/bash

# ==============================================================================
# kind.sh - Create a KIND cluster with Krateo-specific configuration
# Port mappings align with krateo 3.0.0 nodeport deployment
# ==============================================================================

set -e

CLUSTER_NAME="${1:-krateo-quickstart}"
CLUSTER_IMAGE="${2:-kindest/node:v1.33.4}"
WAIT_TIME="120s"

log_info() {
    echo "[INFO] $1"
}

log_success() {
    echo "[SUCCESS] $1"
}

error_exit() {
    echo "[ERROR] $1" >&2
    exit 1
}

# Check prerequisites
log_info "Checking prerequisites..."

if ! command -v kubectl &> /dev/null; then
    error_exit "kubectl not found. Install from https://kubernetes.io/docs/tasks/tools/"
fi

if ! command -v kind &> /dev/null; then
    error_exit "kind not found. Install from https://github.com/kubernetes-sigs/kind"
fi

log_success "All prerequisites found"

# Create KIND cluster with Krateo-specific port mappings
log_info "Creating KIND cluster: $CLUSTER_NAME"
log_info "Image: $CLUSTER_IMAGE"
log_info "Waiting up to $WAIT_TIME for cluster to be ready"

kind create cluster \
    --wait "$WAIT_TIME" \
    --image "$CLUSTER_IMAGE" \
    --name "$CLUSTER_NAME" \
    --config - <<'KINDCONFIG'
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
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
  # Krateo platform services on NodePort
  - containerPort: 30080
    hostPort: 30080
    protocol: TCP
    # Krateo Frontend Portal UI
  - containerPort: 30081
    hostPort: 30081
    protocol: TCP
    # Krateo Snowplow (analytics)
  - containerPort: 30082
    hostPort: 30082
    protocol: TCP
    # Krateo AuthN (authentication)
  - containerPort: 30083
    hostPort: 30083
    protocol: TCP
    # Krateo Events Presenter
  - containerPort: 30086
    hostPort: 30086
    protocol: TCP
    # Krateo FinOps Database Handler
networking:
  apiServerPort: 6443
KINDCONFIG

if [ $? -eq 0 ]; then
    log_success "KIND cluster '$CLUSTER_NAME' created successfully"
else
    error_exit "Failed to create KIND cluster"
fi

# Create krateo-system namespace
log_info "Creating krateo-system namespace..."
kubectl create namespace krateo-system || true
log_success "Namespace created"

# Next steps
echo ""
echo "======================================================================"
echo "KIND cluster is ready. Next steps:"
echo "======================================================================"
echo ""
echo "1. Create secrets (required before installation):"
echo "   See: https://docs.krateo.io/docs/20-key-concepts/50-krateoctl/secrets"
echo ""
echo "2. Install Krateo with NodePort:"
echo "   krateoctl install plan --version 3.0.0 --type nodeport"
echo "   krateoctl install apply --version 3.0.0 --type nodeport"
echo ""
echo "3. Access Krateo:"
echo "   http://localhost:30080"
echo ""
echo "For a quickstart with automatic secrets, run:"
echo "   bash scripts/kind-quickstart.sh"
echo ""
echo "======================================================================"

