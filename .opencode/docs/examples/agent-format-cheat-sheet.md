# @foldername/agentname Format Cheat Sheet

## 📖 Quick Reference Guide

### Agent Categories & Examples

| Category | Format | Examples | Use Case |
|----------|--------|----------|----------|
| **Common** | `@common/agent-name` | `@common/code-reviewer`<br>`@common/test-engineer`<br>`@common/security-auditor` | Core functionality, always available |
| **Domains** | `@domains/domain/agent-name` | `@domains/api/api-designer`<br>`@domains/api/database-specialist`<br>`@domains/ui/ui-ux-designer` | Business domain specialists |
| **General** | `@general/agent-name` | `@general/code-architect`<br>`@general/deployment-specialist`<br>`@general/ci-cd-manager` | General-purpose development tools |
| **Platforms** | `@platforms/platform/agent-name` | `@platforms/codeberg/codeberg-specialist`<br>`@platforms/github/github-specialist` | Platform-specific tools |

### Common Agent Calls

#### Individual Agent Calls
```bash
# Code Review
@common/code-reviewer "Review this authentication module"

# API Design
@domains/api/api-designer "Design user management API"

# Security Audit
@common/security-auditor "Audit for vulnerabilities"

# Database Optimization
@domains/api/database-specialist "Optimize user queries"

# UI Design
@domains/ui/ui-ux-designer "Design login form"

# Architecture Design
@general/code-architect "Design system architecture"
```

#### Agent Orchestration
```bash
# New Feature Development
@common/agent-orchestrator "Implement user auth:
- @general/code-architect: System design
- @domains/api/api-designer: API design
- @common/security-auditor: Security review
- @common/test-engineer: Testing"

# API Development
@common/agent-orchestrator "Build product API:
- @domains/api/api-designer: API spec
- @domains/api/database-specialist: Database design
- @common/performance-optimizer: Optimization"

# Platform Setup
@common/agent-orchestrator "Setup CI/CD:
- @platforms/codeberg/codeberg-specialist: Repository
- @platforms/codeberg/codeberg-workflow-manager: Workflows
- @general/deployment-specialist: Deployment"
```

### Finding Agents

```bash
# List all common agents
npm run agents:list | grep "@common/"

# List all API agents
npm run agents:list | grep "@domains/api/"

# List all platform agents
npm run agents:list | grep "@platforms/"
```

### Migration Guide

#### Old Format (Deprecated)
```bash
agent-orchestrator "Use code-architect and api-designer"
```

#### New Format (Recommended)
```bash
@common/agent-orchestrator "Use @general/code-architect and @domains/api/api-designer"
```

### Best Practices

1. **Use full format** in all documentation
2. **Choose appropriate agents** for the task
3. **Combine related agents** logically
4. **Be platform-aware** when calling platform agents
5. **Use orchestration** for complex multi-step tasks

### Platform Commands

```bash
# Detect current platform
npm run platform:detect

# Activate platform agents
npm run platform:codeberg  # For Codeberg
npm run platform:github    # For GitHub (when available)

# List active agents
npm run agents:list
```

### Quick Examples by Task

#### Code Review
```bash
@common/code-reviewer "Review for security, performance, and maintainability"
```

#### API Development
```bash
@domains/api/api-designer "Design REST API with OpenAPI spec"
@domains/api/database-specialist "Optimize database schema and queries"
```

#### Security
```bash
@common/security-auditor "Audit for OWASP Top 10 vulnerabilities"
```

#### Testing
```bash
@common/test-engineer "Create unit, integration, and e2e tests"
```

#### Documentation
```bash
@common/documentation-maintainer "Generate comprehensive API docs"
```

#### Deployment
```bash
@general/deployment-specialist "Configure production deployment"
@platforms/codeberg/codeberg-workflow-manager "Setup CI/CD pipeline"
```

### Benefits Reminder

- **🔍 Clear**: Instantly know agent category and specialization
- **📁 Organized**: Logical folder structure
- **🔄 Consistent**: Standardized naming across projects
- **🎯 Discoverable**: Easy to find appropriate agents
- **🏷️ Platform-Aware**: Clear platform-specific identification

**Happy coding with the new @foldername/agentname format! 🚀**
