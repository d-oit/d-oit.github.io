#!/usr/bin/env node

/**
 * File Organization Validation Script
 * Validates that all files follow the domain-driven structure guidelines
 */

import fs from 'fs'
import path from 'path'

// Configuration
const ALLOWED_ROOT_FILES = new Set([
  'index.html',
  'package.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'opencode.json',
  'package-lock.json',
  'vite.config.ts',
  'webpack.config.js',
  'next.config.js',
  'nuxt.config.ts',
  'angular.json',
  'pyproject.toml',
  'requirements.txt',
  'setup.py',
  'go.mod',
  'Cargo.toml',
  'pom.xml',
  'build.gradle',
  'Makefile',
  'CMakeLists.txt',
  '.env.example',
  '.gitignore',
  'README.md',
  'AGENTS.md',
  'LICENSE',
  'SECURITY_REPORT.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'Dockerfile',
  'docker-compose.yml',
  '.dockerignore',
  '.editorconfig',
  '.prettierrc',
  '.eslintrc.json',
  '.eslintrc.js',
  'jest.config.js',
  'vitest.config.ts',
  'cypress.config.ts',
  'playwright.config.ts',
  'tailwind.config.js',
  'postcss.config.js',
  'babel.config.js',
  '.huskyrc',
  '.lintstagedrc',
  'commitlint.config.js',
  'renovate.json',
  'dependabot.yml',
  '.github',
  '.vscode',
  '.idea',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.vuepress',
  '.docusaurus',
  'public',
  'static',
  'assets',
  'src',
  'tests',
  'docs',
  '.opencode',
  'config',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
  '.woodpecker.yml',
])

const REQUIRED_DOMAIN_PATTERNS = [
  /^src\/domains\/[^\/]+\/components\//,
  /^src\/domains\/[^\/]+\/hooks\//,
  /^src\/domains\/[^\/]+\/services\//,
  /^src\/domains\/[^\/]+\/types\//,
  /^src\/domains\/[^\/]+\/utils\//,
  /^src\/domains\/[^\/]+\/__tests__\//,
  /^src\/domains\/shared\//,
  /^src\/core\/config\//,
  /^src\/core\/types\//,
  /^src\/core\/utils\//,
  /^src\/ui\/components\//,
  /^src\/ui\/layouts\//,
  /^src\/ui\/theme\//,
  /^src\/ui\/assets\//,
  /^tests\/unit\//,
  /^tests\/integration\//,
  /^tests\/e2e\//,
  /^src\/domains\/README\.md$/,
  /^src\/domains\/[^\/]+\/README\.md$/,
]

const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  'dist',
  'build',
  'coverage',
  '.next',
  '.nuxt',
  '.vuepress',
  '.docusaurus',
]

class FileOrganizationValidator {
  constructor() {
    this.violations = []
    this.warnings = []
    this.stats = {
      totalFiles: 0,
      rootFiles: 0,
      domainFiles: 0,
      violations: 0,
      warnings: 0,
    }
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().slice(11, 19)
    const prefix =
      {
        info: 'ℹ️ ',
        success: '✅',
        warning: '⚠️ ',
        error: '❌',
      }[type] || 'ℹ️ '

    console.log(`[${timestamp}] ${prefix} ${message}`)
  }

  isExcluded(filePath) {
    return EXCLUDED_DIRS.some(
      dir => filePath.includes(`/${dir}/`) || filePath.startsWith(`${dir}/`)
    )
  }

  validateRootFiles() {
    this.log('Checking root folder files...')

    try {
      const rootFiles = fs.readdirSync('.').filter(file => {
        const stat = fs.statSync(file)
        return stat.isFile()
      })

      for (const file of rootFiles) {
        this.stats.totalFiles++

        if (!ALLOWED_ROOT_FILES.has(file)) {
          this.violations.push({
            type: 'root_file',
            file,
            message: `File "${file}" should not be in root folder`,
            suggestion: this.getFileSuggestion(file),
          })
          this.stats.violations++
        } else {
          this.stats.rootFiles++
        }
      }
    } catch (error) {
      this.log(`Error reading root directory: ${error.message}`, 'error')
    }
  }

  validateDomainStructure() {
    this.log('Checking domain-driven structure...')

    this.walkDirectory('src', filePath => {
      this.stats.totalFiles++

      // Skip entry points and type definitions
      if (filePath.match(/^(src\/main\.|src\/index\.|src\/vite-env\.d\.ts)/)) {
        return
      }

      const isInProperStructure = REQUIRED_DOMAIN_PATTERNS.some(pattern => pattern.test(filePath))

      if (!isInProperStructure) {
        this.violations.push({
          type: 'domain_structure',
          file: filePath,
          message: `File "${filePath}" does not follow domain structure`,
          suggestion: this.getDomainSuggestion(filePath),
        })
        this.stats.violations++
      } else {
        this.stats.domainFiles++
      }
    })
  }

