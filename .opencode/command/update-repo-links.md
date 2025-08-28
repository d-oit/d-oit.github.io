---
description: Automatically detect git remote repository and update all placeholder links in documentation
agent: common/agent-orchestrator
---

Update all repository links in the project to match the current git remote.

**Current Git Remote:**
!`git remote -v`

**Repository Links to Update:**
This command will automatically:
1. Detect the current git remote repository URL
2. Identify the git platform (GitHub, Codeberg, GitLab, Bitbucket)
3. Update all placeholder links in markdown files
4. Support common placeholder patterns like:
   - `test-org/test-repo`
   - `your-org/do-opencode-template`
   - `your-organization/your-project-name`

**Files that will be updated:**
- README.md
- All other .md files in the project root
- Domain-specific documentation

**Supported Git Platforms:**
- GitHub (`github.com`)
- Codeberg (`codeberg.org`) 
- GitLab (`gitlab.com`)
- Bitbucket (`bitbucket.org`)

**Command Usage:**
```bash
# Run the enhanced link updater
node .opencode/tests/enhanced-link-updater.js

# Or use the OpenCode test runner
./.opencode/tests/test-runner --update-links
```

The system will automatically detect your repository and update all links accordingly.
