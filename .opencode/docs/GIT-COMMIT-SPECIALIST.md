# Git Commit Specialist Agent

The Git Commit Specialist is a specialized OpenCode agent designed to manage git commits with conventional commit standards, safety validations, and seamless integration with the OpenCode framework.

## Overview

This agent provides intelligent git commit management with the following key features:

- **Conventional Commit Generation**: Automatically generates properly formatted commit messages
- **Change Analysis**: Analyzes code changes to suggest appropriate commit types and scopes
- **Safety Validations**: Prevents commits with sensitive data or file organization violations
- **Integration**: Works seamlessly with existing git hooks and CI/CD workflows
- **Interactive Mode**: Provides user-friendly commit creation with suggestions and previews

## Features

### Core Functionality

#### 1. Conventional Commit Standards

The agent enforces and generates commits following the conventional commit specification:

```bash
# Examples of conventional commit format:
git commit -m "feat(auth): add user login functionality"
git commit -m "fix(ui): resolve button styling issue"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(api): simplify user service methods"
git commit -m "test(auth): add unit tests for login component"
git commit -m "chore: update dependencies"
```

#### 2. Intelligent Change Analysis

- **Automatic Type Detection**: Analyzes changed files to suggest commit types
- **Scope Extraction**: Identifies the affected domain or component from file paths
- **Breaking Change Detection**: Recognizes potentially breaking changes
- **Confidence Scoring**: Provides confidence levels for suggestions

#### 3. Safety & Validation

- **File Organization**: Validates files follow domain-driven structure
- **Sensitive Data Detection**: Prevents commits containing API keys, passwords, tokens, etc.
- **Branch Context**: Ensures commits are made in appropriate branches
- **Pre-commit Integration**: Works with existing git hooks and validations

#### 4. User Experience

- **Interactive Mode**: Step-by-step commit creation with suggestions
- **Dry-run Mode**: Preview commits before execution
- **Clear Feedback**: Provides detailed explanations and next steps
- **Error Recovery**: Offers actionable solutions for validation failures

## Usage

### Command Line Interface

```bash
# Interactive commit creation
/git-commit create

# Direct commit with type and scope
/git-commit feat auth "add user login functionality"

# Bug fix commit
/git-commit fix ui "resolve button styling issue"

# Documentation update
/git-commit docs "update README with setup instructions"

# Refactoring with breaking changes
/git-commit refactor api "simplify user service methods" --breaking

# Dry run to preview
/git-commit --dry-run feat auth "add login feature"
```

### Integration with Other Agents

#### With Code Reviewer

```yaml
commit_review_workflow:
  1. git-commit-specialist: Analyze changes and prepare commit
  2. code-reviewer: Review code changes for quality
  3. git-commit-specialist: Create commit with review feedback
  4. validation-specialist: Validate commit against standards
```

#### With Agent Orchestrator

```yaml
complex_commit_workflow:
  1. agent-orchestrator: Coordinate multi-step process
  2. git-commit-specialist: Handle git operations
  3. code-architect: Review architectural changes
  4. test-engineer: Ensure test coverage
  5. git-commit-specialist: Create final commit
```

## Configuration

### Agent Configuration

The agent is configured in `.opencode/agent/general/git-commit-specialist.md`:

```yaml
---
description: Git commit management specialist for conventional commits and repository operations
tools:
  write: false
  edit: false
  read: true
  bash: true
  glob: true
  grep: true
mode: subagent
---
```

### Permission Configuration

Required permissions in `opencode.json`:

```json
{
  "permission": {
    "bash": {
      "git status": "allow",
      "git diff": "allow",
      "git log": "allow",
      "git add": "allow",
      "git commit": "allow",
      "git reset": "allow",
      "git checkout": "allow",
      "git branch": "allow",
      "git stash": "allow",
      "git clean": "allow",
      "git show": "allow",
      "git rev-parse": "allow",
      "git ls-files": "allow",
      "git diff-tree": "allow"
    }
  }
}
```

### Git Hook Integration

The agent integrates with existing git hooks:

- **commit-msg**: Validates conventional commit message format
- **pre-commit**: Enforces file organization and runs validations

## Safety Features

### File Organization Validation

Ensures all files follow the domain-driven structure:

```yaml
valid_patterns:
  - src/domains/{domain}/components/
  - src/domains/{domain}/hooks/
  - src/domains/{domain}/services/
  - src/domains/{domain}/types/
  - src/domains/{domain}/utils/
  - src/domains/{domain}/__tests__/
  - src/domains/shared/
  - src/core/config/
  - src/core/types/
  - src/core/utils/
```

### Sensitive Data Detection

Detects and prevents commits containing:

```yaml
sensitive_patterns:
  - API keys and tokens: "(api[_-]?key|token|secret)"
  - Passwords: "(password|pwd|passwd)"
  - Private keys: "(-----BEGIN.*PRIVATE KEY-----)"
  - Environment variables: "(\.env|config.*secret)"
  - Personal data: "(email|phone|ssn|social.*security)"
```

### Branch Context Validation

Prevents inappropriate commits:

```yaml
branch_rules:
  main_protection: 'main|master branches require review'
  feature_branches: 'feature/* branches for new features'
  bugfix_branches: 'bugfix/*|hotfix/* branches for fixes'
  release_branches: 'release/* branches for releases'
```

## Workflow Examples

### Feature Development Workflow

```bash
# 1. Make changes to authentication feature
# Edit files in src/domains/auth/

# 2. Stage changes
git add src/domains/auth/

# 3. Create conventional commit
/git-commit feat auth "add user login functionality"

# 4. The agent will:
#    - Analyze staged files
#    - Suggest commit type (feat) and scope (auth)
#    - Validate file organization
#    - Check for sensitive data
#    - Generate commit message
#    - Create the commit
```

