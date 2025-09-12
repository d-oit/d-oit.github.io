#!/bin/bash

detect_platform() {
    # Check for Codeberg-specific files
    if [[ -f ".codeberg/repository-settings.json" ]] || [[ -f ".codeberg/webhooks.json" ]]; then
        echo "codeberg"
        return 0
    fi
    
    # Check for GitHub-specific files
    if [[ -f ".github/workflows/ci.yml" ]] || [[ -f ".github/CODEOWNERS" ]]; then
        echo "github"
        return 0
    fi
    
    # Check for GitLab-specific files
    if [[ -f ".gitlab-ci.yml" ]] || [[ -d ".gitlab" ]]; then
        echo "gitlab"
        return 0
    fi
    
    # Check for Gitea-specific files
    if [[ -f ".gitea/ISSUE_TEMPLATE/bug-report.md" ]]; then
        echo "gitea"
        return 0
    fi
    
    # Check for Forgejo-specific files
    if [[ -f ".forgejo/workflows/ci.yml" ]]; then
        echo "forgejo"
        return 0
    fi
    
    # Default to generic
    echo "generic"
}

PLATFORM=$(detect_platform)
echo "Detected platform: $PLATFORM"
