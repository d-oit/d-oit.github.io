---
description: Set up a new OpenCode project with proper structure, configuration, and initial files
agent: common/agent-orchestrator

---

Initialize a new OpenCode project with $ARGUMENTS configuration.

**Current Directory Structure:**
!`ls -la`

**Existing Configuration:**
!`ls -la | grep -E '\.(json|ts|js|md)$' | head -10`

**OpenCode Status:**
!`ls -la .opencode 2>/dev/null || echo "No .opencode directory found"`

Please set up a complete OpenCode project with:

1. **Project Structure**: Create optimal directory structure following OpenCode conventions
2. **Configuration Files**: Generate all necessary configuration files
3. **Quality Standards**: Set up linting, formatting, and testing standards
4. **Documentation**: Create initial README and AGENTS.md files
5. **Agent Configuration**: Set up basic agent configurations
6. **Repository Links**: Update all repository links to match current git remote

**Project Structure to Create:**

```
src/
├── domains/           # Business domain folders
├── core/             # Application core (framework-level)
├── ui/               # UI framework and components
└── infrastructure/   # External integrations

tests/
├── unit/             # Unit tests
├── integration/      # Integration tests
└── setup.ts         # Test configuration

.opencode/
├── agent/           # Agent configurations
├── command/         # Custom commands
├── validation/      # Validation rules
└── plugin/          # Custom plugins
```

**Configuration Files:**

- package.json with OpenCode dependencies
- TypeScript configuration with strict mode
- ESLint and Prettier configurations
- Vite build configuration
- Test configuration with Vitest

**Quality Standards:**

- TypeScript strict mode enabled
- ESLint with comprehensive rules
- Prettier with consistent formatting
- 80%+ test coverage requirement
- Git hooks for quality gates

Provide complete setup instructions and all necessary configuration files.