### Bug Fix Workflow

```bash
# 1. Identify and fix the bug
# Edit files in src/domains/ui/

# 2. Stage the fix
git add src/domains/ui/components/Button.tsx

# 3. Create fix commit
/git-commit fix ui "resolve button styling issue"

# 4. Agent validates and creates commit
```

### Refactoring Workflow

```bash
# 1. Refactor API services
# Edit files in src/domains/api/

# 2. Stage changes
git add src/domains/api/

# 3. Create refactor commit
/git-commit refactor api "simplify user service methods"

# 4. For breaking changes:
/git-commit refactor api "simplify user service methods" --breaking
```

## Error Handling

### Common Error Scenarios

#### File Organization Violation

```bash
❌ File organization violation detected
📁 Problem file: src/NewComponent.tsx
💡 Solution: Move to src/domains/{domain}/components/
```

#### Sensitive Data Detected

```bash
🚨 Sensitive data detected in commit
📄 File: config/database.js
🔍 Pattern: API_KEY found
💡 Action: Remove sensitive data or add to .gitignore
```

#### Invalid Commit Message

```bash
❌ Invalid commit message format
📋 Required format: type(scope): description
🔧 Examples:
   feat(auth): add user login functionality
   fix(ui): resolve button styling issue
```

### Recovery Actions

The agent provides actionable recovery suggestions:

1. **File Organization**: Suggests correct file locations
2. **Sensitive Data**: Identifies specific patterns and locations
3. **Commit Format**: Provides examples and format requirements
4. **Branch Issues**: Suggests appropriate branch workflows

## Testing

### Test Suite

The agent includes comprehensive tests in `.opencode/tests/git-commit-specialist-test.js`:

```bash
# Run the test suite
node .opencode/tests/git-commit-specialist-test.js

# Run all framework tests
npm run test:framework:all
```

### Test Coverage

- ✅ Agent configuration validation
- ✅ Conventional commit format validation
- ✅ File organization validation
- ✅ Sensitive data detection
- ✅ Git command permissions
- ✅ Hook integration
- ✅ Change analysis simulation
- ✅ Error handling scenarios

## Integration Points

### With Existing Agents

#### Code Reviewer Integration

- Reviews code changes before commit creation
- Provides feedback for commit message improvement
- Validates code quality standards

#### Validation Specialist Integration

- Runs comprehensive validations
- Checks against project-specific rules
- Ensures compliance with coding standards

#### Agent Orchestrator Integration

- Coordinates complex multi-step processes
- Manages dependencies between agents
- Handles workflow orchestration

### CI/CD Integration

The agent integrates with existing CI/CD workflows:

```yaml
# Example GitHub Actions integration
- name: Conventional Commit Validation
  run: node .opencode/tests/git-commit-specialist-test.js

- name: File Organization Check
  run: npm run validate:structure

- name: Pre-commit Hooks
  run: npx husky run pre-commit
```

## Best Practices

### Commit Message Guidelines

1. **Use Conventional Format**: Always follow `type(scope): description`
2. **Be Descriptive**: Provide clear, meaningful descriptions
3. **Use Appropriate Types**: Choose the most specific commit type
4. **Include Scope**: Specify the affected domain or component
5. **Mark Breaking Changes**: Use `!` for breaking changes

### File Organization

1. **Follow Domain Structure**: Keep related files in domain folders
2. **Use Shared Wisely**: Only truly shared code in `shared/`
3. **Organize by Responsibility**: Group by business domains, not technical concerns
4. **Test Co-location**: Keep tests close to the code they test

### Security Considerations

1. **Never Commit Secrets**: Use environment variables and .env files
2. **Review Before Commit**: Always review changes before committing
3. **Use .gitignore**: Exclude sensitive files from version control
4. **Branch Protection**: Use protected branches for critical changes

## Troubleshooting

### Common Issues

#### "No staged files found"

```bash
# Solution: Stage your changes first
git add .
# or
git add specific-file.js
```

#### "File organization violation"

```bash
# Solution: Move file to correct location
mv src/NewComponent.tsx src/domains/auth/components/
```

#### "Sensitive data detected"

```bash
# Solution: Remove sensitive data
git rm --cached config/secrets.js
echo "config/secrets.js" >> .gitignore
```

#### "Invalid commit message format"

```bash
# Solution: Use conventional format
git commit -m "feat(auth): add user login functionality"
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Run with verbose output
DEBUG=git-commit-specialist /git-commit create
```

## Contributing

To contribute to the Git Commit Specialist agent:

1. **Follow the Agent Creation Framework**: Use the established patterns and standards
2. **Add Comprehensive Tests**: Include tests for new functionality
3. **Update Documentation**: Keep docs current with changes
4. **Follow Conventional Commits**: Use the agent for your own commits

## Future Enhancements

### Planned Features

- **AI-Powered Suggestions**: Use AI to generate better commit messages
- **Interactive Diff Viewer**: Visual diff analysis for better understanding
- **Commit Templates**: Customizable commit message templates
- **Bulk Operations**: Handle multiple commits in batch
- **Integration Analytics**: Track commit patterns and improvements

### Community Contributions

The agent is designed to be extensible. Consider contributing:

- New commit types for specific domains
- Additional safety validations
- Integration with more CI/CD platforms
- Support for different git workflows
- Localization and internationalization

---

_This agent follows OpenCode framework standards and integrates seamlessly with the existing agent ecosystem._
