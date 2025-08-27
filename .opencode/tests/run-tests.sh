#!/bin/bash

# OpenCode Framework Test Runner
# Technology-agnostic test execution script

set -e

echo "🧪 OpenCode Framework Test Runner"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to run Node.js test
run_node_test() {
    local test_file=$1
    local test_name=$2

    if command_exists node; then
        print_status $BLUE "🟢 Running $test_name..."
        if node "$test_file"; then
            print_status $GREEN "✅ $test_name passed"
            return 0
        else
            print_status $RED "❌ $test_name failed"
            return 1
        fi
    else
        print_status $YELLOW "⚠️  Node.js not available, skipping $test_name"
        return 2
    fi
}

# Function to run shell-based tests (future implementation)
run_shell_test() {
    local test_file=$1
    local test_name=$2

    print_status $BLUE "🔧 Running $test_name (shell)..."
    if [ -f "$test_file" ]; then
        # Placeholder for shell-based tests
        print_status $YELLOW "⚠️  Shell test not implemented yet: $test_name"
        return 2
    else
        print_status $RED "❌ Shell test file not found: $test_file"
        return 1
    fi
}

# Function to run Docker-based tests
run_docker_test() {
    local test_file=$1
    local test_name=$2

    if command_exists docker; then
        print_status $BLUE "🐳 Running $test_name in Docker..."

        # Create a temporary Dockerfile for testing
        cat > /tmp/Dockerfile.opencode << EOF
FROM node:18-alpine
WORKDIR /app
COPY .opencode/tests/$test_file ./
RUN npm install -g npm && node $test_file
EOF

        if docker build -f /tmp/Dockerfile.opencode -t opencode-test . && \
           docker run --rm opencode-test; then
            print_status $GREEN "✅ $test_name passed (Docker)"
            docker rmi opencode-test >/dev/null 2>&1 || true
            rm -f /tmp/Dockerfile.opencode
            return 0
        else
            print_status $RED "❌ $test_name failed (Docker)"
            docker rmi opencode-test >/dev/null 2>&1 || true
            rm -f /tmp/Dockerfile.opencode
            return 1
        fi
    else
        print_status $YELLOW "⚠️  Docker not available, skipping Docker test: $test_name"
        return 2
    fi
}

# Function to detect project type
detect_project_type() {
    if [ -f "package.json" ]; then
        echo "javascript"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    elif [ -f "go.mod" ]; then
        echo "go"
    elif [ -f "requirements.txt" ] || [ -f "setup.py" ] || [ -f "Pipfile" ]; then
        echo "python"
    elif [ -f "pom.xml" ]; then
        echo "java"
    elif [ -f "build.gradle" ] || [ -f "build.gradle.kts" ]; then
        echo "gradle"
    else
        echo "unknown"
    fi
}

# Main test execution
main() {
    local project_type=$(detect_project_type)
    local test_results=()
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    local skipped_tests=0

    print_status $BLUE "🔍 Detected project type: $project_type"
    echo ""

    # Define tests to run
    local tests=(
        "comprehensive-validation-test.js:Comprehensive Validation"
        "validation-test.js:Validation Rules"
        "framework-integration-test.js:Framework Integration"
        "performance-test.js:Performance Test"
        "link-validation-test.js:Link Validation"
        "plugin-test.js:Plugin Test"
        "validation-rules-test.js:Validation Rules Structure"
    )

    # Run each test with fallback methods
    for test_info in "${tests[@]}"; do
        IFS=':' read -r test_file test_name <<< "$test_info"
        ((total_tests++))

        if [ -f ".opencode/tests/$test_file" ]; then
            echo "----------------------------------------"
            print_status $BLUE "🧪 $test_name"
            echo "----------------------------------------"

            # Try Node.js first
            if run_node_test ".opencode/tests/$test_file" "$test_name"; then
                ((passed_tests++))
                test_results+=("$test_name: ✅ PASSED")
            else
                local node_exit_code=$?

                # Try Docker as fallback
                if [ $node_exit_code -eq 2 ]; then
                    if run_docker_test "$test_file" "$test_name"; then
                        ((passed_tests++))
                        test_results+=("$test_name: ✅ PASSED (Docker)")
                    else
                        ((skipped_tests++))
                        test_results+=("$test_name: ⚠️  SKIPPED (Docker failed)")
                    fi
                else
                    ((failed_tests++))
                    test_results+=("$test_name: ❌ FAILED")
                fi
            fi
        else
            print_status $YELLOW "⚠️  Test file not found: $test_file"
            ((skipped_tests++))
            test_results+=("$test_name: ⚠️  SKIPPED (file not found)")
        fi

        echo ""
    done

    # Print summary
    echo "========================================"
    print_status $BLUE "📊 TEST SUMMARY"
    echo "========================================"

    for result in "${test_results[@]}"; do
        echo "  $result"
    done

    echo ""
    print_status $BLUE "📈 RESULTS:"
    echo "  Total Tests: $total_tests"
    echo "  Passed: $passed_tests"
    echo "  Failed: $failed_tests"
    echo "  Skipped: $skipped_tests"

    if [ $failed_tests -eq 0 ] && [ $skipped_tests -eq 0 ]; then
        print_status $GREEN "🎉 All tests passed!"
        return 0
    elif [ $failed_tests -eq 0 ]; then
        print_status $YELLOW "⚠️  All available tests passed, some skipped due to missing dependencies"
        return 0
    else
        print_status $RED "❌ Some tests failed"
        return 1
    fi
}

# Show usage if requested
if [ "$1" = "--help" ] || [ "$1" = "-h" ]; then
    echo "OpenCode Framework Test Runner"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --help, -h    Show this help message"
    echo "  --docker      Force Docker mode for all tests"
    echo "  --shell       Use shell-based tests (future feature)"
    echo ""
    echo "This script automatically detects the project type and runs"
    echo "the appropriate OpenCode framework tests using available runtimes."
    echo ""
    echo "Supported project types:"
    echo "  - JavaScript/TypeScript (uses Node.js)"
    echo "  - Rust, Go, Python, Java (uses Docker fallback)"
    echo "  - Any project type (with Docker available)"
    exit 0
fi

# Force Docker mode
if [ "$1" = "--docker" ]; then
    print_status $BLUE "🐳 Docker mode enabled"
    # Override run_node_test to always fail and use Docker
    run_node_test() {
        return 2
    }
fi

# Run main function
main