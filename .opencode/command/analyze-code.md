---
description: Perform comprehensive multi-agent code analysis including quality, security, performance, and architecture review
agent: common/agent-orchestrator
---

Analyze the codebase with focus on $ARGUMENTS. Perform comprehensive multi-agent code analysis including:

1. **Code Quality Review**: Assess code quality, best practices, and maintainability
2. **Security Audit**: Scan for vulnerabilities and security issues
3. **Performance Analysis**: Identify performance bottlenecks and optimization opportunities
4. **Architecture Review**: Evaluate architectural patterns and design decisions

**Current Project Structure:**
!`find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | head -20`

**Recent Changes:**
!`git log --oneline -5`

**Test Coverage:**
!`npm run test:coverage`

**Project Dependencies:**
!`npm list --depth=0 | grep -E "(react|vite|typescript)" | head -10`

**Code Quality Metrics:**
!`find src -name "*.ts" -o -name "*.tsx" | wc -l` TypeScript files
!`find src -name "*.js" -o -name "*.jsx" | wc -l` JavaScript files

Please provide a comprehensive analysis report with actionable recommendations for improvement.