  validateTestStructure() {
    this.log('Checking test file organization...')

    this.walkDirectory('tests', filePath => {
      this.stats.totalFiles++

      // Check if test files are in proper structure
      if (!filePath.match(/^tests\/(unit|integration|e2e)\//)) {
        this.warnings.push({
          type: 'test_structure',
          file: filePath,
          message: `Test file "${filePath}" should be in tests/unit/, tests/integration/, or tests/e2e/`,
          suggestion: 'Move to appropriate test directory',
        })
        this.stats.warnings++
      }
    })
  }

  walkDirectory(dirPath, callback) {
    if (!fs.existsSync(dirPath)) return

    const items = fs.readdirSync(dirPath)

    for (const item of items) {
      const fullPath = path.join(dirPath, item)
      const relativePath = path.relative('.', fullPath)

      if (this.isExcluded(relativePath)) continue

      const stat = fs.statSync(fullPath)

      if (stat.isDirectory()) {
        this.walkDirectory(fullPath, callback)
      } else if (stat.isFile()) {
        callback(relativePath)
      }
    }
  }

  getFileSuggestion(filename) {
    const ext = path.extname(filename).toLowerCase()
    const name = path.basename(filename, ext)

    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      if (name.includes('component') || name.includes('Component')) {
        return 'Move to src/domains/{domain}/components/'
      }
      if (name.includes('hook') || name.includes('Hook')) {
        return 'Move to src/domains/{domain}/hooks/'
      }
      if (name.includes('service') || name.includes('Service')) {
        return 'Move to src/domains/{domain}/services/'
      }
      if (name.includes('util') || name.includes('Util')) {
        return 'Move to src/domains/{domain}/utils/'
      }
      return 'Move to src/domains/{domain}/utils/'
    }

    if (
      [
        '.test.ts',
        '.test.tsx',
        '.test.js',
        '.test.jsx',
        '.spec.ts',
        '.spec.tsx',
        '.spec.js',
        '.spec.jsx',
      ].includes(ext)
    ) {
      return 'Move to src/domains/{domain}/__tests__/'
    }

    if (['.css', '.scss', '.less', '.styl'].includes(ext)) {
      return 'Move to src/ui/theme/ or src/domains/{domain}/components/'
    }

    if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
      return 'Move to src/ui/assets/ or public/assets/'
    }

    return 'Move to appropriate domain or core directory'
  }

  getDomainSuggestion(filePath) {
    const parts = filePath.split('/')
    const filename = parts[parts.length - 1]
    const ext = path.extname(filename).toLowerCase()

    if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
      if (filename.includes('component') || filename.includes('Component')) {
        return 'Move to src/domains/{domain}/components/'
      }
      if (filename.includes('hook') || filename.includes('Hook')) {
        return 'Move to src/domains/{domain}/hooks/'
      }
      if (filename.includes('service') || filename.includes('Service')) {
        return 'Move to src/domains/{domain}/services/'
      }
      if (filename.includes('util') || filename.includes('Util')) {
        return 'Move to src/domains/{domain}/utils/'
      }
      if (filename.includes('type') || filename.includes('Type')) {
        return 'Move to src/domains/{domain}/types/'
      }
      return 'Move to src/domains/{domain}/utils/'
    }

    if (
      [
        '.test.ts',
        '.test.tsx',
        '.test.js',
        '.test.jsx',
        '.spec.ts',
        '.spec.tsx',
        '.spec.js',
        '.spec.jsx',
      ].includes(ext)
    ) {
      return 'Move to src/domains/{domain}/__tests__/'
    }

    return 'Move to appropriate domain subdirectory'
  }

  generateReport() {
    console.log('\n' + '='.repeat(60))
    console.log('📊 FILE ORGANIZATION VALIDATION REPORT')
    console.log('='.repeat(60))

    console.log(`\n📈 Statistics:`)
    console.log(`   Total files checked: ${this.stats.totalFiles}`)
    console.log(`   Root files: ${this.stats.rootFiles}`)
    console.log(`   Domain files: ${this.stats.domainFiles}`)
    console.log(`   Violations: ${this.stats.violations}`)
    console.log(`   Warnings: ${this.stats.warnings}`)

    if (this.violations.length > 0) {
      console.log(`\n❌ VIOLATIONS (${this.violations.length}):`)
      this.violations.forEach((violation, index) => {
        console.log(`   ${index + 1}. ${violation.file}`)
        console.log(`      ${violation.message}`)
        console.log(`      💡 ${violation.suggestion}`)
        console.log('')
      })
    }

    if (this.warnings.length > 0) {
      console.log(`\n⚠️  WARNINGS (${this.warnings.length}):`)
      this.warnings.forEach((warning, index) => {
        console.log(`   ${index + 1}. ${warning.file}`)
        console.log(`      ${warning.message}`)
        console.log(`      💡 ${warning.suggestion}`)
        console.log('')
      })
    }

    if (this.violations.length === 0 && this.warnings.length === 0) {
      console.log('\n✅ All files are properly organized!')
      console.log('   Following domain-driven structure guidelines.')
    }

    console.log('\n📖 For more information, see AGENTS.md')
    console.log('='.repeat(60))
  }

  run() {
    this.log('Starting file organization validation...')

    try {
      this.validateRootFiles()
      this.validateDomainStructure()
      this.validateTestStructure()

      this.generateReport()

      // Exit with error code if there are violations
      if (this.violations.length > 0) {
        process.exit(1)
      }
    } catch (error) {
      this.log(`Validation failed: ${error.message}`, 'error')
      process.exit(1)
    }
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new FileOrganizationValidator()
  validator.run()
}

export default FileOrganizationValidator
