#!/bin/bash

AGENT_DEPS_FILE=".opencode/agent-dependencies.json"
AGENT_DIR=".opencode/agent"

echo "🔍 Validating agent dependencies..."

# Check if dependency file exists
if [[ ! -f "$AGENT_DEPS_FILE" ]]; then
    echo "❌ Agent dependencies file not found: $AGENT_DEPS_FILE"
    exit 1
fi

# Function to check if agent exists (active or disabled)
agent_exists() {
    local agent_name=$1
    [[ -f "$AGENT_DIR/common/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/platforms/codeberg/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/platforms/github/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/domains/api/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/domains/ui/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/general/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/common/$agent_name.md.disabled" ]] || \
    [[ -f "$AGENT_DIR/platforms/codeberg/$agent_name.md.disabled" ]] || \
    [[ -f "$AGENT_DIR/platforms/github/$agent_name.md.disabled" ]] || \
    [[ -f "$AGENT_DIR/domains/api/$agent_name.md.disabled" ]] || \
    [[ -f "$AGENT_DIR/domains/ui/$agent_name.md.disabled" ]] || \
    [[ -f "$AGENT_DIR/general/$agent_name.md.disabled" ]]
}

# Function to check if agent is active (not disabled)
agent_active() {
    local agent_name=$1
    [[ -f "$AGENT_DIR/common/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/platforms/codeberg/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/platforms/github/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/domains/api/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/domains/ui/$agent_name.md" ]] || \
    [[ -f "$AGENT_DIR/general/$agent_name.md" ]]
}

# Read and validate each agent
while IFS= read -r agent_name; do
    # Skip empty lines and comments
    [[ -z "$agent_name" ]] && continue
    [[ "$agent_name" == "#"* ]] && continue
    
    echo "📋 Checking agent: $agent_name"
    
    # Check if agent exists
    if ! agent_exists "$agent_name"; then
        echo "  ❌ Agent '$agent_name' not found in any directory"
        continue
    fi
    
    # Get agent dependencies
    requires=$(jq -r ".\"$agent_name\".requires[] // empty" "$AGENT_DEPS_FILE" 2>/dev/null)
    conflicts=$(jq -r ".\"$agent_name\".conflicts[] // empty" "$AGENT_DEPS_FILE" 2>/dev/null)
    
    # Check required agents
    if [[ -n "$requires" ]]; then
        echo "  📎 Checking requirements..."
        for req in $requires; do
            if ! agent_exists "$req"; then
                echo "    ❌ Required agent '$req' not found"
            elif ! agent_active "$req"; then
                echo "    ⚠️  Required agent '$req' is disabled"
            else
                echo "    ✅ Required agent '$req' is active"
            fi
        done
    fi
    
    # Check conflicting agents
    if [[ -n "$conflicts" ]]; then
        echo "  ⚔️  Checking conflicts..."
        for conflict in $conflicts; do
            if agent_active "$conflict"; then
                echo "    ❌ Conflicting agent '$conflict' is active"
            else
                echo "    ✅ Conflicting agent '$conflict' is not active"
            fi
        done
    fi
    
    echo "  ✓ Agent '$agent_name' validation complete"
    echo
    
done < <(jq -r 'keys[]' "$AGENT_DEPS_FILE")

echo "🎉 Agent dependency validation complete!"
