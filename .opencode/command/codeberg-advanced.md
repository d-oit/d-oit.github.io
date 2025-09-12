---
description: Advanced Codeberg operations for complex workflows, migrations, and enterprise integrations
agent: platforms/codeberg/codeberg-specialist
---

# Advanced Codeberg Operations

Complex workflow operations for enterprise-grade Codeberg management and integrations.

## Migration Workflows

**Migrate repository from GitHub:**

```bash
@codeberg-specialist migrate-repository {
  "source": {
    "platform": "github",
    "owner": "github-user",
    "repo": "myrepo",
    "token": "github-token"
  },
  "target": {
    "owner": "codeberg-user",
    "repo": "myrepo"
  },
  "options": {
    "include_issues": true,
    "include_pull_requests": true,
    "include_releases": true,
    "include_wiki": true,
    "include_labels": true
  }
}
```

**Bulk repository operations:**

```bash
@codeberg-specialist bulk-repo-operations {
  "operation": "update_topics",
  "repositories": ["repo1", "repo2", "repo3"],
  "topics": ["web", "api", "microservice"],
  "owner": "myorg"
}
```

## Enterprise Features

**Set up organization with advanced permissions:**

```bash
@codeberg-specialist setup-enterprise-org {
  "organization": "mycompany",
  "settings": {
    "visibility": "private",
    "teams": [
      {
        "name": "admins",
        "permission": "admin",
        "members": ["admin1", "admin2"]
      },
      {
        "name": "developers",
        "permission": "write",
        "repositories": ["web-app", "api", "mobile"]
      },
      {
        "name": "designers",
        "permission": "read",
        "repositories": ["design-assets", "prototypes"]
      }
    ],
    "default_permissions": "read"
  }
}
```

## Advanced CI/CD Integration

**Multi-environment deployment setup:**

```bash
@codeberg-specialist setup-multi-env-deployment {
  "repo": "myapp",
  "environments": {
    "development": {
      "branch": "develop",
      "webhook": "https://dev-ci.example.com",
      "auto_deploy": true
    },
    "staging": {
      "branch": "staging",
      "webhook": "https://staging-ci.example.com",
      "require_approval": true
    },
    "production": {
      "branch": "main",
      "webhook": "https://prod-ci.example.com",
      "require_approval": true,
      "restrict_push": true
    }
  }
}
```

## Security and Compliance

**Set up security scanning and compliance:**

```bash
@codeberg-specialist setup-security-compliance {
  "repo": "myrepo",
  "security": {
    "branch_protection": {
      "main": {
        "require_reviews": true,
        "require_status_checks": true,
        "require_up_to_date_branches": true,
        "restrict_pushes": {
          "users": ["admin1", "admin2"],
          "teams": ["core-team"]
        }
      }
    },
    "security_scanning": {
      "dependency_scanning": true,
      "secret_scanning": true,
      "code_scanning": true
    },
    "compliance": {
      "license_scanning": true,
      "vulnerability_alerts": true,
      "audit_log": true
    }
  }
}
```

## Analytics and Monitoring

**Set up comprehensive monitoring:**

```bash
@codeberg-specialist setup-repository-monitoring {
  "repo": "myrepo",
  "monitoring": {
    "metrics": {
      "traffic": true,
      "clones": true,
      "views": true,
      "referrers": true
    },
    "alerts": {
      "issue_response_time": "48h",
      "pr_merge_time": "7d",
      "security_vulnerabilities": "immediate"
    },
    "reports": {
      "frequency": "weekly",
      "format": "markdown",
      "recipients": ["team@company.com"]
    }
  }
}
```

## Package Registry Management

**Advanced package registry setup:**

```bash
@codeberg-specialist setup-package-registries {
  "organization": "myorg",
  "registries": {
    "container": {
      "enabled": true,
      "packages": ["web-app", "api", "worker"],
      "permissions": {
        "public_read": true,
        "authenticated_write": true
      }
    },
    "npm": {
      "enabled": true,
      "scope": "@myorg",
      "packages": ["ui-components", "utils", "api-client"]
    },
    "pypi": {
      "enabled": true,
      "packages": ["myorg-data", "myorg-ml"]
    }
  }
}
```

## Automated Workflows

**Set up automated release workflow:**

```bash
@codeberg-specialist setup-automated-releases {
  "repo": "myapp",
  "workflow": {
    "trigger": {
      "branch": "main",
      "tag_pattern": "v*.*.*"
    },
    "steps": [
      {
        "name": "version_check",
        "type": "validate",
        "pattern": "semantic_version"
      },
      {
        "name": "changelog",
        "type": "generate",
        "source": "CHANGELOG.md"
      },
      {
        "name": "build",
        "type": "execute",
        "commands": ["npm run build", "npm test"]
      },
      {
        "name": "release",
        "type": "create_release",
        "assets": ["dist/*", "CHANGELOG.md"]
      },
      {
        "name": "notify",
        "type": "webhook",
        "url": "https://hooks.slack.com/...",
        "message": "New release {{version}} published!"
      }
    ]
  }
}
```

## Backup and Disaster Recovery

**Set up automated backups:**

```bash
@codeberg-specialist setup-backup-strategy {
  "repositories": ["repo1", "repo2", "org/*"],
  "backup": {
    "frequency": "daily",
    "destination": "s3://my-backups/codeberg",
    "include": {
      "code": true,
      "issues": true,
      "releases": true,
      "wiki": true
    },
    "retention": {
      "daily": 30,
      "weekly": 12,
      "monthly": 12
    }
  }
}
```

## Integration with External Tools

**Advanced webhook configurations:**

```bash
@codeberg-specialist setup-external-integrations {
  "repo": "myrepo",
  "integrations": {
    "slack": {
      "webhook_url": "https://hooks.slack.com/...",
      "events": ["issues", "pull_requests", "releases"],
      "channels": {
        "issues": "#dev-issues",
        "releases": "#announcements"
      }
    },
    "discord": {
      "webhook_url": "https://discord.com/api/webhooks/...",
      "events": ["push", "issues"],
      "formatting": "rich_embed"
    },
    "email": {
      "recipients": ["team@company.com"],
      "events": ["security_alerts", "deployment_failures"],
      "template": "html"
    }
  }
}
```

## Performance Optimization

**Optimize repository for performance:**

```bash
@codeberg-specialist optimize-repository {
  "repo": "myrepo",
  "optimizations": {
    "large_files": {
      "detect": true,
      "move_to_lfs": true,
      "patterns": ["*.zip", "*.tar.gz", "*.mp4"]
    },
    "repository_size": {
      "analyze": true,
      "cleanup_branches": true,
      "remove_old_artifacts": true
    },
    "performance": {
      "enable_shallow_clone": true,
      "optimize_git_config": true,
      "setup_caching": true
    }
  }
}
```

This command provides advanced Codeberg operations for complex enterprise scenarios and integrations.
