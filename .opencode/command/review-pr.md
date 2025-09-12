---
description: Automated pull request review with multi-agent analysis and validation
agent: common/agent-orchestrator

---

Review the current pull request or recent changes with $ARGUMENTS focus.

**Current Branch:**
!`git branch --show-current`

**Recent Commits:**
!`git log --oneline -10`

**Changed Files:**
!`git diff --name-only HEAD~1`

**Test Results:**
!`npm run test -- --coverage --coverageReporters=text-summary | tail -10`

Please perform a comprehensive code review covering:

1. **Code Quality**: Readability, maintainability, and adherence to best practices
2. **Security**: Vulnerability assessment and secure coding practices
3. **Performance**: Performance impact and optimization opportunities
4. **Testing**: Test coverage and quality (target: 80%+ coverage)
5. **Architecture**: Design decisions and architectural implications

**Review Criteria:**

- Code follows project conventions and TypeScript best practices
- No security vulnerabilities introduced
- Test coverage meets minimum thresholds
- Documentation is updated appropriately
- Performance impact is minimal or positive

Provide a detailed review report with specific recommendations and approval status.
