#!/bin/bash

echo "🔍 Validating OpenCode Agent Structure and @foldername/agentname Format"
echo "================================================================="

# Check if agent structure exists
if [[ ! -d ".opencode/agent" ]]; then
    echo "❌ .opencode/agent directory not found"
    exit 1
fi

echo "✅ Agent directory structure exists"

# Check agent categories
categories=("common" "domains" "general" "platforms")
for category in "${categories[@]}"; do
    if [[ -d ".opencode/agent/$category" ]]; then
        echo "✅ $category/ directory exists"
    else
        echo "❌ $category/ directory missing"
    fi
done

# Check agent-dependencies.json format
if [[ -f ".opencode/agent-dependencies.json" ]]; then
    echo "✅ agent-dependencies.json exists"
    
    # Check if it contains @foldername/agentname format
    if grep -q "@.*/.*\":" .opencode/agent-dependencies.json; then
        echo "✅ agent-dependencies.json uses @foldername/agentname format"
    else
        echo "❌ agent-dependencies.json does not use @foldername/agentname format"
    fi
else
    echo "❌ agent-dependencies.json not found"
fi

# Check active agents
echo ""
echo "📋 Active Agents:"
npm run agents:list

# Check platform detection
echo ""
echo "🏷️  Platform Detection:"
npm run platform:detect

# Check for @foldername/agentname format in documentation
echo ""
echo "📖 Documentation Format Check:"
if grep -q "@.*/.*" AGENTS.md; then
    echo "✅ AGENTS.md contains @foldername/agentname format"
else
    echo "❌ AGENTS.md does not contain @foldername/agentname format"
fi

if grep -q "@.*/.*" .opencode/agent/common/agent-orchestrator.md; then
    echo "✅ agent-orchestrator.md contains @foldername/agentname format"
else
    echo "❌ agent-orchestrator.md does not contain @foldername/agentname format"
fi

echo ""
echo "🎉 Agent structure validation complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Use @foldername/agentname format in your agent calls"
echo "2. Update any custom scripts to use the new format"
echo "3. Train team members on the new calling convention"
echo "4. Consider updating the Task tool implementation for full support"
