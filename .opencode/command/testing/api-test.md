---
description: Comprehensive API endpoint testing using Playwright with swagger validation
agent: testing
---

# API Test Command

Execute comprehensive API endpoint testing based on swagger documentation and custom test suites.

**Usage:**
/api-test [--env ENV] [--coverage] [--verbose] [--headed]

**Options:**
- `--env`: Environment to test against (default: development)
- `--coverage`: Generate coverage report for API tests
- `--verbose`: Enable verbose output
- `--headed`: Run tests in headed mode for debugging

**Examples:**
- `/api-test` - Run API tests with default settings
- `/api-test --env production` - Run tests against production environment
- `/api-test --coverage --verbose` - Run tests with coverage and verbose output
- `/api-test --headed` - Run tests in headed mode

**Implementation:**
!export NODE_ENV=$ENV && export REPORTER=$([ "$VERBOSE" = "true" ] && echo "line" || echo "html") && npx playwright test tests/api/ --reporter=$REPORTER --headed=$HEADED --workers=1

**Files:**
@adminEditor/docs/swagger.json
@adminEditor/docs/swagger.yaml
@playwright.config.js
@tests/
