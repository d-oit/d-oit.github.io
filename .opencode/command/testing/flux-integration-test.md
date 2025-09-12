---
description: Run integration tests for FLUX API with comprehensive error handling scenarios
agent: testing
---

# FLUX Integration Test Command

Execute integration tests specifically designed for FLUX API functionality, including authentication, data retrieval, error handling, and edge cases.

**Usage:**
/flux-integration-test [--env ENV] [--verbose] [--coverage] [--fail-fast]

**Options:**
- `--env`: Environment to run tests against (staging, production) (default: staging)
- `--verbose`: Enable detailed test output and logging
- `--coverage`: Generate test coverage report for API endpoints
- `--fail-fast`: Stop tests on first failure for quick feedback

**Examples:**
- `/flux-integration-test` - Run FLUX integration tests with default settings
- `/flux-integration-test --env production --verbose` - Run tests against production with verbose output
- `/flux-integration-test --coverage --fail-fast` - Generate coverage report and stop on first failure

**Implementation:**
!npm run test:flux -- --env=$ENV --verbose=$VERBOSE --coverage=$COVERAGE --fail-fast=$FAIL_FAST

**Files:**
@playwright.config.js
@tests/flux-integration.spec.js
@package.json
@config/_default/params.toml