# Practical Examples: @foldername/agentname Format

This document demonstrates how to use the new @foldername/agentname format for calling OpenCode agents in real development scenarios.

## 🚀 Development Workflow Examples

### Example 1: New Feature Implementation

**Scenario**: Implementing user authentication with security review

```bash
# Using the new @foldername/agentname format
@common/agent-orchestrator "Please coordinate the following for user authentication:
1. @general/code-architect - Design the authentication system architecture
2. @domains/api/api-designer - Create REST API endpoints for auth
3. @domains/api/database-specialist - Design user database schema
4. @common/security-auditor - Review security implementation
5. @common/test-engineer - Create comprehensive test suite
6. @common/code-reviewer - Final code quality review"
```

**Benefits of new format:**
- Clear agent categorization (common, general, domains)
- Easy to understand agent responsibilities
- Platform-agnostic references

### Example 2: API Development Workflow

**Scenario**: Building a REST API for a product catalog

```bash
# Coordinate API development team
@common/agent-orchestrator "Build product catalog API:
- @domains/api/api-designer: Design REST endpoints and OpenAPI spec
- @domains/api/database-specialist: Optimize database queries and schema
- @common/test-engineer: Create API integration tests
- @common/performance-optimizer: Monitor API performance
- @common/documentation-maintainer: Generate API documentation"
```

### Example 3: UI Component Development

**Scenario**: Creating a responsive dashboard component

```bash
# UI development coordination
@common/agent-orchestrator "Develop responsive dashboard:
- @domains/ui/ui-ux-designer: Design component architecture and user experience
- @general/code-architect: Plan component structure and state management
- @common/performance-optimizer: Optimize rendering performance
- @common/test-engineer: Create component tests
- @common/code-reviewer: Review code quality and accessibility"
```

## 🏷️ Platform-Specific Examples

### Example 4: Codeberg Repository Management

**Scenario**: Setting up CI/CD for a new project

```bash
# Platform-specific workflow
@common/agent-orchestrator "Set up Codeberg CI/CD:
- @platforms/codeberg/codeberg-specialist: Configure repository settings
- @platforms/codeberg/codeberg-workflow-manager: Set up Forgejo Actions
- @general/ci-cd-manager: Design pipeline strategy
- @general/deployment-specialist: Configure deployment process"
```

## 🔧 Individual Agent Examples

### Example 5: Code Review Request

```bash
# Direct agent call for code review
@common/code-reviewer "Please review this authentication module for:
- Security best practices
- Code quality and maintainability
- Performance considerations
- Error handling patterns"
```

### Example 6: Database Optimization

```bash
# Database performance analysis
@domains/api/database-specialist "Analyze and optimize the user query performance:
- Review current database schema
- Identify slow queries
- Suggest indexing improvements
- Recommend optimization strategies"
```

### Example 7: Security Audit

```bash
# Security assessment
@common/security-auditor "Perform security audit on the authentication system:
- Check for common vulnerabilities
- Review input validation
- Assess data protection measures
- Recommend security improvements"
```

## 📋 Agent Categories Overview

| Category | Prefix | Purpose | Example Agents |
|----------|--------|---------|----------------|
| **Common** | `@common/` | Always available, core functionality | agent-orchestrator, code-reviewer, test-engineer |
| **Domains** | `@domains/` | Business domain specialists | api-designer, database-specialist, ui-ux-designer |
| **General** | `@general/` | General-purpose tools | code-architect, deployment-specialist, ci-cd-manager |
| **Platforms** | `@platforms/` | Platform-specific tools | codeberg-specialist, github-specialist |

## 🎯 Best Practices

### 1. Use Full Format in Documentation
```bash
# ✅ Good: Clear and specific
@domains/api/api-designer "Design user API"

# ❌ Avoid: Ambiguous
api-designer "Design user API"
```

### 2. Leverage Agent Categories
```bash
# ✅ Good: Use appropriate agent types
@general/code-architect "Design system architecture"
@domains/api/api-designer "Design API interfaces"

# ❌ Avoid: Using wrong agent types
@common/code-reviewer "Design system architecture"
```

### 3. Combine Related Agents
```bash
# ✅ Good: Logical agent combinations
@common/agent-orchestrator "Coordinate:
- @general/code-architect: System design
- @domains/api/api-designer: API design
- @common/test-engineer: Testing strategy"
```

## 🔄 Migration from Old Format

### Before (Old Format)
```bash
agent-orchestrator "Use code-architect, api-designer, and test-engineer"
```

### After (New Format)
```bash
@common/agent-orchestrator "Use @general/code-architect, @domains/api/api-designer, and @common/test-engineer"
```

## 📊 Benefits Summary

1. **Clarity**: Instantly know agent category and specialization
2. **Consistency**: Standardized naming across all projects
3. **Discoverability**: Easy to find appropriate agents
4. **Platform Awareness**: Clear platform-specific agent identification
5. **Scalability**: Easy to add new agents in organized structure

## 🧪 Testing the New Format

To test the new format in your projects:

1. **Update existing scripts** to use @foldername/agentname
2. **Use in documentation** for clear agent references
3. **Train team members** on the new calling convention
4. **Validate usage** in code reviews and PRs

The new format provides better organization, clarity, and maintainability for complex multi-agent workflows.
