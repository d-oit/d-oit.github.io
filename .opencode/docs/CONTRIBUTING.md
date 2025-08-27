# Contributing to OpenCode Template

Thank you for your interest in contributing to the OpenCode Template! This document provides guidelines and information for contributors.

## 🚀 Quick Start

### 1. Development Setup

```bash
# Fork and clone the repository
git clone https://codeberg.org/your-username/do-opencode-template.git
cd do-opencode-template

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 2. Run Tests

```bash
# Run all framework tests
./.opencode/tests/test-runner --auto

# Run project tests
pnpm test

# Run specific test categories
./.opencode/tests/test-runner --plugins
./.opencode/tests/test-runner --validation
```

## 📋 Contribution Guidelines

### ✅ What We Look For

- **Code Quality**: Clean, well-tested, documented code
- **Test Coverage**: Minimum 80% coverage for new features
- **Documentation**: Update docs for any new features
- **Conventional Commits**: Use standard commit message format
- **Domain Structure**: Follow the domain-driven architecture

### 🎯 Types of Contributions

- **🐛 Bug Fixes**: Fix issues and improve stability
- **✨ New Features**: Add new agents, commands, or plugins
- **📚 Documentation**: Improve docs, examples, tutorials
- **🧪 Testing**: Add tests or improve test coverage
- **🔧 Tooling**: Improve build process, CI/CD, automation

## 🛠️ Development Workflow

### 1. Create Feature Branch
```bash
git checkout -b feature/your-awesome-feature
```

### 2. Make Changes
- Follow domain structure: `src/domains/{feature}/`
- Add tests for new functionality
- Update documentation

### 3. Run Quality Checks
```bash
# Framework tests
./.opencode/tests/test-runner --auto

# Project tests
pnpm test

# AI code review
@common/code-reviewer "Review my changes"
```

### 4. Commit with Conventional Format
```bash
/git-commit "feat: add awesome new feature"
```

### 5. Create Pull Request
- Clear description of changes
- Reference any related issues
- Include test results

## 🎨 Creating New Agents

```bash
# Use the agent creator tool
/create-agent your-specialized-agent

# The tool will guide you through:
# - Agent naming and categorization
# - Capability definition
# - Integration setup
# - Documentation generation
```

## 🔌 Creating New Plugins

Plugins extend framework functionality:
- Use templates in `.opencode/plugin/`
- Include error handling and validation
- Test across multiple technologies

## 📚 Documentation Contributions

- **Fix typos** and improve clarity
- **Add examples** and use cases
- **Update guides** for new features
- **Translate** documentation
- **Fix broken links** and references

## 🧪 Quality Requirements

All contributions must pass:

- ✅ **Framework Tests**: `./.opencode/tests/test-runner --auto`
- ✅ **Code Quality**: ESLint, Prettier, TypeScript checks
- ✅ **Security Scan**: Automated vulnerability detection
- ✅ **Test Coverage**: Minimum 80% for new code
- ✅ **Link Validation**: All documentation links working

## 🎉 Recognition

Contributors get:
- **Release Credits**: Name in release notes
- **Community Spotlight**: Featured in community updates
- **Collaborator Status**: Invitation for significant contributions
- **Swag**: OpenCode stickers and merchandise

## 💬 Community

- **Be respectful** and constructive
- **Help others** learn and contribute
- **Share knowledge** and best practices
- **Report issues** with clear reproduction steps

## 📞 Support

- **Issues**: [Report bugs or request features](https://codeberg.org/d-oit/do-opencode-template/issues)
- **Forum**: [Community discussions](https://opencode.ai/community)
- **Discord**: [Real-time chat](https://opencode.ai/discord)

---

**Ready to contribute?** Follow the steps above and submit your pull request. 🎉
