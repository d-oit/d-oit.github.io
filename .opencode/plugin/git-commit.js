/**
 * Git Commit Specialist Plugin
 * Provides advanced git commit functionality with conventional commit support
 * and safety validations for the git-commit-specialist agent
 */

export const GitCommitPlugin = async ({ $ }) => {
  // Conventional commit types and their descriptions
  const COMMIT_TYPES = {
    feat: 'New feature or functionality',
    fix: 'Bug fix',
    docs: 'Documentation changes',
    style: 'Code style changes (formatting, semicolons, etc.)',
    refactor: 'Code refactoring without functionality changes',
    test: 'Adding or updating tests',
    chore: 'Maintenance tasks, dependency updates, etc.',
    perf: 'Performance improvements',
    ci: 'CI/CD pipeline changes',
    build: 'Build system or tooling changes',
    revert: 'Reverting previous commits',
  }

  // Sensitive data patterns to detect
  const SENSITIVE_PATTERNS = [
    /api[_-]?key/i,
    /token/i,
    /secret/i,
    /password/i,
    /-----BEGIN.*PRIVATE KEY-----/i,
    /\.env/i,
    /email.*@/i,
    /phone.*\d{3}/i,
    /ssn|social.*security/i,
  ]

  // File organization patterns
  const FILE_PATTERNS = {
    domain: /^src\/domains\/[^\/]+\/(components|hooks|services|types|utils|__tests__)/,
    shared: /^src\/domains\/shared\//,
    core: /^src\/core\/(config|types|utils)/,
    ui: /^src\/ui\/(components|layouts|theme|assets)/,
    tests: /^tests\/unit\//,
  }

  // Analyze changes and suggest commit type
  const analyzeChanges = async files => {
    const analysis = {
      type: 'chore',
      scope: null,
      breaking: false,
      confidence: 0,
    }

    for (const file of files) {
      // Detect scope from domain structure
      const domainMatch = file.match(/src\/domains\/([^\/]+)/)
      if (domainMatch && !analysis.scope) {
        analysis.scope = domainMatch[1]
      }

      // Suggest commit type based on file patterns
      if (file.includes('__tests__') || file.includes('.test.')) {
        analysis.type = 'test'
        analysis.confidence = Math.max(analysis.confidence, 0.9)
      } else if (file.includes('README') || file.includes('docs/') || file.includes('.md')) {
        analysis.type = 'docs'
        analysis.confidence = Math.max(analysis.confidence, 0.8)
      } else if (file.includes('components/') || file.includes('hooks/')) {
        analysis.type = 'feat'
        analysis.confidence = Math.max(analysis.confidence, 0.7)
      } else if (file.includes('services/') || file.includes('api/')) {
        analysis.type = 'refactor'
        analysis.confidence = Math.max(analysis.confidence, 0.6)
      }
    }

    return analysis
  }

  // Validate file organization
  const validateFileOrganization = async files => {
    const violations = []

    for (const file of files) {
      // Skip non-source files
      if (!file.startsWith('src/') && !file.startsWith('tests/')) {
        continue
      }

      const isValid = Object.values(FILE_PATTERNS).some(pattern => pattern.test(file))

      if (!isValid) {
        violations.push({
          file,
          suggestion: getOrganizationSuggestion(file),
        })
      }
    }

    return violations
  }

  // Get organization suggestion for misplaced files
  const getOrganizationSuggestion = file => {
    if (file.includes('component') || file.includes('Component')) {
      return 'src/domains/{domain}/components/'
    } else if (file.includes('hook') || file.includes('Hook')) {
      return 'src/domains/{domain}/hooks/'
    } else if (file.includes('service') || file.includes('Service')) {
      return 'src/domains/{domain}/services/'
    } else if (file.includes('util') || file.includes('Util')) {
      return 'src/domains/{domain}/utils/'
    } else if (file.includes('test') || file.includes('spec')) {
      return 'src/domains/{domain}/__tests__/'
    } else if (file.includes('config')) {
      return 'src/core/config/'
    } else if (file.includes('type') || file.includes('interface')) {
      return 'src/domains/{domain}/types/'
    } else {
      return 'src/domains/{domain}/components/'
    }
  }

  // Detect sensitive data in files
  const detectSensitiveData = async files => {
    const findings = []

    for (const file of files) {
      try {
        const { stdout: content } = await $`cat ${file}`
        const lines = content.split('\n')

        lines.forEach((line, index) => {
          SENSITIVE_PATTERNS.forEach(pattern => {
            if (pattern.test(line)) {
              findings.push({
                file,
                line: index + 1,
                content: line.trim(),
                pattern: pattern.toString(),
              })
            }
          })
        })
      } catch (error) {
        // File might not exist or be binary, skip
        continue
      }
    }

    return findings
  }

  // Generate conventional commit message
  const generateCommitMessage = (type, scope, description, breaking = false) => {
    const prefix = breaking ? `${type}!` : type
    const scopeStr = scope ? `(${scope})` : ''
    return `${prefix}${scopeStr}: ${description}`
  }

  // Validate commit message format
  const validateCommitMessage = message => {
    const pattern =
      /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,}/
    return pattern.test(message)
  }

  // Get staged files
  const getStagedFiles = async () => {
    try {
      const { stdout } = await $`git diff --cached --name-only`
      return stdout.trim().split('\n').filter(Boolean)
    } catch {
      return []
    }
  }

  // Get unstaged changes
  const getUnstagedChanges = async () => {
    try {
      const { stdout } = await $`git diff --name-only`
      return stdout.trim().split('\n').filter(Boolean)
    } catch {
      return []
    }
  }

  // Check current branch
  const getCurrentBranch = async () => {
    try {
      const { stdout } = await $`git branch --show-current`
      return stdout.trim()
    } catch {
      return 'unknown'
    }
  }

  return {
    tool: {
      execute: {
        before: async (input, output) => {
          // Intercept git commit commands for validation
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command

            if (command.includes('git commit')) {
              console.log('🔍 Git Commit Specialist: Validating commit...')

              // Get staged files for validation
              const stagedFiles = await getStagedFiles()

              if (stagedFiles.length === 0) {
                throw new Error(
                  '❌ No staged files found. Stage your changes first with `git add`.'
                )
              }

              // Validate file organization
              const violations = await validateFileOrganization(stagedFiles)
              if (violations.length > 0) {
                console.error('❌ File organization violations detected:')
                violations.forEach(v => {
                  console.error(`  📁 ${v.file} → ${v.suggestion}`)
                })
                throw new Error('Fix file organization before committing.')
              }

              // Detect sensitive data
              const sensitiveFindings = await detectSensitiveData(stagedFiles)
              if (sensitiveFindings.length > 0) {
                console.error('🚨 Sensitive data detected:')
                sensitiveFindings.forEach(f => {
                  console.error(`  📄 ${f.file}:${f.line} - ${f.content.substring(0, 50)}...`)
                })
                throw new Error('Remove sensitive data before committing.')
              }

              // Validate commit message if provided
              if (command.includes('-m')) {
                const messageMatch = command.match(/-m\s+["']([^"']+)["']/)
                if (messageMatch) {
                  const message = messageMatch[1]
                  if (!validateCommitMessage(message)) {
                    throw new Error(
                      '❌ Invalid commit message format. Use: type(scope): description\n' +
                        'Example: feat(auth): add user login functionality'
                    )
                  }
                }
              }

              console.log('✅ Commit validation passed!')
            }
          }
        },

        after: async (input, output) => {
          // Post-commit actions
          if (input.tool === 'bash' && output.args.command && !output.error) {
            const command = output.args.command

            if (command.includes('git commit')) {
              console.log('🎉 Commit created successfully!')

              // Suggest next steps
              const branch = await getCurrentBranch()
              if (['main', 'master'].includes(branch)) {
                console.log('💡 Consider creating a feature branch for future changes.')
              } else {
                console.log('💡 Ready to push? Run: git push origin', branch)
              }
            }
          }
        },
      },
    },

    // Custom functions for the git-commit-specialist agent
    functions: {
      analyzeChanges,
      validateFileOrganization,
      detectSensitiveData,
      generateCommitMessage,
      validateCommitMessage,
      getStagedFiles,
      getUnstagedChanges,
      getCurrentBranch,
      getCommitTypes: () => COMMIT_TYPES,
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        // Initialize git commit specialist
        const branch = await getCurrentBranch()
        const stagedFiles = await getStagedFiles()
        const unstagedFiles = await getUnstagedChanges()

        console.log(`📂 Git Commit Specialist initialized on branch: ${branch}`)

        if (stagedFiles.length > 0) {
          console.log(`📝 ${stagedFiles.length} staged file(s) ready for commit`)
        }

        if (unstagedFiles.length > 0) {
          console.log(`📝 ${unstagedFiles.length} unstaged file(s)`)
        }
      }
    },
  }
}
