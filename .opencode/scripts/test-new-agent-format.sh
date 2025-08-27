#!/bin/bash

echo "🧪 Testing @foldername/agentname Format"
echo "======================================"

# Function to demonstrate agent calls
demonstrate_agent_call() {
    local agent=$1
    local task=$2
    echo ""
    echo "📞 Calling: $agent"
    echo "Task: $task"
    echo "Format: ✅ @foldername/agentname"
    echo "Category: ${agent%/*}"
    echo "Agent: ${agent#*/}"
    printf ─%.0s {1..50}; echo
}

echo "🎯 Testing Individual Agent Calls"
echo ""

# Test different agent categories
demonstrate_agent_call "@common/code-reviewer" "Review authentication code for security issues"
demonstrate_agent_call "@domains/api/api-designer" "Design REST API for user management"
demonstrate_agent_call "@general/code-architect" "Design system architecture for e-commerce"
demonstrate_agent_call "@platforms/codeberg/codeberg-specialist" "Configure repository settings"

echo ""
echo "🤝 Testing Agent Orchestration"
echo ""

# Demonstrate orchestration scenarios
echo "📋 Scenario 1: New Feature Development"
echo "Command: @common/agent-orchestrator \"Coordinate team for user auth feature\""
echo "Agents:"
echo "  - @general/code-architect: System design"
echo "  - @domains/api/api-designer: API design"
echo "  - @domains/api/database-specialist: Database design"
echo "  - @common/security-auditor: Security review"
echo "  - @common/test-engineer: Test implementation"
echo ""

echo "📋 Scenario 2: API Development"
echo "Command: @common/agent-orchestrator \"Build product catalog API\""
echo "Agents:"
echo "  - @domains/api/api-designer: API specification"
echo "  - @domains/api/database-specialist: Query optimization"
echo "  - @common/performance-optimizer: Performance monitoring"
echo "  - @common/documentation-maintainer: API docs"
echo ""

echo "📋 Scenario 3: Platform Setup"
echo "Command: @common/agent-orchestrator \"Set up Codeberg CI/CD\""
echo "Agents:"
echo "  - @platforms/codeberg/codeberg-specialist: Repository config"
echo "  - @platforms/codeberg/codeberg-workflow-manager: CI/CD setup"
echo "  - @general/deployment-specialist: Deployment config"
echo ""

echo "🔍 Testing Agent Discovery"
echo ""

# Show how to find agents by category
echo "📂 Common Agents (always available):"
find .opencode/agent/common -name "*.md" -not -name "*.disabled" | sed 's|.*/||' | sed 's|\.md||' | sed 's|^|@common/|'
echo ""

echo "📂 Domain Agents:"
find .opencode/agent/domains -name "*.md" -not -name "*.disabled" | sed 's|.*/domains/||' | sed 's|/|/@domains/|g' | sed 's|\.md||'
echo ""

echo "📂 General Agents:"
find .opencode/agent/general -name "*.md" -not -name "*.disabled" | sed 's|.*/||' | sed 's|\.md||' | sed 's|^|@general/|'
echo ""

echo "📂 Platform Agents (Codeberg):"
find .opencode/agent/platforms/codeberg -name "*.md" -not -name "*.disabled" | sed 's|.*/||' | sed 's|\.md||' | sed 's|^|@platforms/codeberg/|'
echo ""

echo "✅ Format Testing Complete!"
echo ""
echo "📝 Key Benefits Demonstrated:"
echo "  • Clear agent categorization"
echo "  • Consistent naming convention"
echo "  • Easy agent discovery"
echo "  • Platform-specific agent identification"
echo "  • Logical workflow organization"
echo ""
echo "🚀 Ready to use @foldername/agentname format in your projects!"
