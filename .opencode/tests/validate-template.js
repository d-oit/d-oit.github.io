#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔍 OpenCode Template Validation')
console.log('================================\n')

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    critical: true
  },
  {
    name: 'README.md exists',
    check: () => fs.existsSync('README.md'),
    critical: true
  },
  {
    name: 'TypeScript config exists',
    check: () => fs.existsSync('tsconfig.json'),
    critical: true
  },
  {
    name: 'Environment template exists',
    check: () => fs.existsSync('.env.example'),
    critical: true
  },
  {
    name: 'Source directory exists',
    check: () => fs.existsSync('src'),
    critical: true
  },
  {
    name: 'Components directory exists',
    check: () => fs.existsSync('src/components'),
    critical: false
  },
  {
    name: 'Tests directory exists',
    check: () => fs.existsSync('tests'),
    critical: false
  },
  {
    name: 'Config directory exists',
    check: () => fs.existsSync('config'),
    critical: false
  },
  {
    name: 'OpenCode directory exists',
    check: () => fs.existsSync('.opencode'),
    critical: true
  },
  {
    name: 'Agent directory exists',
    check: () => fs.existsSync('.opencode/agent'),
    critical: true
  },
  {
    name: 'Command directory exists',
    check: () => fs.existsSync('.opencode/command'),
    critical: true
  },
  {
    name: 'Documentation directory exists',
    check: () => fs.existsSync('.opencode/docs'),
    critical: false
  },
  {
    name: 'Validation directory exists',
    check: () => fs.existsSync('.opencode/validation'),
    critical: false
  },
  {
    name: 'AGENTS.md exists',
    check: () => fs.existsSync('AGENTS.md'),
    critical: true
  },
  {
    name: 'Technology stack specified',
    check: () => {
      const content = fs.readFileSync('AGENTS.md', 'utf8')
      return !content.includes('[Vite/Webpack/Rollup] (specify your choice)')
    },
    critical: true
  },
  {
    name: 'No broken documentation references',
    check: () => {
      const files = [
        '@agent-orchestrator.md',
        '.opencode/docs/TEMPLATE-USAGE.md',
        '.opencode/docs/GETTING-STARTED.md'
      ]
      for (const file of files) {
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8')
          if (content.includes('CLAUDE.md')) {
            return false
          }
        }
      }
      return true
    },
    critical: false
  },
  {
    name: 'Setup commands exist',
    check: () => {
      return fs.existsSync('.opencode/command/setup/init-project.md') &&
             fs.existsSync('.opencode/command/setup/setup-env.md') &&
             fs.existsSync('.opencode/command/setup/install-deps.md')
    },
    critical: false
  }
]

let passed = 0
let failed = 0
let criticalFailed = 0

checks.forEach(({ name, check, critical }) => {
  try {
    const result = check()
    if (result) {
      console.log(`✅ ${name}`)
      passed++
    } else {
      console.log(`❌ ${name}`)
      failed++
      if (critical) criticalFailed++
    }
  } catch (error) {
    console.log(`❌ ${name} (Error: ${error.message})`)
    failed++
    if (critical) criticalFailed++
  }
})

console.log('\n📊 Validation Results')
console.log('====================')
console.log(`Total checks: ${checks.length}`)
console.log(`Passed: ${passed}`)
console.log(`Failed: ${failed}`)
console.log(`Critical failures: ${criticalFailed}`)

const templateScore = Math.round((passed / checks.length) * 100)
console.log(`\n🏆 Template completeness: ${templateScore}%`)

if (criticalFailed > 0) {
  console.log('\n🚨 Critical issues found! Template needs fixes.')
  process.exit(1)
} else if (failed > 0) {
  console.log('\n⚠️  Some non-critical issues found.')
  process.exit(0)
} else {
  console.log('\n🎉 All checks passed! Template is ready.')
  process.exit(0)
}