---
description: Manage project dependencies with security checks, version validation, and optimization
agent: common/agent-orchestrator

---

Install and manage project dependencies with $ARGUMENTS options.

**Current Dependencies:**
!`cat package.json | jq '.dependencies | keys | length' 2>/dev/null || echo "No package.json found"`

**Package Manager:**
!`which pnpm || which npm || which yarn || echo "No package manager found"`

**Lock File Status:**
!`ls -la package-lock.json pnpm-lock.yaml yarn.lock 2>/dev/null || echo "No lock file found"`

Please manage project dependencies with the following approach:

1. **Dependency Analysis**: Analyze current dependencies and security status
2. **Installation Process**: Install dependencies using the appropriate package manager
3. **Security Audit**: Run comprehensive security vulnerability scanning
4. **Performance Analysis**: Assess bundle size and performance impact

**Dependency Categories to Install:**

- **Production**: React, React DOM, core utilities
- **Development**: TypeScript, Vite, Vitest, ESLint, Prettier, Husky, lint-staged

**Security Checks:**

- Dependency vulnerability scanning
- License compliance verification
- Outdated package detection
- Malicious package detection
- Supply chain security validation

**Quality Gates:**

- All dependencies installed successfully
- No high/critical security vulnerabilities
- Lock file updated and valid
- Peer dependencies satisfied
- Build process validated

**Performance Analysis:**

- Bundle size impact assessment
- Tree-shaking efficiency evaluation
- Duplicate dependency detection
- Load time impact estimation

Provide installation results, security audit summary, and performance analysis.
