---
description: Execute comprehensive test suite with coverage validation and quality assurance
agent: common/test-engineer

---

Run comprehensive test suite with $ARGUMENTS focus.

**Test Files Found:**
!`find . -name "*.test.*" -o -name "*.spec.*" | wc -l` test files

**Test Configuration:**
!`cat vitest.config.ts 2>/dev/null | grep -E "(coverage|test)" | head -5 || echo "No test config found"`

**Current Test Status:**
!`npm run test -- --run --coverage --coverageReporters=text-summary 2>/dev/null | tail -10 || echo "Tests not configured"`

Please execute comprehensive testing with the following approach:

1. **Test Preparation**: Set up test environment and validate configuration
2. **Test Execution**: Run unit, integration, and end-to-end tests
3. **Coverage Analysis**: Generate and validate test coverage reports
4. **Quality Validation**: Detect flaky tests and false positives

**Test Types to Execute:**

- **Unit Tests**: Component testing, mock integration, edge cases
- **Integration Tests**: API testing, database integration, service communication
- **End-to-End Tests**: User journey validation, cross-browser testing

**Coverage Standards:**

- **Unit Tests**: 80%+ overall coverage
- **Integration Tests**: 70%+ API and service coverage
- **End-to-End Tests**: 60%+ critical user journey coverage
- **Overall Coverage**: 75%+ combined coverage

**Quality Metrics:**

- Test execution performance and reliability
- Flaky test detection and analysis
- False positive identification
- Test code quality assessment

**Coverage Metrics:**

- Line coverage percentage
- Branch coverage percentage
- Function coverage percentage
- Statement coverage percentage

Provide comprehensive test results, coverage analysis, and recommendations for improvement.
