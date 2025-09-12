# OpenCode Agent Subfolder Structure

This document describes the new subfolder organization for OpenCode agents and the platform-specific management system.

## Directory Structure

```
.opencode/agent/
├── common/              # Always active agents
│   ├── agent-orchestrator.md
│   ├── code-reviewer.md
│   ├── test-engineer.md
│   └── ...
├── platforms/           # Platform-specific agents
│   ├── codeberg/
│   │   ├── codeberg-specialist.md
│   │   └── codeberg-workflow-manager.md
│   ├── github/
│   │   ├── github-specialist.md.disabled
│   │   └── github-workflow-manager.md.disabled
│   └── ...
├── domains/            # Domain-specific agents
│   ├── api/
│   │   ├── api-designer.md
│   │   └── database-specialist.md
│   ├── ui/
│   │   └── ui-ux-designer.md
│   └── auth/
└── general/            # General-purpose agents
    ├── agent-creator.md
    ├── code-architect.md
    └── ...
```

## Platform Management

### Automatic Platform Detection

The system automatically detects your git platform based on repository files:

```bash
# Detect platform
npm run platform:detect

# Output: Detected platform: codeberg
```

### Manual Platform Activation

```bash
# Activate Codeberg agents
npm run platform:codeberg

# Activate GitHub agents  
npm run platform:github

# Activate other platforms
npm run platform:gitlab
npm run platform:gitea
npm run platform:forgejo
```

### Setup for New Projects

```bash
# Auto-setup based on detected platform
npm run platform:setup

# This will:
# 1. Detect your git platform
# 2. Activate appropriate agents
# 3. Deactivate conflicting agents
```

## Agent Categories

### Common Agents (Always Active)
- **agent-orchestrator**: Coordinates complex tasks
- **code-reviewer**: Code quality and security analysis
- **test-engineer**: Testing strategy and implementation
- **security-auditor**: Security assessments
- **performance-optimizer**: Performance analysis
- **documentation-maintainer**: Documentation management

### Platform-Specific Agents
- **codeberg-specialist**: Codeberg repository management
- **github-specialist**: GitHub repository management
- **gitlab-specialist**: GitLab repository management
- **gitea-specialist**: Gitea repository management
- **forgejo-specialist**: Forgejo repository management

### Domain-Specific Agents
- **api-designer**: RESTful and GraphQL API design
- **database-specialist**: Database schema and optimization
- **ui-ux-designer**: User interface and experience design

### General-Purpose Agents
- **agent-creator**: Create and manage OpenCode agents
- **code-architect**: System architecture design
- **ci-cd-manager**: CI/CD pipeline management
- **deployment-specialist**: Deployment and environment management

## Scripts

### Platform Management
```bash
npm run platform:detect      # Detect git platform
npm run platform:setup       # Auto-setup for detected platform
npm run platform:codeberg    # Activate Codeberg agents
npm run platform:github      # Activate GitHub agents
npm run platform:gitlab      # Activate GitLab agents
npm run platform:gitea       # Activate Gitea agents
npm run platform:forgejo     # Activate Forgejo agents
```

### Agent Management
```bash
npm run agents:list          # List active agents
npm run agents:validate      # Validate agent dependencies
npm run agents:clean         # Remove deactivated agents
```

## Agent Dependencies

The system includes dependency management to ensure proper agent activation:

```json
{
  "codeberg-specialist": {
    "requires": ["agent-orchestrator"],
    "conflicts": ["github-specialist", "gitlab-specialist"],
    "platform": "codeberg"
  }
}
```

### Validation
```bash
npm run agents:validate
```

This checks:
- Required agents are present and active
- Conflicting agents are not active
- Platform-specific agents match the current platform

## File Organization Rules

### Agent File Naming
- Active agents: `agent-name.md`
- Inactive agents: `agent-name.md.disabled`

### Platform Detection Logic
1. Check for `.codeberg/` directory → Codeberg
2. Check for `.github/workflows/` → GitHub
3. Check for `.gitlab-ci.yml` → GitLab
4. Check for `.gitea/` directory → Gitea
5. Check for `.forgejo/` directory → Forgejo
6. Default to generic

## Migration Guide

### For Existing Projects

1. **Backup current agents**:
   ```bash
   cp -r .opencode/agent .opencode/agent.backup
   ```

2. **Run platform setup**:
   ```bash
   npm run platform:setup
   ```

3. **Validate setup**:
   ```bash
   npm run agents:validate
   npm run agents:list
   ```

### For New Projects

1. **Initialize with platform detection**:
   ```bash
   npm run platform:setup
   ```

2. **Customize as needed**:
   ```bash
   # Edit agent configurations
   # Add domain-specific agents
   # Modify platform-specific settings
   ```

## Best Practices

### 1. Platform Consistency
- Use the same platform for all repositories in an organization
- Document platform choice in project README
- Set up platform-specific CI/CD workflows

### 2. Agent Customization
- Start with common agents for all projects
- Add platform-specific agents based on needs
- Create domain-specific agents for complex projects

### 3. Dependency Management
- Always run validation after agent changes
- Check for conflicts before activating new agents
- Keep agent dependencies documented

### 4. Version Control
- Commit active agent configurations
- Use .disabled for inactive agents (they're ignored)
- Document platform-specific customizations

## Troubleshooting

### Platform Not Detected
```bash
# Check repository structure
ls -la | grep -E '\.(github|codeberg|gitlab|gitea|forgejo)'

# Manual platform activation
npm run platform:codeberg  # or your platform
```

### Agent Conflicts
```bash
# Validate dependencies
npm run agents:validate

# Check active agents
npm run agents:list

# Clean up deactivated agents
npm run agents:clean
```

### Missing Required Agents
```bash
# Check if required agents exist
find .opencode/agent -name "*required-agent*"

# Re-run platform setup
npm run platform:setup
```

## Integration with CI/CD

### GitHub Actions Example
```yaml
- name: Setup OpenCode Platform
  run: npm run platform:setup

- name: Validate Agent Configuration
  run: npm run agents:validate
```

### Codeberg Actions Example
```yaml
- name: Setup OpenCode Platform
  run: npm run platform:setup

- name: Validate Agent Configuration
  run: npm run agents:validate
```

This subfolder structure provides excellent organization, platform flexibility, and maintainability for OpenCode projects.
