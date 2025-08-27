#!/bin/bash

PLATFORM=${1:-"$(.opencode/scripts/detect-platform.sh | tail -n1 | awk '{print $NF}')"}
AGENT_DIR=".opencode/agent"

echo "Activating agents for platform: $PLATFORM"

# Deactivate all platform-specific agents first
if [[ -d "$AGENT_DIR/platforms" ]]; then
    find "$AGENT_DIR/platforms" -name "*.md" -not -path "*/$PLATFORM/*" -exec mv {} {}.disabled 2>/dev/null \;
    find "$AGENT_DIR/platforms" -name "*.js" -not -path "*/$PLATFORM/*" -exec mv {} {}.disabled 2>/dev/null \;
fi

# Activate platform-specific agents
if [[ -d "$AGENT_DIR/platforms/$PLATFORM" ]]; then
    find "$AGENT_DIR/platforms/$PLATFORM" -name "*.md.disabled" -exec bash -c 'mv "$1" "${1%.disabled}"' _ {} \;
    find "$AGENT_DIR/platforms/$PLATFORM" -name "*.js.disabled" -exec bash -c 'mv "$1" "${1%.disabled}"' _ {} \;
    echo "✓ Activated $PLATFORM platform agents"
else
    echo "⚠ Platform $PLATFORM not supported or no specific agents found"
fi

# Ensure common agents are always active
if [[ -d "$AGENT_DIR/common" ]]; then
    find "$AGENT_DIR/common" -name "*.md.disabled" -exec bash -c 'mv "$1" "${1%.disabled}"' _ {} \;
    find "$AGENT_DIR/common" -name "*.js.disabled" -exec bash -c 'mv "$1" "${1%.disabled}"' _ {} \;
    echo "✓ Common agents are active"
fi

echo "Agent activation complete for platform: $PLATFORM"
