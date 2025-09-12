/**
 * File Organization Enforcement Plugin
 * @description Prevents creation of files in the root folder and enforces domain-driven structure
 * Prevents creation of files in the root folder and enforces domain-driven structure
 */

const path = require('path')

// Allowed files in root folder
const ALLOWED_ROOT_FILES = new Set([
  'index.html',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
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
   'opencode.json',
])

// Required domain structure patterns
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
]

export const FileOrganizationPlugin = async () => {
  const validateFileLocation = filePath => {
    const relativePath = path.relative(process.cwd(), filePath)
    const isInRoot = !relativePath.includes(path.sep)

    // Skip if file is in allowed list
    if (isInRoot && ALLOWED_ROOT_FILES.has(path.basename(filePath))) {
      return { valid: true }
    }

    // Check if file is in root folder
    if (isInRoot) {
      return {
        valid: false,
        error: `File "${relativePath}" should not be created in the root folder.`,
        suggestion: getFileSuggestion(filePath),
      }
    }

    // Check if source files follow domain structure
    if (
      relativePath.startsWith('src/') &&
      !relativePath.startsWith('src/main.') &&
      !relativePath.startsWith('src/index.') &&
      !relativePath.startsWith('src/vite-env.d.ts')
    ) {
      const isInDomainStructure = REQUIRED_DOMAIN_PATTERNS.some(pattern =>
        pattern.test(relativePath)
      )

      if (!isInDomainStructure) {
        return {
          valid: false,
          error: `File "${relativePath}" does not follow domain structure.`,
          suggestion: getDomainSuggestion(relativePath),
        }
      }
    }

    return { valid: true }
  }

  const getFileSuggestion = filePath => {
    const ext = path.extname(filePath).toLowerCase()
    const name = path.basename(filePath, ext)

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

  const getDomainSuggestion = filePath => {
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

  return {
    tool: {
      execute: {
        before: async (input, output) => {
          // Intercept file creation operations
          if (input.tool === 'write' && output.args?.filePath) {
            const filePath = output.args.filePath
            const validation = validateFileLocation(filePath)

            if (!validation.valid) {
              throw new Error(
                `🚫 File Organization Violation: ${validation.error}\n` +
                  `💡 Suggestion: ${validation.suggestion}\n` +
                  `📖 See AGENTS.md for complete file organization guidelines.`
              )
            }
          }

          // Intercept bash commands that might create files
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command

            // Check for file creation commands
            if (
              command.includes('touch ') ||
              command.includes('> ') ||
              command.includes('>> ') ||
              command.includes('mkdir ')
            ) {
              // Extract potential file paths from the command
              const fileMatches = command.match(/(?:touch|>|>>)\s+([^&\s|]+)/g)
              if (fileMatches) {
                for (const match of fileMatches) {
                  const filePath = match.replace(/^(?:touch|>|>>)\s+/, '').trim()
                  if (filePath && !filePath.startsWith('-')) {
                    const validation = validateFileLocation(filePath)
                    if (!validation.valid) {
                      throw new Error(
                        `🚫 File Organization Violation: ${validation.error}\n` +
                          `💡 Suggestion: ${validation.suggestion}\n` +
                          `📖 See AGENTS.md for complete file organization guidelines.`
                      )
                    }
                  }
                }
              }
            }
          }
        },

        after: async (input, output) => {
          // Validate files after creation
          if (input.tool === 'write' && output.args.filePath && !output.error) {
            const filePath = output.args.filePath
            const validation = validateFileLocation(filePath)

            if (!validation.valid) {
              console.warn(`⚠️  File created in non-standard location: ${filePath}`)
              console.warn(`💡 Consider moving to: ${validation.suggestion}`)
            } else {
              console.log(`✅ File created in proper location: ${filePath}`)
            }
          }
        },
      },
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        console.log('📁 File Organization Plugin: Enforcing domain-driven structure')
        console.log('   Preventing root folder pollution and ensuring proper file placement')
        console.log('   See AGENTS.md for complete file organization guidelines')
      }

      if (event.type === 'tool.error') {
        if (event.error && event.error.message.includes('File Organization Violation')) {
          console.log('💡 Tip: Follow the domain-driven structure outlined in AGENTS.md')
          console.log(
            '   Use src/domains/{domain}/ for business logic and src/core/ for framework code'
          )
        }
      }
    },
  }
}
