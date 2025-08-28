---
description: Complete Codeberg workflow automation using the Codeberg specialist agent for project setup, issue management, and CI/CD
agent: platforms/codeberg/codeberg-workflow-manager
---

Execute complete Codeberg workflows using the Codeberg specialist agent.

**Available Workflows:**

## 1. Project Setup Workflow

**Initialize a new project on Codeberg:**
```bash
# Create repository
@codeberg-specialist createRepo {
  "name": "my-awesome-project",
  "description": "An awesome project built with OpenCode",
  "private": false,
  "auto_init": true,
  "readme": "Default"
}

# Set up repository topics
@codeberg-specialist updateTopics "username" "my-awesome-project" ["opencode", "javascript", "automation"]

# Configure repository settings
@codeberg-specialist updateRepo "username" "my-awesome-project" {
  "description": "An awesome project built with OpenCode",
  "website": "https://my-awesome-project.codeberg.page",
  "has_issues": true,
  "has_wiki": true,
  "has_pull_requests": true,
  "ignore_whitespace_conflicts": true,
  "allow_merge_commits": true,
  "allow_rebase": true,
  "allow_rebase_explicit": true,
  "allow_squash_merge": true,
  "default_merge_style": "merge"
}
```

## 2. Issue Management Workflow

**Set up project issues and milestones:**
```bash
# Create initial issues
@codeberg-specialist createIssue "username" "my-awesome-project" {
  "title": "Set up CI/CD pipeline",
  "body": "Configure Woodpecker CI for automated testing and deployment",
  "labels": ["enhancement", "ci-cd"]
}

@codeberg-specialist createIssue "username" "my-awesome-project" {
  "title": "Implement user authentication",
  "body": "Add user registration and login functionality",
  "labels": ["feature", "authentication"]
}

@codeberg-specialist createIssue "username" "my-awesome-project" {
  "title": "Create project documentation",
  "body": "Write comprehensive README and API documentation",
  "labels": ["documentation"]
}
```

**Manage issue workflow:**
```bash
# Update issue status
@codeberg-specialist updateIssue "username" "my-awesome-project" 1 {
  "state": "closed",
  "assignees": ["username"]
}

# Add comments to issues
@codeberg-specialist createComment "username" "my-awesome-project" 2 "Working on authentication module implementation"
```

## 3. Pull Request Workflow

**Create and manage pull requests:**
```bash
# Create pull request
@codeberg-specialist createPullRequest "username" "my-awesome-project" {
  "title": "feat: Add user authentication system",
  "body": "Implements user registration and login functionality\n\n- Added user model\n- Created authentication service\n- Added login/register forms\n- Integrated with backend API\n\nCloses #2",
  "head": "feature/auth",
  "base": "main"
}

# Review and merge
@codeberg-specialist mergePullRequest "username" "my-awesome-project" 1 {
  "merge_method": "squash",
  "title": "feat: Add user authentication system",
  "message": "Implements user registration and login functionality\n\n- Added user model\n- Created authentication service\n- Added login/register forms\n- Integrated with backend API\n\nCloses #2"
}
```

## 4. CI/CD Setup Workflow

**Configure webhooks for CI/CD:**
```bash
# Set up webhook for Woodpecker CI
@codeberg-specialist createWebhook "username" "my-awesome-project" {
  "type": "forgejo",
  "config": {
    "url": "https://ci.codeberg.org/hooks",
    "content_type": "json"
  },
  "events": ["push", "pull_requests"],
  "active": true
}

# Set up webhook for external CI
@codeberg-specialist createWebhook "username" "my-awesome-project" {
  "type": "forgejo",
  "config": {
    "url": "https://github.com/username/my-awesome-project/actions/workflows/ci.yml",
    "content_type": "json"
  },
  "events": ["push", "pull_requests", "issues"],
  "active": true
}
```

## 5. Release Management Workflow

