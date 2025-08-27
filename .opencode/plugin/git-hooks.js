/**
 * Git Workflow Integration Plugin
 * @description Automates git workflow and enforces best practices
 * Provides validation and audit capabilities for git operations
 */

export const GitHooksPlugin = async ({ $ }) => {
  const checkGitStatus = async () => {
    try {
      const { stdout } = await $`git status --porcelain`
      return stdout.trim().length > 0
    } catch {
      return false
    }
  }

  const checkBranch = async () => {
    try {
      const { stdout } = await $`git branch --show-current`
      return stdout.trim()
    } catch {
      return 'unknown'
    }
  }

  // Validation function for git workflow compliance
  const validateGitWorkflow = async () => {
    const issues = []

    try {
      // Check current branch
      const branch = await checkBranch()
      if (['main', 'master'].includes(branch)) {
        issues.push(`⚠️  Working on protected branch: ${branch}`)
      }

      // Check for uncommitted changes
      const hasChanges = await checkGitStatus()
      if (hasChanges) {
        issues.push('⚠️  Uncommitted changes detected')
      }

      // Check git configuration
      const { stdout: userName } = await $`git config user.name`
      const { stdout: userEmail } = await $`git config user.email`

      if (!userName.trim()) {
        issues.push('❌ Git user name not configured')
      }
      if (!userEmail.trim()) {
        issues.push('❌ Git user email not configured')
      }

      // Check for large files that shouldn't be committed
      const { stdout: largeFiles } = await $`find . -type f -size +50M 2>/dev/null | head -10`
      if (largeFiles.trim()) {
        issues.push('⚠️  Large files detected (>50MB)')
      }

    } catch (error) {
      issues.push(`❌ Git validation error: ${error.message}`)
    }

    return issues
  }

  return {
    description: 'Git Workflow Integration Plugin - Automates git workflow and enforces best practices with validation and audit capabilities',

    // Add validation hook
    validate: {
      git: validateGitWorkflow
    },

    tool: {
      execute: {
        before: async (input, output) => {
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command

            // Prevent direct commits to main/master
            if (command.includes('git commit') || command.includes('git push')) {
              const branch = await checkBranch()
              if (['main', 'master', 'production'].includes(branch)) {
                throw new Error(
                  `🚨 Direct commits to ${branch} branch are not allowed. Create a feature branch instead.`
                )
              }
            }

            // Warn about uncommitted changes before major operations
            if (
              command.includes('git checkout') ||
              command.includes('git pull') ||
              command.includes('git rebase')
            ) {
              const hasChanges = await checkGitStatus()
              if (hasChanges) {
                console.warn(
                  '⚠️  You have uncommitted changes. Consider committing or stashing them first.'
                )
              }
            }

            // Enforce commit message format for commits
            if (command.includes('git commit') && !command.includes('-m')) {
              console.log('💡 Tip: Use conventional commit format (feat:, fix:, docs:, etc.)')
            }
          }
        },

        after: async (input, output) => {
          if (input.tool === 'bash' && output.args.command && !output.error) {
            const command = output.args.command

            // Auto-run tests after significant changes
            if (command.includes('git pull') || command.includes('git merge')) {
              console.log('🔄 Running tests after merge/pull...')
              try {
                await $`npm test`
                console.log('✅ Tests passed after merge/pull')
              } catch (error) {
                console.error('❌ Tests failed after merge/pull. Please review changes.')
              }
            }
          }
        },
      },
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        // Check git status on session start
        const branch = await checkBranch()
        const hasChanges = await checkGitStatus()

        console.log(`📂 Current branch: ${branch}`)
        if (hasChanges) {
          console.log('📝 You have uncommitted changes')
        }
      }
    },
  }
}
