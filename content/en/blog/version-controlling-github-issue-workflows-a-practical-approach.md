---
title: "Version-Controlling GitHub Issue Workflows: A Practical Approach"
slug: version-controlling-github-issue-workflows-a-practical-approach
description: "GitHub issues lack inherent structure. I built do-gh-sub-issues to bring hierarchy and better workflow control across multiple projects."
date: 2025-07-24
tags:
  - GitHub
  - Git
  - AI
categories:
  - Software Development
thumbnail:
  url: /img/blog/github-issues-overview.png
draft: true
---

## Building GitHub Issue Hierarchies: A Practical Approach

After struggling with GitHub's flat issue structure across multiple projects, I created a solution that brings hierarchical organization to issue tracking. Here's how I built do-gh-sub-issues as a simple yet powerful workflow tool.

## The Core Problem

During a recent project, I discovered three critical pain points in GitHub's native issue management:

  1. No validation for parent-child relationships between issues
  2. Manual status synchronization across dependent tasks
  3. Missing audit trail for workflow changes

This led to several incidents where completed features had unresolved dependencies, prompting me to create a code-based solution.

{{< image src="/img/blog/github-issue-with-sub-issue.png" mode="true" caption="demonstrating parent-child relationships" >}}

## Why Start with .sh?

I chose Bash scripting for the initial implementation because:

**Universal Availability**: Every Unix-like system has a shell interpreter
**Minimal Dependencies**: No package managers or runtime environments needed
**Rapid Prototyping**: Immediate feedback during development
**Educational Value**: Clear, readable code for learning purposes
The script handles:

```bash
- Issue relationship validation
- Status cascade logic
- Cross-reference checking
- CI/CD integration
```

## Technical Implementation

### Configuration Setup

I define relationships in `.github/issue-workflow.yml`:

```yaml
# Core workflow rules
version: 2024.1

workflows:
  feature_development:
    parent_prefix: "Epic:"
    child_types:
      - prefix: "Task:"
        required: true
        status_map:
          "In Progress": "Active"
          "Done": "Needs Review"
      - prefix: "Research:"
        blocking: false

  documentation:
    parent_prefix: "Docs:"
    auto_close: true
    status_cascade: true
```

### CI Validation

The GitHub Action enforces these rules on every PR:

```yaml
name: Issue Workflow Validation
on: [pull_request, issues]

jobs:
  validate_issues:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check issue dependencies
        uses: d-oit/gh-sub-issues@v2
        with:
          config_path: .github/issue-workflow.yml
          validation_mode: strict
```

Key validation features:

- Blocks PRs with incomplete dependencies
- Enforces status transition rules
- Verifies correct issue type prefixes
- Generates visual dependency graphs

### Workflow Visualization

```mermaid
graph TD
    PR[Pull Request] -->|Triggers| Validator
    Validator -->|Reads| Config[issue-workflow.yml]
    Validator -->|Checks| Issues[Linked Issues]
    Issues -->|Valid| CI_Pass[CI Passes]
    Issues -->|Invalid| CI_Fail[CI Fails]
    CI_Fail -->|Reports| Error[Specific Validation Errors]
```

## Practical Benefits

Through regular use, I've observed:

1. **Reduced Oversights**: Automated checks prevent merging with unresolved dependencies
2. **Clearer Context**: Version-controlled workflow definitions serve as documentation
3. **Consistent Processes**: Status transitions follow codified rules across all repos
4. **Adaptable Workflows**: Configuration changes through standard PR review process

## Implementation Guide

### Installation

```bash
gh repo clone d-oit/do-gh-sub-issues
cp -r do-gh-sub-issues/.github your-project/
```

### Customization

Modify `issue-workflow.yml` using the [configuration reference](https://github.com/d-oit/do-gh-sub-issues/wiki/Configuration-Guide)

### Integration

The validation action automatically runs on:

- New pull requests
- Issue modifications
- Workflow file changes

## Personal Usage Notes

In my daily work:

- I prefix all issue titles with type identifiers (`Epic:`, `Task:`, etc.)
- PR descriptions explicitly reference parent issues
- Configuration changes go through standard code review
- The system handles cross-repository dependencies

## Getting Started Suggestions

For new adopters, I recommend:

1. Start with basic parent-child relationships
2. Gradually add status mapping rules
3. Use the `--dry-run` flag during initial setup
4. Review validation reports before enabling strict mode

The template includes [example configurations](https://github.com/d-oit/do-gh-sub-issues/tree/main/examples) for different project scales.

## Future Considerations

While Bash works well for the reference implementation, production systems might benefit from:

- **Python**: Better error handling and testing frameworks
- **Rust**: Memory safety and performance for large repositories
- **TypeScript**: Integration with existing web tooling

The core logic remains transferable across implementations.

## References

- [GitHub's sub-issues announcement](https://github.blog/engineering/architecture-optimization/introducing-sub-issues-enhancing-issue-management-on-github/)
- [Tilburg Science Hub - Issue Management](https://tilburgsciencehub.com/topics/automation/version-control/start-git/write-good-issues/)
- [GitProtect.io - GitHub Issues Guide](https://gitprotect.io/blog/mastering-github-issues-best-practices-and-pro-tips/)
