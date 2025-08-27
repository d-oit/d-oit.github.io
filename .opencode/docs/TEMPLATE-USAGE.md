# OpenCode Template Usage Guide

This comprehensive guide explains how to use this OpenCode template repository to bootstrap new projects with intelligent agent orchestration, automated workflows, and best practices built-in.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Initialization](#project-initialization)
3. [Template Customization](#template-customization)
4. [Agent Configuration](#agent-configuration)
5. [Validation Setup](#validation-setup)
6. [Plugin Configuration](#plugin-configuration)
7. [Command Development](#command-development)
8. [Testing and Validation](#testing-and-validation)
9. [Deployment Preparation](#deployment-preparation)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm installed
- Git configured with your credentials
- Basic understanding of OpenCode concepts

### Step 1: Clone the Template

```bash
# Clone this template repository
git clone https://codeberg.org/d-oit/do-opencode-template.git your-new-project
cd your-new-project

# Remove git history to start fresh
rm -rf .git
git init
```

### Step 2: Initial Setup

```bash
# Install dependencies
npm install

# Initialize OpenCode project
echo "Check .opencode/command/init-project.md for initialization steps"

# Set up development environment
echo "Check .opencode/command/setup-env.md for environment setup"
```

### Repository Link Management

The OpenCode framework automatically detects your git repository and updates all documentation links:

```bash
# Automatic repository link detection and updating
./.opencode/tests/test-runner --update-links

# Or run the updater directly
node .opencode/tests/enhanced-link-updater.js
```

**What gets updated:**
- README.md clone URLs and issue links
- All documentation files with repository references
- Template placeholder links (your-org, test-org, etc.)

**Supported platforms:** GitHub, Codeberg, GitLab, Bitbucket

This ensures all documentation links point to the correct repository automatically.

## Project Initialization

### Update Project Metadata

1. **Edit package.json** with your project details:

   ```json
   {
     "name": "your-project-name",
     "version": "1.0.0",
     "description": "Your project description",
     "author": "Your Name",
     "license": "MIT"
   }
   ```

2. **Update AGENTS.md** with project-specific information:
   - Technology stack choices
   - Development standards
   - Team-specific rules
   - Project architecture decisions

3. **Configure opencode.json** permissions for your environment

### Directory Structure Setup

```bash
# Create standard project directories
mkdir -p src/{components,pages,utils,types}
mkdir -p tests/{unit,integration,e2e}
mkdir -p docs
mkdir -p config
```

## Template Customization

### Technology Stack Selection

Update the **Technology Stack** section in AGENTS.md:

```markdown
## Technology Stack

- **Language**: TypeScript/JavaScript with strict mode
- **Package Manager**: pnpm (preferred) with workspace support
- **Build System**: Vite (chosen for fast development)
- **Testing**: Vitest with comprehensive coverage
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier with consistent configuration
```

### Development Standards Customization

Modify the **Development Standards** section:

```markdown
## Development Standards

- **Code Quality**: Maintain high code quality with comprehensive reviews
- **Testing**: Minimum 85% test coverage required for all new features
- **Security**: All code must pass security audits before merge
- **Documentation**: Keep documentation updated with all code changes
- **Performance**: Monitor and optimize performance continuously
- **Type Safety**: Use TypeScript strict mode, no `any` types allowed
```

## Agent Configuration

### Reviewing Existing Agents

Examine agents in `.opencode/agent/` and customize as needed:

```bash
# List all available agents
ls .opencode/agent/

# Review specific agent capabilities
cat .opencode/agent/code-reviewer.md
```

### Customizing Agent Behavior

1. **Update agent specializations** in their respective `.md` files
2. **Modify agent prompts** to match your coding standards
3. **Add domain-specific knowledge** to relevant agents
4. **Configure agent permissions** in `opencode.json`

### Creating New Agents

```bash
# Create command directory structure
mkdir -p .opencode/agent/your-domain

# Create agent file
echo "Create your-agent.md in .opencode/agent/your-domain/"
```

## Validation Setup

### Code Quality Rules

Edit `.opencode/validation/code-quality-rules.json`:

```json
{
  "complexity": {
    "maxCyclomaticComplexity": 10,
    "maxLinesPerFunction": 50,
    "maxParametersPerFunction": 4
  },
  "coverage": {
    "minBranchCoverage": 80,
    "minFunctionCoverage": 85,
    "minLineCoverage": 80
  }
}
```

### Performance Thresholds

Configure `.opencode/validation/performance-thresholds.json`:

```json
{
  "bundleSize": {
    "maxSize": "500KB",
    "maxGzipSize": "150KB"
  },
  "loadTimes": {
    "firstContentfulPaint": "1.5s",
    "largestContentfulPaint": "2.5s"
  }
}
```

### Security Rules

Customize `.opencode/validation/security-rules.json`:

```json
{
  "vulnerabilityScan": {
    "enabled": true,
    "severityThreshold": "medium"
  },
  "dependencyCheck": {
    "enabled": true,
    "allowVulnerabilities": false
  }
}
```

## Plugin Configuration

### Environment Protection Plugin

Edit `.opencode/plugin/env-protection.js`:

```javascript
// Customize environment variable patterns
const sensitivePatterns = [/API_KEY/, /SECRET/, /TOKEN/, /PASSWORD/, /DATABASE_URL/]

// Add project-specific patterns
const projectPatterns = [/STRIPE_SECRET/, /AWS_ACCESS_KEY/]
```

### Git Hooks Plugin

Configure `.opencode/plugin/git-hooks.js`:

```javascript
// Customize hooks for your workflow
const hooks = {
  'pre-commit': ['lint', 'test', 'type-check'],
  'pre-push': ['security-scan', 'integration-test'],
  'commit-msg': ['conventional-commit-check'],
}
```

### Notification Plugin

Set up `.opencode/plugin/notification.js`:

```javascript
// Configure notification channels
const channels = {
  slack: {
    webhook: process.env.SLACK_WEBHOOK,
    channels: ['#dev-notifications', '#build-status'],
  },
  email: {
    smtp: process.env.SMTP_CONFIG,
    recipients: ['team@company.com'],
  },
}
```

## Command Development

### Creating Custom Commands

Add commands to `.opencode/command/` directory:

```bash
# Create command directory structure
mkdir -p .opencode/command/your-workflow

# Create command file
echo "Create your-workflow.md in .opencode/command/"
```

### Example Custom Command

```markdown
# Custom Deployment Command

## Description

Automated deployment workflow for staging environment

## Usage

deploy-custom [options]

## Options

- `--env`: Target environment (staging|production)
- `--validate`: Run validation checks before deployment
- `--rollback`: Enable automatic rollback on failure

## Implementation

1. Run validation checks
2. Build application
3. Run tests
4. Deploy to target environment
5. Verify deployment
6. Send notifications
```

### Adapting Existing Commands

```bash
# Review existing commands
ls .opencode/command/

# Customize for your needs
nano .opencode/command/implement-feature.md
```

## Testing and Validation

### Universal Framework Testing (Technology-Agnostic)

```bash
# Auto-detect best runtime and test all framework components
./.opencode/tests/test-runner --auto

# Force specific runtime
./.opencode/tests/test-runner --node      # Node.js (fastest for JS/TS)
./.opencode/tests/test-runner --docker    # Docker (works with any project)
./.opencode/tests/test-runner --basic     # Basic validation only

# Docker-based testing (any project type)
docker-compose -f .opencode/tests/docker-compose.yml up
```

### JavaScript/TypeScript Project Testing

```bash
# Test all framework components
npm run test:framework:all

# Test specific components
npm run test:plugins           # Test all plugins
npm run test:validation:rules  # Test validation rules
npm run test:performance      # Test performance metrics
npm run test:links            # Test documentation links
npm run test:framework        # Test core framework functionality

# Run project unit tests
npm test
```

### Template-Specific Tests

```bash
# Test all plugins
echo "Check .opencode/plugin/ for available plugins"

# Validate all rules
cat .opencode/validation/code-quality-rules.json

# Test agent orchestration
echo "Check .opencode/agent/ for available agents"

# Run comprehensive validation
./.opencode/tests/test-runner --auto
```

### Integration Testing

```bash
# Test agent communication
echo "Check agent configuration in opencode.json"

# Validate plugin integration
ls .opencode/plugin/

# Test command workflows
ls .opencode/command/
```

## Deployment Preparation

### Build Configuration

```bash
# Set up build scripts in package.json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "test": "vitest",
    "type-check": "tsc --noEmit"
  }
}
```

### CI/CD Setup

Create GitHub Actions or other CI configuration:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  framework-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Framework Validation
        run: ./.opencode/tests/test-runner --auto

  docker-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Docker Framework Test
        run: ./.opencode/tests/test-runner --docker
```

### Multi-Language CI/CD Example

```yaml
# For Python projects
- name: Python Framework Validation
  run: ./.opencode/tests/test-runner --docker

# For Go projects
- name: Go Framework Validation
  run: ./.opencode/tests/test-runner --docker

# For Java projects
- name: Java Framework Validation
  run: ./.opencode/tests/test-runner --docker
```

### Environment Configuration

```bash
# Create environment files
cp .env.example .env.local

# Configure for your environment
nano .env.local
```

## Troubleshooting

### Common Issues

#### Agent Not Responding

```bash
# Check agent configuration
cat .opencode/agent/[agent-name].md

# Verify permissions in opencode.json
cat opencode.json

# Test agent individually
opencode @code-reviewer --help
```

#### Plugin Errors

```bash
# Test specific plugin
node .opencode/plugin/env-protection.js

# Check plugin configuration
cat .opencode/plugin/[plugin-name].js

# Review error logs
find .opencode -name "*.log" -exec cat {} \;
```

#### Validation Failures

```bash
# Run specific validation
cat .opencode/validation/code-quality-rules.json

# Check validation rules
cat .opencode/validation/code-quality-rules.json

# Adjust thresholds if needed
nano .opencode/validation/code-quality-rules.json
```

#### Command Not Found

```bash
# List available commands
ls .opencode/command/

# Check command file exists
ls .opencode/command/

# Verify command syntax
cat .opencode/command/[command-path].md
```

### Getting Help

1. Check this documentation for common solutions
2. Review agent-specific documentation in `.opencode/agent/`
3. Use `opencode --help` for command usage
4. Check OpenCode documentation at https://opencode.ai/docs/
5. Join the OpenCode community for support

## Best Practices

### Template Maintenance

- **Keep documentation updated** as you customize the template
- **Regularly review and update** validation rules
- **Monitor agent performance** and adjust configurations
- **Update dependencies** and plugins regularly
- **Share improvements** back to the template repository

### Team Onboarding

- **Document your customizations** clearly
- **Create team-specific guides** for common workflows
- **Set up training sessions** for new team members
- **Establish code review guidelines** using the agents

### Continuous Improvement

- **Monitor template effectiveness** through metrics
- **Gather feedback** from team members regularly
- **Update agents and commands** based on usage patterns
- **Contribute improvements** back to the community

---

_This template usage guide should be updated as your project evolves and you discover new patterns or requirements._
