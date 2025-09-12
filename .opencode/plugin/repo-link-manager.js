/**
 * Repository Link Manager Plugin
 * @description Automatically detects git remote repository and updates all placeholder links
 * Automatically detects git remote repository and updates all placeholder links
 * in documentation during project initialization and git operations
 */

export const RepoLinkManagerPlugin = async ({ $ }) => {
  // Function to detect git remote URL
  const detectGitRemote = async () => {
    try {
      const { stdout } = await $`git config --get remote.origin.url`
      const remoteUrl = stdout.trim()
      
      if (!remoteUrl) {
        return null
      }

      // Convert SSH URL to HTTPS URL if needed
      let httpsUrl = remoteUrl
      if (remoteUrl.startsWith('git@')) {
        // Convert git@domain:user/repo.git to https://domain/user/repo
        const sshMatch = remoteUrl.match(/git@([^:]+):(.+)\.git/)
        if (sshMatch) {
          httpsUrl = `https://${sshMatch[1]}/${sshMatch[2]}`
        }
      } else if (remoteUrl.endsWith('.git')) {
        // Remove .git suffix
        httpsUrl = remoteUrl.slice(0, -4)
      }

      return httpsUrl
    } catch (error) {
      return null
    }
  }

  // Function to detect git platform
  const detectGitPlatform = (remoteUrl) => {
    if (!remoteUrl) return null

    const platforms = {
      github: /github\.com\/([^\/]+)\/([^\/]+)/,
      codeberg: /codeberg\.org\/([^\/]+)\/([^\/]+)/,
      gitlab: /gitlab\.com\/([^\/]+)\/([^\/]+)/,
      bitbucket: /bitbucket\.org\/([^\/]+)\/([^\/]+)/,
    }

    for (const [platform, pattern] of Object.entries(platforms)) {
      const match = remoteUrl.match(pattern)
      if (match) {
        return {
          platform,
          owner: match[1],
          repo: match[2],
          url: remoteUrl,
        }
      }
    }

    return null
  }

  // Function to run the enhanced link updater
  const runLinkUpdater = async () => {
    try {
      console.log('🔗 Repository Link Manager: Checking for repository link updates...')
      
      const remoteUrl = await detectGitRemote()
      if (!remoteUrl) {
        console.log('ℹ️  No git remote detected, skipping link updates')
        return
      }

      const repoInfo = detectGitPlatform(remoteUrl)
      if (!repoInfo) {
        console.log('⚠️  Could not detect git platform, skipping link updates')
        return
      }

      console.log(`📡 Detected repository: ${repoInfo.platform}/${repoInfo.owner}/${repoInfo.repo}`)
      
      // Run the enhanced link updater
      const { stdout } = await $`node .opencode/tests/enhanced-link-updater.js`
      console.log('✅ Repository links updated successfully')
      
      return true
    } catch (error) {
      console.log('⚠️  Repository link update failed:', error.message)
      return false
    }
  }

  return {
    tool: {
      execute: {
        before: async (input, output) => {
          // Run link updater before git operations that might involve remote changes
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command
            
            // Run link updater before git push, git remote operations, or project initialization
            if (
              command.includes('git push') || 
              command.includes('git remote') ||
              command.includes('pnpm run init') ||
              command.includes('npm run init') ||
              command.includes('./.opencode/tests/test-runner --update-links')
            ) {
              await runLinkUpdater()
            }
          }
        },
        
        after: async (input, output) => {
          // Run link updater after successful git clone or remote setup
          if (input.tool === 'bash' && output.args.command && !output.error) {
            const command = output.args.command
            
            if (
              command.includes('git clone') || 
              command.includes('git remote add origin')
            ) {
              console.log('🔄 Git remote setup detected, updating repository links...')
              await runLinkUpdater()
            }
          }
        },
      },
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        // Check and update links on session start
        const remoteUrl = await detectGitRemote()
        if (remoteUrl) {
          const repoInfo = detectGitPlatform(remoteUrl)
          if (repoInfo) {
            console.log(`📂 Repository Link Manager initialized for: ${repoInfo.platform}/${repoInfo.owner}/${repoInfo.repo}`)
            
            // Optionally run a quick check for placeholder links
            // This is lightweight and doesn't modify files
            console.log('🔍 Checking for placeholder links...')
            // We could add a quick validation here if needed
          }
        }
      }
    },

    // Custom functions for the repository link manager
    functions: {
      detectGitRemote,
      detectGitPlatform,
      runLinkUpdater,
      updateRepositoryLinks: runLinkUpdater, // Alias for external use
    },
  }
}
