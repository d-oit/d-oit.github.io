/**
 * Codeberg Specialist Agent
 * Provides comprehensive Codeberg (Forgejo) API integration for repository management,
 * issue tracking, pull requests, CI/CD, and team collaboration
 */

export const CodebergSpecialist = async ({ $ }) => {
  // Codeberg API base URL
  const API_BASE = 'https://codeberg.org/api/v1'

  // Default headers for API requests
  const getDefaultHeaders = token => ({
    'Content-Type': 'application/json',
    Authorization: token ? `token ${token}` : '',
    'User-Agent': 'OpenCode-Codeberg-Agent/1.0',
  })

  // Helper function to make API requests
  const makeRequest = async (endpoint, options = {}) => {
    const { method = 'GET', token, data, params } = options

    let url = `${API_BASE}${endpoint}`
    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams(params)
      url += `?${searchParams}`
    }

    const config = {
      method,
      headers: getDefaultHeaders(token),
    }

    if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
      config.body = JSON.stringify(data)
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Codeberg API error: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`
        )
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text()
      }
    } catch (error) {
      console.error('Codeberg API request failed:', error.message)
      throw error
    }
  }

  // Repository management functions
  const repositoryOps = {
    // List user repositories
    listUserRepos: async (token, params = {}) => {
      return await makeRequest('/user/repos', { token, params })
    },

    // Get repository details
    getRepo: async (owner, repo, token) => {
      return await makeRequest(`/repos/${owner}/${repo}`, { token })
    },

    // Create a new repository
    createRepo: async (data, token) => {
      return await makeRequest('/user/repos', {
        method: 'POST',
        token,
        data,
      })
    },

    // Update repository
    updateRepo: async (owner, repo, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}`, {
        method: 'PATCH',
        token,
        data,
      })
    },

    // Delete repository
    deleteRepo: async (owner, repo, token) => {
      return await makeRequest(`/repos/${owner}/${repo}`, {
        method: 'DELETE',
        token,
      })
    },

    // List repository contents
    listContents: async (owner, repo, path = '', token, params = {}) => {
      return await makeRequest(`/repos/${owner}/${repo}/contents/${path}`, {
        token,
        params,
      })
    },

    // Get repository topics
    getTopics: async (owner, repo, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/topics`, { token })
    },

    // Update repository topics
    updateTopics: async (owner, repo, topics, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/topics`, {
        method: 'PUT',
        token,
        data: { topics },
      })
    },
  }

  // Issue management functions
  const issueOps = {
    // List repository issues
    listIssues: async (owner, repo, token, params = {}) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues`, {
        token,
        params,
      })
    },

    // Get specific issue
    getIssue: async (owner, repo, issueNumber, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
        token,
      })
    },

    // Create new issue
    createIssue: async (owner, repo, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues`, {
        method: 'POST',
        token,
        data,
      })
    },

    // Update issue
    updateIssue: async (owner, repo, issueNumber, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues/${issueNumber}`, {
        method: 'PATCH',
        token,
        data,
      })
    },

    // Create issue comment
    createComment: async (owner, repo, issueNumber, body, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
        method: 'POST',
        token,
        data: { body },
      })
    },

    // List issue comments
    listComments: async (owner, repo, issueNumber, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/issues/${issueNumber}/comments`, {
        token,
      })
    },
  }

  // Pull request management functions
  const pullRequestOps = {
    // List pull requests
    listPullRequests: async (owner, repo, token, params = {}) => {
      return await makeRequest(`/repos/${owner}/${repo}/pulls`, {
        token,
        params,
      })
    },

    // Get specific pull request
    getPullRequest: async (owner, repo, prNumber, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
        token,
      })
    },

    // Create pull request
    createPullRequest: async (owner, repo, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/pulls`, {
        method: 'POST',
        token,
        data,
      })
    },

    // Update pull request
    updatePullRequest: async (owner, repo, prNumber, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/pulls/${prNumber}`, {
        method: 'PATCH',
        token,
        data,
      })
    },

    // Merge pull request
    mergePullRequest: async (owner, repo, prNumber, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/pulls/${prNumber}/merge`, {
        method: 'POST',
        token,
        data,
      })
    },
  }

  // User management functions
  const userOps = {
    // Get current user
    getCurrentUser: async token => {
      return await makeRequest('/user', { token })
    },

    // Get user by username
    getUser: async (username, token) => {
      return await makeRequest(`/users/${username}`, { token })
    },

    // List user SSH keys
    listSSHKeys: async token => {
      return await makeRequest('/user/keys', { token })
    },

    // Add SSH key
    addSSHKey: async (title, key, token) => {
      return await makeRequest('/user/keys', {
        method: 'POST',
        token,
        data: { title, key },
      })
    },

    // List user GPG keys
    listGPGKeys: async token => {
      return await makeRequest('/user/gpg_keys', { token })
    },

    // Add GPG key
    addGPGKey: async (armored_public_key, token) => {
      return await makeRequest('/user/gpg_keys', {
        method: 'POST',
        token,
        data: { armored_public_key },
      })
    },

    // List access tokens
    listTokens: async token => {
      return await makeRequest('/user/tokens', { token })
    },

    // Create access token
    createToken: async (name, scopes, token) => {
      return await makeRequest('/user/tokens', {
        method: 'POST',
        token,
        data: { name, scopes },
      })
    },
  }

  // Organization management functions
  const orgOps = {
    // List user organizations
    listOrgs: async token => {
      return await makeRequest('/user/orgs', { token })
    },

    // Get organization
    getOrg: async (orgName, token) => {
      return await makeRequest(`/orgs/${orgName}`, { token })
    },

    // List organization repositories
    listOrgRepos: async (orgName, token, params = {}) => {
      return await makeRequest(`/orgs/${orgName}/repos`, {
        token,
        params,
      })
    },

    // Create organization repository
    createOrgRepo: async (orgName, data, token) => {
      return await makeRequest(`/orgs/${orgName}/repos`, {
        method: 'POST',
        token,
        data,
      })
    },

    // List organization teams
    listTeams: async (orgName, token) => {
      return await makeRequest(`/orgs/${orgName}/teams`, { token })
    },

    // Create team
    createTeam: async (orgName, data, token) => {
      return await makeRequest(`/orgs/${orgName}/teams`, {
        method: 'POST',
        token,
        data,
      })
    },
  }

  // Webhook management functions
  const webhookOps = {
    // List repository webhooks
    listWebhooks: async (owner, repo, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/hooks`, { token })
    },

    // Create webhook
    createWebhook: async (owner, repo, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/hooks`, {
        method: 'POST',
        token,
        data,
      })
    },

    // Update webhook
    updateWebhook: async (owner, repo, hookId, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/hooks/${hookId}`, {
        method: 'PATCH',
        token,
        data,
      })
    },

    // Delete webhook
    deleteWebhook: async (owner, repo, hookId, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/hooks/${hookId}`, {
        method: 'DELETE',
        token,
      })
    },
  }

  // Release management functions
  const releaseOps = {
    // List repository releases
    listReleases: async (owner, repo, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/releases`, { token })
    },

    // Get specific release
    getRelease: async (owner, repo, releaseId, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/releases/${releaseId}`, { token })
    },

    // Create release
    createRelease: async (owner, repo, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/releases`, {
        method: 'POST',
        token,
        data,
      })
    },

    // Update release
    updateRelease: async (owner, repo, releaseId, data, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/releases/${releaseId}`, {
        method: 'PATCH',
        token,
        data,
      })
    },

    // Delete release
    deleteRelease: async (owner, repo, releaseId, token) => {
      return await makeRequest(`/repos/${owner}/${repo}/releases/${releaseId}`, {
        method: 'DELETE',
        token,
      })
    },
  }

  return {
    tool: {
      execute: {
        before: async (input, output) => {
          // Pre-processing for Codeberg operations
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command

            // Check for Codeberg-related commands and validate
            if (command.includes('codeberg') || command.includes('forgejo')) {
              console.log('🔧 Codeberg Specialist: Detected Codeberg-related operation')
            }
          }
        },

        after: async (input, output) => {
          // Post-processing for Codeberg operations
          if (input.tool === 'bash' && output.args.command && !output.error) {
            const command = output.args.command

            // Handle successful Codeberg operations
            if (command.includes('git remote') && command.includes('codeberg.org')) {
              console.log('✅ Codeberg Specialist: Repository remote configured successfully')
            }
          }
        },
      },

      // Add webfetch tool integration for API calls
      webfetch: {
        before: async output => {
          if (output.args.url && output.args.url.includes('codeberg.org/api/v1')) {
            console.log('🔧 Codeberg Specialist: Intercepting Codeberg API call')
            // Could add authentication headers here if needed
          }
        },

        after: async output => {
          if (output.args.url && output.args.url.includes('codeberg.org/api/v1') && !output.error) {
            console.log('✅ Codeberg Specialist: API call completed successfully')
          }
        },
      },
    },

    // Custom functions for the Codeberg specialist agent
    functions: {
      // Repository operations
      listUserRepos: repositoryOps.listUserRepos,
      getRepo: repositoryOps.getRepo,
      createRepo: repositoryOps.createRepo,
      updateRepo: repositoryOps.updateRepo,
      deleteRepo: repositoryOps.deleteRepo,
      listContents: repositoryOps.listContents,
      getTopics: repositoryOps.getTopics,
      updateTopics: repositoryOps.updateTopics,

      // Issue operations
      listIssues: issueOps.listIssues,
      getIssue: issueOps.getIssue,
      createIssue: issueOps.createIssue,
      updateIssue: issueOps.updateIssue,
      createComment: issueOps.createComment,
      listComments: issueOps.listComments,

      // Pull request operations
      listPullRequests: pullRequestOps.listPullRequests,
      getPullRequest: pullRequestOps.getPullRequest,
      createPullRequest: pullRequestOps.createPullRequest,
      updatePullRequest: pullRequestOps.updatePullRequest,
      mergePullRequest: pullRequestOps.mergePullRequest,

      // User operations
      getCurrentUser: userOps.getCurrentUser,
      getUser: userOps.getUser,
      listSSHKeys: userOps.listSSHKeys,
      addSSHKey: userOps.addSSHKey,
      listGPGKeys: userOps.listGPGKeys,
      addGPGKey: userOps.addGPGKey,
      listTokens: userOps.listTokens,
      createToken: userOps.createToken,

      // Organization operations
      listOrgs: orgOps.listOrgs,
      getOrg: orgOps.getOrg,
      listOrgRepos: orgOps.listOrgRepos,
      createOrgRepo: orgOps.createOrgRepo,
      listTeams: orgOps.listTeams,
      createTeam: orgOps.createTeam,

      // Webhook operations
      listWebhooks: webhookOps.listWebhooks,
      createWebhook: webhookOps.createWebhook,
      updateWebhook: webhookOps.updateWebhook,
      deleteWebhook: webhookOps.deleteWebhook,

      // Release operations
      listReleases: releaseOps.listReleases,
      getRelease: releaseOps.getRelease,
      createRelease: releaseOps.createRelease,
      updateRelease: releaseOps.updateRelease,
      deleteRelease: releaseOps.deleteRelease,

      // Utility functions
      makeRequest,
      getDefaultHeaders,
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        console.log('🌐 Codeberg Specialist initialized')
        console.log('   📡 API Base: https://codeberg.org/api/v1')
        console.log('   🔑 Supports: Personal Access Tokens')
        console.log('   🛠️  Features: Repository, Issues, PRs, CI/CD, Teams')

        // Check if we're in a git repository with Codeberg remote
        try {
          const { stdout: remoteUrl } =
            await $`git remote get-url origin 2>/dev/null || echo "none"`
          if (remoteUrl.includes('codeberg.org')) {
            console.log(`   📂 Detected Codeberg repository: ${remoteUrl}`)
          }
        } catch (error) {
          // Not in a git repo or no remote, that's fine
        }
      }
    },
  }
}
