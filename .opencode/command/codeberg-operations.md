---
description: Comprehensive Codeberg operations using the Codeberg specialist agent for repository management, issues, and CI/CD
agent: platforms/codeberg/codeberg-specialist
---

Perform comprehensive Codeberg operations using the Codeberg specialist agent.

**Available Operations:**

## Repository Management

**List user repositories:**
```bash
@codeberg-specialist listUserRepos
```

**Create new repository:**
```bash
@codeberg-specialist createRepo {
  "name": "my-new-repo",
  "description": "A new repository",
  "private": false,
  "auto_init": true
}
```

**Get repository details:**
```bash
@codeberg-specialist getRepo "username" "repository-name"
```

**Update repository:**
```bash
@codeberg-specialist updateRepo "username" "repo-name" {
  "description": "Updated description",
  "website": "https://example.com"
}
```

## Issue Management

**List repository issues:**
```bash
@codeberg-specialist listIssues "username" "repository-name"
```

**Create new issue:**
```bash
@codeberg-specialist createIssue "username" "repo-name" {
  "title": "Bug: Something is broken",
  "body": "Description of the issue",
  "labels": ["bug", "help wanted"]
}
```

**Update issue:**
```bash
@codeberg-specialist updateIssue "username" "repo-name" 123 {
  "state": "closed",
  "title": "Updated issue title"
}
```

**Add comment to issue:**
```bash
@codeberg-specialist createComment "username" "repo-name" 123 "This is a helpful comment"
```

## Pull Request Operations

**List pull requests:**
```bash
@codeberg-specialist listPullRequests "username" "repository-name"
```

**Create pull request:**
```bash
@codeberg-specialist createPullRequest "username" "repo-name" {
  "title": "Feature: Add new functionality",
  "body": "Description of changes",
  "head": "feature-branch",
  "base": "main"
}
```

**Merge pull request:**
```bash
@codeberg-specialist mergePullRequest "username" "repo-name" 456 {
  "merge_method": "merge"
}
```

## User Management

**Get current user:**
```bash
@codeberg-specialist getCurrentUser
```

**List SSH keys:**
```bash
@codeberg-specialist listSSHKeys
```

**Add SSH key:**
```bash
@codeberg-specialist addSSHKey "My Laptop" "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQ..."
```

**List access tokens:**
```bash
@codeberg-specialist listTokens
```

**Create access token:**
```bash
@codeberg-specialist createToken "my-token" ["read:user", "write:repo"]
```

## Organization Management

**List organizations:**
```bash
@codeberg-specialist listOrgs
```

**List organization repositories:**
```bash
@codeberg-specialist listOrgRepos "my-organization"
```

**Create organization repository:**
```bash
@codeberg-specialist createOrgRepo "my-organization" {
  "name": "org-repo",
  "description": "Organization repository",
  "private": false
}
```

**List organization teams:**
```bash
@codeberg-specialist listTeams "my-organization"
```

## Webhook Management

**List repository webhooks:**
```bash
@codeberg-specialist listWebhooks "username" "repository-name"
```

**Create webhook:**
```bash
@codeberg-specialist createWebhook "username" "repo-name" {
  "type": "forgejo",
  "config": {
    "url": "https://example.com/webhook",
    "content_type": "json"
  },
  "events": ["push", "pull_requests", "issues"],
  "active": true
}
```

## Release Management

**List releases:**
```bash
@codeberg-specialist listReleases "username" "repository-name"
```

**Create release:**
```bash
@codeberg-specialist createRelease "username" "repo-name" {
  "tag_name": "v1.0.0",
  "target_commitish": "main",
  "name": "Version 1.0.0",
  "body": "Release notes",
  "draft": false,
  "prerelease": false
}
```

## Authentication Setup

**Required for API operations:**
1. Create a Codeberg account at https://codeberg.org
2. Generate an access token:
   - Go to Settings > Applications > Generate New Token
   - Select appropriate scopes (read:user, write:repo, etc.)
   - Copy the token for use in API calls

**Token Scopes:**
- `read:user` - Read user information
- `write:user` - Write user information
- `read:repo` - Read repository information
- `write:repo` - Write repository information
- `read:org` - Read organization information
- `write:org` - Write organization information

## Common Workflows

### Setting up a new project:
1. Create repository
2. Set up webhooks for CI/CD
3. Configure repository settings
4. Add collaborators

### Managing issues:
1. Create issues for bugs/features
2. Assign labels and milestones
3. Track progress and updates
4. Close resolved issues

### CI/CD Integration:
1. Set up Woodpecker CI pipelines
2. Configure Forgejo Actions
3. Manage automated deployments
4. Monitor build status

### Team Collaboration:
1. Create organizations
2. Set up teams and permissions
3. Manage repository access
4. Coordinate releases

## Error Handling

**Common errors:**
- **401 Unauthorized**: Check token validity and scopes
- **404 Not Found**: Verify repository/user exists
- **403 Forbidden**: Check permissions and access rights
- **422 Unprocessable Entity**: Validate request data format

**Rate Limits:**
- 5000 requests per hour for authenticated users
- Use pagination for large result sets
- Implement retry logic for transient errors

## Best Practices

1. **Security**: Store tokens securely, rotate regularly
2. **Scopes**: Use minimal required token scopes
3. **Rate Limits**: Implement proper rate limiting
4. **Error Handling**: Handle API errors gracefully
5. **Pagination**: Use pagination for large datasets
6. **Webhooks**: Use webhooks for real-time updates
7. **Documentation**: Keep repository documentation updated

## Integration Examples

- **CI/CD**: Connect to Woodpecker CI for automated builds
- **Documentation**: Auto-publish docs via Codeberg Pages
- **Package Registry**: Publish packages to Codeberg registries
- **Webhooks**: Integrate with external services
- **Actions**: Use Forgejo Actions for automation

This command provides comprehensive access to Codeberg platform features through the Codeberg specialist agent.
