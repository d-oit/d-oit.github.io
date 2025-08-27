---
description: Configure the development environment with all necessary tools, dependencies, and settings
agent: common/agent-orchestrator

---

Set up the development environment with $ARGUMENTS configuration.

**System Information:**
!`node --version 2>/dev/null || echo "Node.js not found"`

**Package Manager:**
!`which pnpm || which npm || which yarn || echo "No package manager found"`

**Git Configuration:**
!`git config --list --local | grep -E "(user.name|user.email)" | head -2`

**Current Environment:**
!`ls -la .env* 2>/dev/null || echo "No environment files found"`

Please configure the complete development environment:

1. **System Validation**: Check Node.js version, package manager, and system requirements
2. **Dependency Installation**: Install all project dependencies
3. **Development Tools**: Configure linting, formatting, testing, and build tools
4. **Environment Setup**: Set up environment variables and configurations

**System Requirements:**

- Node.js 18+ installed and accessible
- Package manager (pnpm/npm/yarn) available
- Git configured with user name and email
- Development ports available (5173, 3000)
- Proper file permissions

**Dependencies to Install:**

- **Core**: React 18+, Vite, TypeScript
- **Development**: ESLint, Prettier, Vitest, Husky, lint-staged
- **Types**: TypeScript type definitions

**Tools to Configure:**

- Git hooks (pre-commit, pre-push)
- ESLint with React and TypeScript rules
- Prettier with consistent formatting
- Vitest with coverage reporting
- TypeScript strict mode
- Vite with HMR and optimization

**Environment Setup:**

- Create .env.local from .env.example
- Configure development-specific settings
- Set up API endpoints and database connections

Provide setup results, validation status, and next steps for development.
