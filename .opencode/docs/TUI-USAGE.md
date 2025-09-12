# OpenCode TUI Usage Guide

## Getting Started with TUI

Start OpenCode TUI in your project directory:

```bash
# Start in current directory
opencode

# Start in specific directory
opencode /path/to/project
```

## Essential Commands

### Session Management

```bash
# Start fresh session (in OpenCode TUI)
# Use Ctrl+X N or type: /new

# List/switch sessions (in OpenCode TUI)
# Use Ctrl+X L or type: /sessions

# Summarize conversation (in OpenCode TUI)
# Use Ctrl+X C or type: /compact

# Export to Markdown (in OpenCode TUI)
# Use Ctrl+X X or type: /export

# Share session (in OpenCode TUI)
# Use Ctrl+X S or type: /share
```

### Development Workflow

```bash
# Create/update AGENTS.md (in OpenCode TUI)
# Use Ctrl+X I or type: /init

# Open external editor (in OpenCode TUI)
# Use Ctrl+X E or type: /editor

# Toggle tool execution details (in OpenCode TUI)
# Use Ctrl+X D or type: /details

# List available models (in OpenCode TUI)
# Use Ctrl+X M or type: /models
```

### Navigation & Help

```bash
# Show help dialog (in OpenCode TUI)
# Use Ctrl+X H or type: /help

# List available themes (in OpenCode TUI)
# Use Ctrl+X T or type: /themes

# Undo last message (in OpenCode TUI)
# Use Ctrl+X U or type: /undo

# Redo message (in OpenCode TUI)
# Use Ctrl+X R or type: /redo

# Exit OpenCode (in OpenCode TUI)
# Use Ctrl+X Q or type: /exit
```

## Shell Commands

Use `!` prefix to run shell commands with output included in conversation (in OpenCode TUI):

```bash
# List files (in OpenCode TUI)
# Type: !ls -la

# Check git status (in OpenCode TUI)
# Type: !git status

# Run tests (in OpenCode TUI)
# Type: !npm test

# Find TypeScript files (in OpenCode TUI)
# Type: !find . -name "*.ts"
```

## Agent Interaction Patterns

### Direct Agent Usage

```bash
# Single agent tasks (in OpenCode TUI)
@code-reviewer analyze the authentication module
@security-auditor scan for vulnerabilities in /src/auth
@performance-optimizer profile the user service API
@test-engineer create tests for the payment processor
```

### Multi-Agent Workflows

```bash
# Complex coordinated tasks (in OpenCode TUI)
@orchestrator implement complete user management system with auth, validation, and tests
@orchestrator optimize application for production deployment with monitoring
@orchestrator prepare release v2.0 with full testing, docs, and deployment
```

### Command-Based Workflows

```bash
# Use custom commands for common patterns (in OpenCode TUI)
# Type: /analyze-code --scope=src/auth --focus=security
# Type: /implement-feature "two-factor authentication with SMS"
# Type: /review-pr --detailed --security-check
# Type: /deploy-staging --validate --run-tests

# Framework testing (works with any project type)
./.opencode/tests/test-runner --auto
./.opencode/tests/test-runner --docker
```

## Best Practices for TUI Usage

### Effective Prompting

```bash
# ✅ Good: Specific and contextual (in OpenCode TUI)
"Analyze the user authentication flow in src/auth/login.ts and suggest security improvements"

# ❌ Poor: Vague and unclear (in OpenCode TUI)
"Make the code better"
```

### Context Management

```bash
# Use /compact when conversations get long (in OpenCode TUI)
# Type: /compact

# Use /init to refresh project context (in OpenCode TUI)
# Type: /init

# Export important discussions (in OpenCode TUI)
# Type: /export
```

### Error Recovery

```bash
# Undo mistakes immediately (in OpenCode TUI)
# Type: /undo

# Start fresh when confused (in OpenCode TUI)
# Type: /new

# Check tool execution details (in OpenCode TUI)
# Type: /details
```

## Keyboard Shortcuts (Ctrl+X Leader)

| Shortcut | Command   | Description              |
| -------- | --------- | ------------------------ |
| Ctrl+X N | /new      | New session              |
| Ctrl+X L | /sessions | List sessions            |
| Ctrl+X C | /compact  | Compact conversation     |
| Ctrl+X E | /editor   | External editor          |
| Ctrl+X X | /export   | Export to markdown       |
| Ctrl+X S | /share    | Share session            |
| Ctrl+X I | /init     | Update AGENTS.md         |
| Ctrl+X H | /help     | Show help                |
| Ctrl+X Q | /exit     | Exit OpenCode            |
| Ctrl+X U | /undo     | Undo last message        |
| Ctrl+X R | /redo     | Redo message             |
| Ctrl+X D | /details  | Toggle execution details |
| Ctrl+X M | /models   | List models              |
| Ctrl+X T | /themes   | List themes              |

## Advanced Usage

### Editor Integration

Set your preferred editor:

```bash
# For command-line editors
export EDITOR=vim
export EDITOR=nano

# For GUI editors (include --wait)
export EDITOR="code --wait"
export EDITOR="cursor --wait"
export EDITOR="windsurf --wait"
```

### Automation & Scripting

Use non-interactive mode for scripts:

```bash
# Single command execution
opencode run "Analyze code quality in src/ directory"

# Continue previous session
opencode run --continue "Now run the tests"

# Use specific model
opencode run --model anthropic/claude-sonnet-4 "Review security"
```

### Session Management

```bash
# Share session publicly (in OpenCode TUI)
# Type: /share

# Continue specific session
opencode --session abc123

# Work with shared session
opencode run --session abc123 "Add error handling"
```

## Troubleshooting

### Common Issues

- **Agent not responding**: Check `opencode.json` configuration
- **Permission denied**: Review permission settings in config
- **Commands not found**: Ensure commands are in `.opencode/command/`
- **Context lost**: Use `/init` to refresh project context (in OpenCode TUI)

### Performance Tips

- Use `/compact` to reduce context size (in OpenCode TUI)
- Restart sessions when they become unwieldy
- Use specific agents for focused tasks
- Monitor tool execution with `/details` (in OpenCode TUI)

---

**Note**: This guide is specifically for OpenCode TUI (Terminal User Interface) usage. Commands marked as "(in OpenCode TUI)" only work within the interactive OpenCode session. For bash/terminal commands, see the troubleshooting guide.
