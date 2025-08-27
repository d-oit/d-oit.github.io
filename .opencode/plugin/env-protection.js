/**
 * Environment Protection Plugin
 * @description Multi-layered protection for environment variables and sensitive data
 * Provides comprehensive validation, audit, and security capabilities
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

export const EnvProtectionPlugin = async ({ client, $ }) => {
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    '.env.staging',
    'secrets.json',
    'credentials.json',
    '.env.backup',
    '.env.bak',
  ]

  const secretPatterns = [
    /password\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /secret\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /token\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /key\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /api_key\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /private_key\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /access_token\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /refresh_token\s*=\s*['"]?[^'"\s]+['"]?/gi,
    /bearer\s+token\s*[:=]\s*['"]?[^'"\s]+['"]?/gi,
    /authorization\s*[:=]\s*['"]?[^'"\s]+['"]?/gi,
  ]

  // Enhanced validation function for environment security
  const validateEnvironmentSecurity = async () => {
    const issues = []
    const recommendations = []

    // 1. Check for exposed sensitive files
    for (const file of sensitiveFiles) {
      try {
        await fs.access(file)
        issues.push(`🚨 CRITICAL: Sensitive file exposed: ${file}`)
        recommendations.push(`Move ${file} to secure location or delete if not needed`)
      } catch {
        // File doesn't exist, which is good
      }
    }

    // 2. Check .env.example exists and is up to date
    if (!fs.existsSync('.env.example')) {
      issues.push('⚠️  WARNING: .env.example file missing')
      recommendations.push('Create .env.example with all required environment variables')
    }

    // 3. Check for hardcoded secrets in source files
    const sourceFiles = [
      'src/**/*.{js,ts,tsx,jsx,vue,svelte}',
      'config/**/*.{js,ts,json}',
      'scripts/**/*.{js,ts,sh}',
      'package.json',
      'docker-compose.yml',
      'Dockerfile',
      '*.config.{js,ts,json}'
    ]

    for (const pattern of sourceFiles) {
      try {
        const files = await $`find . -name "${pattern}" -type f 2>/dev/null`
        const fileList = files.stdout.trim().split('\n').filter(f => f)

        for (const file of fileList) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8')

            for (const pattern of secretPatterns) {
              const matches = content.match(pattern)
              if (matches) {
                issues.push(`🚨 CRITICAL: Potential hardcoded secrets in: ${file}`)
                recommendations.push(`Remove hardcoded secrets from ${file} and use environment variables`)
                break
              }
            }
          }
        }
      } catch (error) {
        // Ignore find errors
      }
    }

    // 4. Check .env file security if it exists
    if (fs.existsSync('.env')) {
      const envContent = fs.readFileSync('.env', 'utf8')
      const lines = envContent.split('\n')

      for (const line of lines) {
        if (line.trim() && !line.startsWith('#')) {
          const [key, ...valueParts] = line.split('=')
          const value = valueParts.join('=').replace(/^['"]|['"]$/g, '')

          // Check for weak passwords
          if (key.toLowerCase().includes('password') && value.length < 8) {
            issues.push(`⚠️  WARNING: Weak password detected for ${key}`)
            recommendations.push(`Use strong passwords (min 12 chars) for ${key}`)
          }

          // Check for default/example values
          if (value.includes('your_') || value.includes('example') || value.includes('change_me')) {
            issues.push(`⚠️  WARNING: Default/example value detected for ${key}`)
            recommendations.push(`Replace default value for ${key} with actual secret`)
          }
        }
      }
    }

    // 5. Check file permissions
    if (fs.existsSync('.env')) {
      try {
        const stats = fs.statSync('.env')
        const permissions = (stats.mode & parseInt('777', 8)).toString(8)

        if (permissions !== '600') {
          issues.push(`⚠️  WARNING: .env file has insecure permissions: ${permissions}`)
          recommendations.push('Set .env file permissions to 600 (owner read/write only)')
        }
      } catch (error) {
        issues.push(`❌ ERROR: Cannot check .env file permissions`)
      }
    }

    // 6. Check for environment variable leaks in logs
    const logFiles = ['*.log', 'logs/*.log', 'npm-debug.log*', 'yarn-error.log*']
    for (const pattern of logFiles) {
      try {
        const files = await $`find . -name "${pattern}" -type f 2>/dev/null`
        const fileList = files.stdout.trim().split('\n').filter(f => f)

        for (const file of fileList) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8')

            for (const pattern of secretPatterns) {
              if (content.match(pattern)) {
                issues.push(`🚨 CRITICAL: Potential secret leak in log file: ${file}`)
                recommendations.push(`Remove or sanitize ${file} - contains potential secrets`)
                break
              }
            }
          }
        }
      } catch (error) {
        // Ignore find errors
      }
    }

    return { issues, recommendations }
  }

  // Function to create secure .env template
  const createSecureEnvTemplate = async () => {
    const templatePath = '.env.example'

    if (!fs.existsSync(templatePath)) {
      const template = `# OpenCode Framework - Environment Variables Template
# Copy this file to .env and fill in your actual values
# NEVER commit the .env file to version control

# ===========================================
# APPLICATION CONFIGURATION
# ===========================================

NODE_ENV=development
PORT=3000
HOST=localhost

# ===========================================
# SECURITY WARNING
# ===========================================
#
# ⚠️  IMPORTANT: Replace all default values with secure secrets!
# 🔐 Use strong, unique passwords and tokens
# 🔄 Rotate secrets every 30-90 days
# 🚫 Never commit this file to version control
#
# ===========================================

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/database_name

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Session Secret
SESSION_SECRET=your_session_secret_key_here

# Git Platform Token (choose your platform)
CODEBERG_TOKEN=your_codeberg_personal_access_token
`

      fs.writeFileSync(templatePath, template)
      console.log('✅ Created secure .env.example template')
    }
  }

  // Function to audit environment variable usage
  const auditEnvironmentVariables = async () => {
    const audit = {
      used: [],
      unused: [],
      missing: [],
      recommendations: []
    }

    // Read .env.example to see what should be defined
    if (fs.existsSync('.env.example')) {
      const exampleContent = fs.readFileSync('.env.example', 'utf8')
      const exampleVars = exampleContent
        .split('\n')
        .filter(line => line.includes('=') && !line.startsWith('#'))
        .map(line => line.split('=')[0].trim())

      // Check which variables are actually used in code
      const sourceFiles = await $`find src -name "*.{js,ts,tsx,jsx}" -type f`
      const fileList = sourceFiles.stdout.trim().split('\n').filter(f => f)

      for (const file of fileList) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8')

          for (const varName of exampleVars) {
            if (content.includes(`process.env.${varName}`)) {
              if (!audit.used.includes(varName)) {
                audit.used.push(varName)
              }
            }
          }
        }
      }

      // Find unused variables
      audit.unused = exampleVars.filter(v => !audit.used.includes(v))

      // Check for missing variables in actual .env
      if (fs.existsSync('.env')) {
        const envContent = fs.readFileSync('.env', 'utf8')
        const envVars = envContent
          .split('\n')
          .filter(line => line.includes('=') && !line.startsWith('#'))
          .map(line => line.split('=')[0].trim())

        audit.missing = exampleVars.filter(v => !envVars.includes(v))
      } else {
        audit.missing = exampleVars
      }
    }

    return audit
  }

  return {
    description:
      'Environment Protection Plugin - Multi-layered protection for environment variables and sensitive data with comprehensive validation and audit capabilities',

    // Enhanced validation hooks
    validate: {
      environment: validateEnvironmentSecurity,
      audit: auditEnvironmentVariables
    },

    // Security commands
    commands: {
      'env:secure': createSecureEnvTemplate,
      'env:audit': auditEnvironmentVariables
    },

    tool: {
      execute: {
        before: async (input, output) => {
          if (input.tool === 'read') {
            const filePath = output.args.filePath || output.args.path || ''
            const isSensitive = sensitiveFiles.some(
              file => filePath.includes(file) || filePath.endsWith(file)
            )

            if (isSensitive) {
              console.warn(`🚨 BLOCKED: Attempt to read sensitive file: ${filePath}`)
              console.log('💡 Use .env.example to see required environment variables')
              throw new Error(`Access denied: Cannot read sensitive file ${filePath}. Use .env.example instead.`)
            }
          }

          if (input.tool === 'write' || input.tool === 'edit') {
            const content = output.args.content || ''
            const filePath = output.args.filePath || output.args.path || ''

            // Check for secrets in content
            for (const pattern of secretPatterns) {
              if (content.match(pattern)) {
                console.warn('🚨 BLOCKED: Detected potential secrets in file content')
                throw new Error(
                  'Security violation: Potential secrets detected in file content. Use environment variables instead.'
                )
              }
            }

            // Prevent writing to sensitive files
            const isSensitive = sensitiveFiles.some(
              file => filePath.includes(file) || filePath.endsWith(file)
            )

            if (isSensitive && !filePath.includes('.example')) {
              console.warn('🚨 BLOCKED: Attempt to write to sensitive file: ${filePath}')
              throw new Error(`Security violation: Cannot write to sensitive file ${filePath}`)
            }
          }

          if (input.tool === 'bash') {
            const command = output.args.command || ''

            // Block commands that might expose secrets
            const dangerousCommands = [
              'cat .env',
              'cat .env.local',
              'cat secrets.json',
              'cat credentials.json',
              'printenv',
              'env | grep',
              'git add .env',
              'git commit .env'
            ]

            for (const dangerous of dangerousCommands) {
              if (command.includes(dangerous)) {
                console.warn('🚨 BLOCKED: Dangerous command detected: ${command}')
                throw new Error('Security violation: Command "${command}" may expose sensitive data')
              }
            }
          }
        },

        after: async (input, output) => {
          if (input.tool === 'bash' && output.args.command && !output.error) {
            const command = output.args.command

            // Warn about successful operations that might be risky
            if (command.includes('chmod') && command.includes('.env')) {
              console.warn('⚠️  WARNING: .env file permissions changed')
              console.log('💡 Recommended: Keep .env files with 600 permissions')
            }

            if (command.includes('cp') && command.includes('.env')) {
              console.warn('⚠️  WARNING: .env file copied')
              console.log('💡 Ensure copied .env files are not committed to version control')
            }
          }
        }
      },
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        // Run environment security check on session start
        const result = await validateEnvironmentSecurity()
        if (result.issues.length > 0) {
          console.log('\n🚨 ENVIRONMENT SECURITY ISSUES DETECTED:')
          result.issues.forEach(issue => console.log(`   ${issue}`))
          if (result.recommendations.length > 0) {
            console.log('\n💡 RECOMMENDATIONS:')
            result.recommendations.forEach(rec => console.log(`   • ${rec}`))
          }
        }
      }
    }
  }
}
