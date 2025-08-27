---
description: Run Go tests with coverage analysis and generate detailed reports
agent: testing
---

# Go Test Coverage Command

Execute Go tests with coverage profiling to analyze code coverage and identify untested areas. Supports generating HTML reports and function-level coverage details.

**Usage:**
/go-test-coverage [--package PACKAGE] [--output FILE] [--html] [--func]

**Options:**
- `--package`: Specific package path to test (default: ./...)
- `--output`: Output file for coverage profile (default: coverage.out)
- `--html`: Generate HTML coverage report (coverage.html)
- `--func`: Display coverage per function in the terminal

**Examples:**
- `/go-test-coverage` - Run tests with coverage for all packages
- `/go-test-coverage --package ./pkg/utils` - Test specific package with coverage
- `/go-test-coverage --html` - Run tests and generate HTML coverage report
- `/go-test-coverage --func --output mycoverage.out` - Custom output file with function details
- `/go-test-coverage --package ./... --html --func` - Full coverage analysis with both reports

**Implementation:**
!go test -cover -coverprofile=$OUTPUT $PACKAGE
!if [ "$HTML" = "true" ]; then go tool cover -html=$OUTPUT -o coverage.html; fi
!if [ "$FUNC" = "true" ]; then go tool cover -func=$OUTPUT; fi

**Files:**
@go.mod
@go.sum
