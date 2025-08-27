/**
 * ESLint Plugin for File Organization
 * Prevents creation of files in the root folder and enforces domain-driven structure
 */

const path = require('path')

// Allowed files in root folder
const ALLOWED_ROOT_FILES = new Set([
  'index.html',
  'package.json',
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

module.exports = {
  rules: {
    'no-root-files': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Prevent creation of files in the root folder',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [],
      },

      create(context) {
        const filename = context.getFilename()
        const relativePath = path.relative(process.cwd(), filename)
        const isInRoot = !relativePath.includes(path.sep)

        // Skip if file is in allowed list
        if (isInRoot && ALLOWED_ROOT_FILES.has(path.basename(filename))) {
          return {}
        }

        // Check if file is in root folder
        if (isInRoot) {
          return {
            Program(node) {
              context.report({
                node,
                message:
                  `File "${relativePath}" should not be created in the root folder. ` +
                  `Follow domain-driven structure: place source files in src/domains/{domain}/, ` +
                  `tests in tests/, and configuration in src/core/config/. ` +
                  `See AGENTS.md for detailed file organization guidelines.`,
                loc: { line: 1, column: 0 },
              })
            },
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
              Program(node) {
                context.report({
                  node,
                  message:
                    `File "${relativePath}" should follow domain-driven structure. ` +
                    `Place files in appropriate domain folders like: ` +
                    `src/domains/{domain}/components/, src/domains/shared/, ` +
                    `src/core/utils/, src/ui/components/, etc. ` +
                    `See AGENTS.md for complete structure guidelines.`,
                  loc: { line: 1, column: 0 },
                })
              },
            }
          }
        }

        return {}
      },
    },

    'require-domain-structure': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Enforce domain-driven file structure',
          category: 'Best Practices',
          recommended: true,
        },
        fixable: null,
        schema: [],
      },

      create(context) {
        const filename = context.getFilename()
        const relativePath = path.relative(process.cwd(), filename)

        // Only check source files
        if (!relativePath.startsWith('src/') || relativePath.includes('node_modules')) {
          return {}
        }

        // Skip entry points and type definitions
        if (relativePath.match(/^(src\/main\.|src\/index\.|src\/vite-env\.d\.ts)/)) {
          return {}
        }

        // Check if file follows proper domain structure
        const isInProperStructure = REQUIRED_DOMAIN_PATTERNS.some(pattern =>
          pattern.test(relativePath)
        )

        if (!isInProperStructure) {
          return {
            Program(node) {
              context.report({
                node,
                message:
                  `File structure violation: "${relativePath}". ` +
                  `All source files must be organized in domain folders. ` +
                  `Use: src/domains/{domain}/components/, src/domains/shared/, ` +
                  `src/core/utils/, src/ui/components/, etc.`,
                loc: { line: 1, column: 0 },
              })
            },
          }
        }

        return {}
      },
    },
  },
}