**Create and manage releases:**
```bash
# Create release
@codeberg-specialist createRelease "username" "my-awesome-project" {
  "tag_name": "v1.0.0",
  "target_commitish": "main",
  "name": "Version 1.0.0",
  "body": "# Release Notes\n\n## Features\n- User authentication system\n- CI/CD pipeline\n- Project documentation\n\n## Bug Fixes\n- Fixed login validation\n- Resolved build issues\n\n## Breaking Changes\n- None",
  "draft": false,
  "prerelease": false
}

# Update release
@codeberg-specialist updateRelease "username" "my-awesome-project" 1 {
  "name": "Version 1.0.1",
  "body": "# Release Notes\n\n## Bug Fixes\n- Fixed authentication bug\n- Updated dependencies",
  "draft": false
}
```

## 6. Team Collaboration Workflow

**Set up organization and teams:**
```bash
# List user organizations
@codeberg-specialist listOrgs

# Create organization repository
@codeberg-specialist createOrgRepo "my-organization" {
  "name": "shared-project",
  "description": "Shared project for the organization",
  "private": false,
  "has_issues": true,
  "has_wiki": true,
  "has_pull_requests": true
}

# Manage teams
@codeberg-specialist listTeams "my-organization"

@codeberg-specialist createTeam "my-organization" {
  "name": "developers",
  "description": "Development team",
  "permission": "write",
  "units": ["repo.code", "repo.issues", "repo.pulls"]
}
```

## 7. User Management Workflow

**Configure user settings:**
```bash
# Get current user info
@codeberg-specialist getCurrentUser

# Manage SSH keys
@codeberg-specialist listSSHKeys

@codeberg-specialist addSSHKey "Work Laptop" "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."

# Manage GPG keys
@codeberg-specialist listGPGKeys

@codeberg-specialist addGPGKey "-----BEGIN PGP PUBLIC KEY BLOCK-----\n..."

# Manage access tokens
@codeberg-specialist listTokens

@codeberg-specialist createToken "ci-token" ["read:user", "write:repo", "read:org"]
```

## 8. Package Registry Workflow

**Manage package registries:**
```bash
# Container registry operations
# (Handled through repository settings and CI/CD)

# npm registry setup
# (Configure through repository settings)

# Package permissions and access
# (Managed through organization/team settings)
```

## Complete Project Setup Example

**Automated project initialization:**
```bash
# 1. Create repository
@codeberg-specialist createRepo {
  "name": "my-project",
  "description": "Complete project setup",
  "private": false,
  "auto_init": true
}

# 2. Configure repository
@codeberg-specialist updateRepo "username" "my-project" {
  "has_issues": true,
  "has_wiki": true,
  "has_pull_requests": true,
  "default_merge_style": "squash"
}

# 3. Set up topics
@codeberg-specialist updateTopics "username" "my-project" ["project", "automation"]

# 4. Create initial issues
@codeberg-specialist createIssue "username" "my-project" {
  "title": "Project setup",
  "body": "Complete project initialization and configuration",
  "labels": ["setup"]
}

# 5. Set up CI/CD webhook
@codeberg-specialist createWebhook "username" "my-project" {
  "type": "forgejo",
  "config": {
    "url": "https://ci.codeberg.org/hooks",
    "content_type": "json"
  },
  "events": ["push", "pull_requests"],
  "active": true
}
```

## Error Handling and Best Practices

**Common error scenarios:**
- **Authentication failures**: Check token validity and scopes
- **Permission errors**: Verify repository access and organization membership
- **Rate limiting**: Implement retry logic and respect API limits
- **Network issues**: Handle timeouts and connection errors

**Best practices:**
1. **Token Security**: Store tokens securely, rotate regularly
2. **Minimal Scopes**: Use least-privilege token scopes
3. **Error Handling**: Implement comprehensive error handling
4. **Rate Limiting**: Respect API rate limits (5000/hour for authenticated users)
5. **Pagination**: Use pagination for large result sets
6. **Webhooks**: Use webhooks for real-time updates instead of polling

## Integration with OpenCode

**Combine with other agents:**
```bash
# Use with code-architect for repository structure
@code-architect design repository structure
@codeberg-specialist createRepo {...}

# Use with test-engineer for CI/CD setup
@test-engineer create test suite
@codeberg-specialist createWebhook {...}

# Use with documentation-maintainer for releases
@documentation-maintainer generate release notes
@codeberg-specialist createRelease {...}
```

This workflow command provides comprehensive Codeberg platform automation for complete project lifecycles.
