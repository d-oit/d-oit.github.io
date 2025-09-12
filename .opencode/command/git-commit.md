---
description: Create conventional commits with intelligent change analysis and safety validations
agent: general/git-commit-specialist
---

Create a conventional commit for: $ARGUMENTS

**Current Git Status:**
!`git status --porcelain`

**Recent Commits:**
!`git log --oneline -5`

**Available Commit Types:**

- `feat`: New feature or functionality
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring without functionality changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates, etc.
- `perf`: Performance improvements
- `ci`: CI/CD pipeline changes
- `build`: Build system or tooling changes
- `revert`: Reverting previous commits

**Usage Examples:**

```bash
# Interactive commit creation
/git-commit create

# Feature commit with scope
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

**Safety Features:**

- ✅ File organization validation
- ✅ Sensitive data detection
- ✅ Branch context validation
- ✅ Pre-commit hook integration
- ✅ Conventional commit format enforcement

**Integration:**

- Works with existing git hooks and CI/CD pipelines
- Respects domain-driven file organization
- Integrates with code-reviewer and validation-specialist agents
- Supports multi-step commit processes

Please analyze the current changes and create an appropriate conventional commit following these steps:

1. **Change Analysis**: Analyze staged and unstaged changes
2. **Type Suggestion**: Suggest appropriate commit type based on changes
3. **Scope Detection**: Identify affected domain or component
4. **Safety Validation**: Check for file organization and sensitive data
5. **Commit Creation**: Generate conventional commit message
6. **Hook Integration**: Ensure compatibility with pre-commit hooks

**Validation Results:**
!`git diff --cached --name-only | head -10`

**Domain Structure Check:**
!`find src -name "*.tsx" -o -name "*.ts" -o -name "*.js" | grep -v node_modules | head -10`

Provide a complete commit solution with change analysis, safety validation, and conventional commit message generation.
