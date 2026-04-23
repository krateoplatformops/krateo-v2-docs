#!/bin/bash

# ==============================================================================
# kind-quickstart.sh - Create KIND cluster and install Krateo with automatic secrets
# Reuses kind.sh for cluster creation
# Designed for quickstart and demo purposes
# For production, use kind.sh + manual secret management
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLUSTER_NAME="${1:-krateo-quickstart}"
CLUSTER_IMAGE="${2:-kindest/node:v1.33.4}"

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

# Check krateoctl prerequisite
log_info "Checking prerequisites..."

if ! command -v krateoctl &> /dev/null; then
    error_exit "krateoctl not found. Install from https://github.com/krateoplatformops/krateoctl"
fi

log_success "krateoctl found"

# Create KIND cluster using kind.sh
log_info "Creating KIND cluster using kind.sh..."
bash "$SCRIPT_DIR/kind.sh" "$CLUSTER_NAME" "$CLUSTER_IMAGE"

if [ $? -ne 0 ]; then
    error_exit "Failed to create KIND cluster"
fi

# Install Krateo with automatic secrets
log_info "Installing Krateo 3.0.0 with automatic secrets..."
log_info "Running: krateoctl install apply --version 3.0.0 --type nodeport --init-secrets"

if ! krateoctl install apply --version 3.0.0 --type nodeport --init-secrets; then
    error_exit "Failed to install Krateo"
fi

log_success "Krateo 3.0.0 installed successfully"

# Final output
echo ""
echo "======================================================================"
echo "Krateo 3.0.0 Quickstart Complete!"
echo "======================================================================"
echo ""
echo "Access Krateo at:"
echo "   http://localhost:30080"
echo ""
echo "Cluster: $CLUSTER_NAME"
echo "Namespace: krateo-system"
echo ""
echo "To destroy the cluster, run:"
echo "   kind delete cluster --name $CLUSTER_NAME"
echo ""
echo "======================================================================"
