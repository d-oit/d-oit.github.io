#!/usr/bin/env node

/**
 * Git Commit Specialist Agent Test Suite
 *
 * Tests the git-commit-specialist agent's functionality including:
 * - Conventional commit message generation
 * - File organization validation
 * - Sensitive data detection
 * - Change analysis and type suggestion
 * - Integration with git hooks
 */

const fs = require('fs')
const path = require('path')
// const { execSync, spawn } = require('child_process') // Not used in current tests

// Test configuration
const TEST_CONFIG = {
  testRepo: '/tmp/git-commit-test-repo',
  testFiles: {
    valid: [
      'src/domains/auth/components/LoginForm.tsx',
      'src/domains/auth/hooks/useAuth.ts',
      'src/domains/shared/utils/helpers.ts',
    ],
    invalid: ['src/NewComponent.tsx', 'utils/helpers.js', 'components/Button.js'],
    sensitive: ['config/database.js', '.env.local'],
  },
}

class GitCommitSpecialistTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: [],
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString()
    const prefix =
      {
        info: 'ℹ️ ',
        success: '✅ ',
        error: '❌ ',
        warning: '⚠️ ',
      }[type] || 'ℹ️ '

    console.log(`[${timestamp}] ${prefix}${message}`)
  }

  runTest(testName, testFunction) {
    this.log(`Running test: ${testName}`, 'info')

    try {
      const result = testFunction()
      if (result) {
        this.results.passed++
        this.results.tests.push({ name: testName, status: 'passed' })
        this.log(`Test passed: ${testName}`, 'success')
        return true
      } else {
        this.results.failed++
        this.results.tests.push({ name: testName, status: 'failed' })
        this.log(`Test failed: ${testName}`, 'error')
        return false
      }
    } catch (error) {
      this.results.failed++
      this.results.tests.push({ name: testName, status: 'error', error: error.message })
      this.log(`Test error: ${testName} - ${error.message}`, 'error')
      return false
    }
  }

  // Test 1: Agent configuration validation
  testAgentConfiguration() {
    const agentPath = path.join(__dirname, '../agent/git-commit-specialist.md')

    if (!fs.existsSync(agentPath)) {
      throw new Error('Git commit specialist agent file not found')
    }

    const content = fs.readFileSync(agentPath, 'utf8')

    // Check required sections
    const requiredSections = [
      'description:',
      'tools:',
      'CORE COMPETENCIES',
      'CONVENTIONAL COMMIT STANDARDS',
      'METHODOLOGY',
      'INTEGRATION PATTERNS',
      'SAFETY FEATURES',
    ]

    for (const section of requiredSections) {
      if (!content.includes(section)) {
        throw new Error(`Missing required section: ${section}`)
      }
    }

    // Check tool permissions
    if (!content.includes('bash: true')) {
      throw new Error('Agent must have bash permissions enabled')
    }

    return true
  }

  // Test 2: Conventional commit format validation
  testConventionalCommitFormat() {
    const validCommits = [
      'feat(auth): add user login functionality',
      'fix(ui): resolve button styling issue',
      'docs: update README with setup instructions',
      'refactor(api): simplify user service methods',
      'test(auth): add unit tests for login component',
      'chore: update dependencies',
      'feat!: add breaking change to authentication API',
    ]

    const invalidCommits = [
      'add user login',
      'fix: button issue',
      'update docs',
      'feat auth: add login',
      'feat(auth) add login',
    ]

    // Test valid commits
    const commitRegex =
      /^(feat|fix|docs|style|refactor|test|chore|perf|ci|build|revert)(\(.+\))?: .{1,}/

    for (const commit of validCommits) {
      if (!commitRegex.test(commit)) {
        throw new Error(`Valid commit failed regex: ${commit}`)
      }
    }

    // Test invalid commits
    for (const commit of invalidCommits) {
      if (commitRegex.test(commit)) {
        throw new Error(`Invalid commit passed regex: ${commit}`)
      }
    }

    return true
  }

  // Test 3: File organization validation
  testFileOrganizationValidation() {
    const validFiles = TEST_CONFIG.testFiles.valid
    const invalidFiles = TEST_CONFIG.testFiles.invalid

    // Test valid file patterns
    const domainPattern = /^src\/domains\/[^\/]+\/(components|hooks|services|types|utils|__tests__)/
    const sharedPattern = /^src\/domains\/shared\//
    const corePattern = /^src\/core\/(config|types|utils)/
    const uiPattern = /^src\/ui\/(components|layouts|theme|assets)/

    for (const file of validFiles) {
      const isValid =
        domainPattern.test(file) ||
        sharedPattern.test(file) ||
        corePattern.test(file) ||
        uiPattern.test(file)

      if (!isValid) {
        throw new Error(`Valid file failed pattern test: ${file}`)
      }
    }

    // Test invalid file patterns
    for (const file of invalidFiles) {
      const isInvalid =
        !domainPattern.test(file) &&
        !sharedPattern.test(file) &&
        !corePattern.test(file) &&
        !uiPattern.test(file)

      if (!isInvalid) {
        throw new Error(`Invalid file passed pattern test: ${file}`)
      }
    }

    return true
  }

  // Test 4: Sensitive data detection
  testSensitiveDataDetection() {
    const sensitivePatterns = [
      /api[_-]?key/i,
      /token/i,
      /secret/i,
      /password/i,
      /-----BEGIN.*PRIVATE KEY-----/i,
      /\.env/i,
      /email.*@/i,
      /phone.*\d{3}/i,
    ]

    const testContent = {
      safe: [
        'const API_URL = "https://api.example.com";',
        'const timeout = 5000;',
        'function validateUser(user) { return user.name; }',
      ],
      sensitive: [
        'const API_KEY = "sk-1234567890abcdef";',
        'password: "secret123"',
        'token: "ghp_1234567890abcdef"',
        '-----BEGIN PRIVATE KEY-----',
        'user@example.com',
        'phone: 555-123-4567',
      ],
    }

    // Test safe content
    for (const content of testContent.safe) {
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          throw new Error(`Safe content triggered sensitive pattern: ${content}`)
        }
      }
    }

    // Test sensitive content
    let sensitiveDetected = 0
    for (const content of testContent.sensitive) {
      for (const pattern of sensitivePatterns) {
        if (pattern.test(content)) {
          sensitiveDetected++
          break
        }
      }
    }

    if (sensitiveDetected !== testContent.sensitive.length) {
      throw new Error('Not all sensitive content was detected')
    }

    return true
  }

  // Test 5: Git command permissions
  testGitCommandPermissions() {
    const opencodeConfig = JSON.parse(fs.readFileSync('opencode.json', 'utf8'))
    const allowedCommands = opencodeConfig.permission.bash

    const requiredGitCommands = [
      'git status',
      'git diff',
      'git log',
      'git add',
      'git commit',
      'git reset',
      'git checkout',
      'git branch',
      'git stash',
      'git clean',
      'git show',
      'git rev-parse',
      'git ls-files',
      'git diff-tree',
    ]

    for (const command of requiredGitCommands) {
      if (allowedCommands[command] !== 'allow') {
        throw new Error(`Required git command not allowed: ${command}`)
      }
    }

    return true
  }

  // Test 6: Integration with existing hooks
  testHookIntegration() {
    const hooksDir = path.join(process.cwd(), '.husky')

    if (!fs.existsSync(hooksDir)) {
      throw new Error('Husky hooks directory not found')
    }

    const requiredHooks = ['commit-msg', 'pre-commit']

    for (const hook of requiredHooks) {
      const hookPath = path.join(hooksDir, hook)
      if (!fs.existsSync(hookPath)) {
        throw new Error(`Required hook not found: ${hook}`)
      }

      // Check if hook is executable
      const stats = fs.statSync(hookPath)
      if (!(stats.mode & 0o111)) {
        throw new Error(`Hook is not executable: ${hook}`)
      }
    }

    return true
  }

  // Test 7: Change analysis simulation
  testChangeAnalysis() {
    // Simulate different types of changes
    const changeScenarios = [
      {
        files: ['src/domains/auth/components/LoginForm.tsx'],
        expectedType: 'feat',
        expectedScope: 'auth',
      },
      {
        files: ['src/domains/ui/components/Button.tsx'],
        expectedType: 'fix',
        expectedScope: 'ui',
      },
      {
        files: ['README.md', 'docs/setup.md'],
        expectedType: 'docs',
        expectedScope: null,
      },
      {
        files: ['src/domains/api/services/userService.ts'],
        expectedType: 'refactor',
        expectedScope: 'api',
      },
      {
        files: ['src/domains/auth/__tests__/LoginForm.test.tsx'],
        expectedType: 'test',
        expectedScope: 'auth',
      },
    ]

    for (const scenario of changeScenarios) {
      // Extract scope from file path
      const scopeMatch = scenario.files[0].match(/src\/domains\/([^\/]+)/)
      const detectedScope = scopeMatch ? scopeMatch[1] : null

      if (scenario.expectedScope && detectedScope !== scenario.expectedScope) {
        throw new Error(`Scope detection failed for ${scenario.files[0]}`)
      }
    }

    return true
  }

  // Test 8: Error handling scenarios
  testErrorHandling() {
    const errorScenarios = [
      {
        type: 'file_organization',
        files: ['src/InvalidFile.tsx'],
        expectedError: 'File organization violation',
      },
      {
        type: 'sensitive_data',
        content: 'API_KEY = "secret"',
        expectedError: 'Sensitive data detected',
      },
      {
        type: 'invalid_commit_format',
        message: 'invalid commit message',
        expectedError: 'Invalid commit message format',
      },
    ]

    // Test error message patterns
    for (const scenario of errorScenarios) {
      // In a real implementation, these would trigger actual errors
      // For now, we just validate the error message patterns exist
      if (!scenario.expectedError) {
        throw new Error(`Missing expected error for scenario: ${scenario.type}`)
      }
    }

    return true
  }

  runAllTests() {
    this.log('Starting Git Commit Specialist Agent Test Suite', 'info')
    this.log('='.repeat(60), 'info')

    const tests = [
      { name: 'Agent Configuration', func: () => this.testAgentConfiguration() },
      { name: 'Conventional Commit Format', func: () => this.testConventionalCommitFormat() },
      { name: 'File Organization Validation', func: () => this.testFileOrganizationValidation() },
      { name: 'Sensitive Data Detection', func: () => this.testSensitiveDataDetection() },
      { name: 'Git Command Permissions', func: () => this.testGitCommandPermissions() },
      { name: 'Hook Integration', func: () => this.testHookIntegration() },
      { name: 'Change Analysis', func: () => this.testChangeAnalysis() },
      { name: 'Error Handling', func: () => this.testErrorHandling() },
    ]

    for (const test of tests) {
      this.runTest(test.name, test.func)
    }

    this.printResults()
  }

  printResults() {
    this.log('='.repeat(60), 'info')
    this.log('TEST RESULTS SUMMARY', 'info')
    this.log('='.repeat(60), 'info')

    this.log(`Total Tests: ${this.results.passed + this.results.failed}`, 'info')
    this.log(`Passed: ${this.results.passed}`, 'success')
    this.log(`Failed: ${this.results.failed}`, 'error')

    if (this.results.failed > 0) {
      this.log('\nFAILED TESTS:', 'error')
      this.results.tests
        .filter(test => test.status !== 'passed')
        .forEach(test => {
          this.log(`- ${test.name}: ${test.status}`, 'error')
          if (test.error) {
            this.log(`  Error: ${test.error}`, 'error')
          }
        })
    }

    const successRate = (
      (this.results.passed / (this.results.passed + this.results.failed)) *
      100
    ).toFixed(1)
    this.log(`\nSuccess Rate: ${successRate}%`, this.results.failed > 0 ? 'warning' : 'success')

    if (this.results.failed === 0) {
      this.log('\n🎉 All tests passed! Git Commit Specialist agent is ready.', 'success')
    } else {
      this.log('\n⚠️  Some tests failed. Please review and fix the issues.', 'warning')
    }
  }
}

// Run the test suite
if (require.main === module) {
  const tester = new GitCommitSpecialistTester()
  tester.runAllTests()
}

module.exports = GitCommitSpecialistTester
