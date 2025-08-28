# OpenCode Template Repository - Getting Started

Welcome to the OpenCode Template Repository! This is a best-practice template featuring intelligent agent orchestration, comprehensive testing, automated workflows, and secure permissions. This guide will help you understand how to use this template for new projects and customize it to your needs.

## Template Usage Overview

This repository serves as a template for new OpenCode projects. To use this template:

1. **Clone or fork** this repository as your project starting point
2. **Customize** the configuration files for your specific needs
3. **Initialize** the project with your own settings
4. **Adapt** agents and commands to your project requirements

### Key Template Features

- **Pre-configured agents** for common development tasks
- **Automatic repository link management** for multi-platform git hosting
- **Smart documentation updates** that adapt to your repository location
- **Automated workflows** via custom commands
- **Security and quality gates** built-in
- **Comprehensive testing setup** ready to use
- **Documentation templates** for consistent project docs

## Quick Start

### 1. Initial Setup

#### Repository Link Configuration

The OpenCode framework automatically detects your git repository and updates all documentation links:

```bash
# Automatic repository link detection and updating
./.opencode/tests/test-runner --update-links

# Or run the updater directly
node .opencode/tests/enhanced-link-updater.js

# Manual update if needed
git remote set-url origin https://your-platform.com/your-org/your-repo.git
./.opencode/tests/test-runner --update-links
```

**Supported Platforms:** GitHub, Codeberg, GitLab, Bitbucket

This ensures all documentation links (README, issues, clone URLs) point to the correct repository.

### 2. Basic Usage

```bash
# Analyze existing code
@code-reviewer analyze the authentication module

# Implement a new feature
@orchestrator implement user authentication system

# Run comprehensive tests
npm run test

# Review a pull request
@code-reviewer review the recent changes
```

## Available Agents

### Core Agents

- **orchestrator**: Coordinates complex multi-agent workflows
- **code-architect**: System design and architecture specialist
- **code-reviewer**: Code quality and best practices reviewer
- **test-engineer**: Testing strategy and implementation
- **security-auditor**: Security vulnerability assessment
- **performance-optimizer**: Performance analysis and optimization

### Specialized Agents

- **api-designer**: API development and design
- **database-specialist**: Database operations and optimization
- **ci-cd-manager**: Pipeline management and automation
- **documentation-maintainer**: Documentation automation
- **deployment-specialist**: Deployment and infrastructure

## Template Customization

### Adapting for Your Project

1. **Update Project Context**:

   ```bash
   # Edit AGENTS.md with your project specifics
   nano AGENTS.md

   # Update opencode.json permissions if needed
   nano opencode.json
   ```

2. **Customize Agents**:

   ```bash
   # Modify existing agents in .opencode/agent/
   nano .opencode/agent/code-reviewer.md

   # Add project-specific agents
   echo "Create new agent file in .opencode/agent/"
   ```

3. **Configure Validation Rules**:

   ```bash
   # Adjust quality thresholds
   nano .opencode/validation/code-quality-rules.json

   # Set performance benchmarks
   nano .opencode/validation/performance-thresholds.json
   ```

4. **Set Up Plugins**:

   ```bash
   # Configure environment protection
   nano .opencode/plugin/env-protection.js

   # Customize git hooks
   nano .opencode/plugin/git-hooks.js
   ```

## Agent Usage Patterns

### Single Agent Tasks

```bash
# Use specific agent directly
@code-reviewer analyze the authentication module
@security-auditor scan for vulnerabilities in /src/auth
@performance-optimizer profile the user service
```

### Multi-Agent Workflows

```bash
# Orchestrator coordinates multiple agents
@orchestrator implement complete user management system
@orchestrator optimize application for production deployment
@orchestrator prepare release with full testing and docs
```

## Custom Commands

All custom commands are located in `.opencode/command/` and provide automated workflows:

### Setup Commands

- **Repository Link Management**: `./.opencode/tests/test-runner --update-links`
- **Project Initialization**: Check `.opencode/command/init-project.md`
- **Environment Setup**: Check `.opencode/command/setup-env.md`
- **Dependency Installation**: `npm install`

### Development Commands

- **Code Analysis**: `@code-reviewer analyze codebase`
- **Feature Implementation**: `@orchestrator implement feature`
- **Pull Request Review**: `@code-reviewer review changes`
- **Testing**: `npm run test`

### Testing Commands

- **Unit Tests**: `npm test`
- **Integration Tests**: Check test configuration in `package.json`
- **Performance Tests**: `@performance-optimizer run benchmarks`
- **Security Tests**: `@security-auditor run security tests`

### Framework Testing (Technology-Agnostic)

```bash
# Universal testing for any project type
./.opencode/tests/test-runner --auto

# Force specific runtime
./.opencode/tests/test-runner --node      # Node.js (fastest for JS/TS)
./.opencode/tests/test-runner --docker    # Docker (works with any project)
./.opencode/tests/test-runner --basic     # Basic validation only

# Docker-based testing (any project type)
docker-compose -f .opencode/tests/docker-compose.yml up
```

### Deployment Commands

- **Build**: `npm run build`
- **Staging Deployment**: Check `.opencode/command/deploy-staging.md`
- **Production Deployment**: Check `.opencode/command/deploy-prod.md`
- **Rollback**: Check `.opencode/command/rollback.md`

## Best Practices

### Working with Agents

1. **Use Descriptive Requests**: Provide clear, specific requirements
2. **Leverage Orchestration**: Use the orchestrator for complex workflows
3. **Review Agent Outputs**: Always validate agent recommendations
4. **Follow Quality Gates**: Ensure all quality checks pass

### Code Development

1. **Architecture First**: Design before implementation
2. **Security by Design**: Consider security in all phases
3. **Test-Driven Development**: Write tests alongside code
4. **Continuous Documentation**: Keep docs updated with changes

### Collaboration

1. **Agent Specialization**: Use the right agent for each task
2. **Context Sharing**: Provide relevant project context
3. **Iterative Improvement**: Use agent feedback for continuous improvement
4. **Quality Focus**: Prioritize quality over speed

## Troubleshooting

### Common Issues

- **Agent Not Responding**: Check agent configuration in `opencode.json`
- **Permission Errors**: Verify agent tool permissions
- **Context Missing**: Ensure `AGENTS.md` contains project context
- **Performance Issues**: Monitor agent resource usage

### Getting Help

1. Check `.opencode/docs/TROUBLESHOOTING.md` for common solutions
2. Review agent-specific documentation
3. Use `opencode --help` for command usage
4. Check OpenCode documentation at https://opencode.ai/docs/

## Next Steps

1. **Explore Agents**: Try different agents with simple tasks
2. **Custom Commands**: Learn to use workflow automation commands
3. **Advanced Features**: Explore multi-agent orchestration
4. **Customization**: Adapt agents and commands to your project needs

Happy coding with OpenCode! 🚀
