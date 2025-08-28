# OpenCode Framework Testing

This directory contains the OpenCode framework's testing suite, designed to work with **any project type** - JavaScript, Python, Go, Rust, Java, C++, etc.

## 🚀 Quick Start

### For JavaScript/TypeScript Projects (with Node.js)

```bash
# Run all framework tests
npm run test:framework:all

# Run specific test categories
npm run test:plugins          # Test plugins
npm run test:validation:rules # Test validation rules
npm run test:links           # Test documentation links
npm run test:performance     # Test performance metrics
```

### For Any Project Type (Universal Runner)

```bash
# Auto-detect best runtime
./.opencode/tests/test-runner --auto

# Force Docker runtime
./.opencode/tests/test-runner --docker

# Basic validation only
./.opencode/tests/test-runner --basic
```

### Using Docker (No Node.js Required)

```bash
# Using docker-compose
docker-compose -f .opencode/tests/docker-compose.yml up

# Using docker directly
docker build -f .opencode/tests/Dockerfile -t opencode-test .
docker run --rm -v "$(pwd)":/app opencode-test
```

## 🧪 Available Tests

| Test File                              | Purpose                    | Technology Agnostic |
| -------------------------------------- | -------------------------- | ------------------- |
| **`comprehensive-validation-test.js`** | Full codebase analysis     | ✅                  |
| **`validation-test.js`**               | Rules structure validation | ✅                  |
| **`framework-integration-test.js`**    | Integration verification   | ✅                  |
| **`performance-test.js`**              | Performance metrics        | ✅                  |
| **`link-validation-test.js`**          | Documentation validation   | ✅                  |
| **`plugin-test.js`**                   | Plugin functionality       | ✅                  |
| **`validation-rules-test.js`**         | Rules compliance           | ✅                  |

## 🎯 Test Execution Methods

### Method 1: Node.js (Fastest)

- **Requirements**: Node.js installed
- **Best for**: JavaScript/TypeScript projects
- **Usage**: `npm run test:framework:all`

### Method 2: Universal Runner (Recommended)

- **Requirements**: Bash shell
- **Auto-detects**: Project type and available runtimes
- **Usage**: `./.opencode/tests/test-runner --auto`

### Method 3: Docker (Most Compatible)

- **Requirements**: Docker installed
- **Works with**: Any project type
- **Usage**: `./.opencode/tests/test-runner --docker`

### Method 4: Basic Validation (Minimal)

- **Requirements**: None (just bash)
- **Validates**: Framework structure only
- **Usage**: `./.opencode/tests/test-runner --basic`

## 📋 Test Categories

### 🔌 Plugin Tests

Tests the OpenCode plugin system:

- Plugin discovery and metadata
- Structure validation
- Functionality testing
- Integration verification
- Performance impact analysis

### 📋 Validation Rules Tests

Tests the validation rule configuration:

- Schema compliance validation
- Threshold escalation verification
- False positive pattern analysis
- Cross-rule consistency checking
- Rule effectiveness testing

### 🔗 Link Validation Tests

Tests documentation quality:

- Placeholder link detection
- Broken internal link detection
- External link validation (optional)
- Documentation completeness checking

### ⚡ Performance Tests

Tests performance metrics:

- Generic bundle size detection
- Build directory auto-discovery
- Performance threshold validation
- Optimization recommendations

### 🔍 Comprehensive Tests

Full framework validation:

- Auto-discovery of source files (any language)
- Language-specific code analysis patterns
- Generic security vulnerability detection
- Performance bundle analysis
- Quality metrics calculation

## 🏗️ Project Type Support

The OpenCode testing framework automatically detects and adapts to:

| Project Type              | Detection                      | Runtime | Notes            |
| ------------------------- | ------------------------------ | ------- | ---------------- |
| **JavaScript/TypeScript** | `package.json`                 | Node.js | Native execution |
| **Python**                | `requirements.txt`, `setup.py` | Docker  | Containerized    |
| **Go**                    | `go.mod`                       | Docker  | Containerized    |
| **Rust**                  | `Cargo.toml`                   | Docker  | Containerized    |
| **Java**                  | `pom.xml`                      | Docker  | Containerized    |
| **Gradle**                | `build.gradle`                 | Docker  | Containerized    |
| **Make**                  | `Makefile`                     | Docker  | Containerized    |
| **Generic**               | Fallback                       | Docker  | Any project type |

## 🐳 Docker Configuration

### Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY .opencode/ .opencode/
RUN apk add --no-cache bash curl
CMD ["bash", ".opencode/tests/run-tests.sh"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  opencode-tests:
    build:
      context: ..
      dockerfile: .opencode/tests/Dockerfile
    volumes:
      - ..:/app
    working_dir: /app
    command: bash .opencode/tests/run-tests.sh
```

## 🔧 Configuration

### Environment Variables

- `ENABLE_EXTERNAL_LINK_CHECK=true` - Enable external link validation
- `NODE_ENV=test` - Set test environment

### Test Configuration

- Tests automatically discover project structure
- No configuration files required
- Works with any directory layout
- Language-agnostic analysis patterns

## 📊 Test Results

All tests provide detailed output including:

- ✅ **Pass/Fail status** for each test
- 📊 **Metrics and statistics** (lines of code, complexity, etc.)
- 🚨 **Security issues detected** with severity levels
- 📋 **Recommendations** for improvements
- 🎯 **Integration scores** and completion metrics

## 🎉 Benefits

### ✅ Technology Agnostic

- Works with **any programming language**
- Compatible with **any build system**
- Supports **any package manager**
- Adapts to **any project structure**

### ✅ Multiple Execution Methods

- **Node.js** for JavaScript projects (fastest)
- **Docker** for any project type (most compatible)
- **Shell scripts** for minimal environments
- **Auto-detection** of best available method

### ✅ Comprehensive Coverage

- **Framework integrity** validation
- **Plugin functionality** testing
- **Validation rules** compliance
- **Documentation quality** assurance
- **Performance monitoring** and optimization

### ✅ CI/CD Ready

- **Automated testing** for continuous integration
- **Containerized execution** for consistent environments
- **Detailed reporting** for quality metrics
- **Fail-fast detection** of issues

## 🚀 Getting Started

1. **Clone any OpenCode template**
2. **Run tests with auto-detection**:
   ```bash
   ./.opencode/tests/test-runner --auto
   ```
3. **Or use Docker for any project**:
   ```bash
   ./.opencode/tests/test-runner --docker
   ```
4. **Review test results and recommendations**

The OpenCode framework testing system ensures **consistent quality** across **any technology stack**! 🌍
