#!/bin/bash

AGENT_DIR=".opencode/agent"

echo "Cleaning up deactivated agents..."

# Remove all .disabled files
find "$AGENT_DIR" -name "*.disabled" -delete

echo "✓ Cleaned up deactivated agents"
