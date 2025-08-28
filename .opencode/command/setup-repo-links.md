---
description: Set up repository links automatically by detecting git remote and updating all documentation links
agent: common/agent-orchestrator
---

Set up repository links for the current project.

**Current Git Configuration:**
!`git remote -v`

**Repository Detection:**
This command will:
1. Detect the current git remote repository URL
2. Identify the git platform (GitHub, Codeberg, GitLab, Bitbucket)
3. Update all placeholder links in documentation files
4. Support common placeholder patterns used in templates

**Supported Git Platforms:**
- GitHub (`github.com`)
- Codeberg (`codeberg.org`) 
- GitLab (`gitlab.com`)
- Bitbucket (`bitbucket.org`)

**Files that will be updated:**
- README.md
- All other .md files in the project root
- Domain-specific documentation
- Any files containing placeholder repository links

**Placeholder Patterns Detected:**
- `test-org/test-repo`
- `your-org/do-opencode-template`
- `your-organization/your-project-name`
- `your-username/your-repository`

**Usage:**
```bash
# Run repository link setup
node .opencode/tests/enhanced-link-updater.js

# Or use the test runner
./.opencode/tests/test-runner --update-links

# Or use the OpenCode command system
/opencode setup-repo-links
```

The system will automatically detect your repository and update all links accordingly. This is especially useful when:
- Setting up a new project from a template
- Changing the repository remote
- Moving from one git platform to another
