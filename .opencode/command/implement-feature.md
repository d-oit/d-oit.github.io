---
description: Implement new features with comprehensive testing, documentation, and quality assurance
agent: common/agent-orchestrator

---

Implement the feature: $ARGUMENTS

**Current Project Status:**
!`git status --porcelain`

**Existing Code Structure:**
!`find src -type f -name "*.ts" -o -name "*.tsx" | wc -l` TypeScript files found

**Test Coverage:**
!`npm run test -- --coverage --coverageReporters=text-summary | grep -E "(All files|Lines)"`

Please implement this feature following these requirements:

1. **Analysis & Design**: Analyze requirements and design the solution architecture
2. **Implementation**: Write clean, well-tested code with proper TypeScript types
3. **Testing**: Create comprehensive unit and integration tests (aim for 80%+ coverage)
4. **Security**: Implement proper input validation and security measures
5. **Documentation**: Update README and add code documentation
6. **Code Review**: Ensure code follows best practices and passes all quality checks

**Quality Gates:**

- ESLint: Zero warnings
- TypeScript: Strict mode compliance
- Tests: 80%+ coverage
- Security: Input validation and sanitization
- Documentation: Updated and accurate

Provide a complete implementation with all necessary files, tests, and documentation.
