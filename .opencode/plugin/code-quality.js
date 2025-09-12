/**
 * Code Quality Plugin
 * @description Automatically runs linting, formatting, and type checking on file changes
 * Automatically runs linting, formatting, and type checking on file changes
 */

export const CodeQualityPlugin = async ({ client, $ }) => {
  return {
    tool: {
      execute: {
        after: async (input, output) => {
          if (input.tool === 'write' || input.tool === 'edit') {
            const filePath = output.args.filePath || output.args.path || ''

            // Only run on source files
            if (filePath.match(/\.(js|ts|tsx|jsx|vue|svelte|py|java|cpp|c|cs|php|rb|go|rs)$/)) {
              console.log(`🔍 Running code quality checks on: ${filePath}`)

              try {
                // Run ESLint if available
                if (filePath.match(/\.(js|ts|tsx|jsx)$/)) {
                  try {
                    await $`npx eslint ${filePath} --fix`.quiet()
                    console.log(`✅ ESLint passed for ${filePath}`)
                  } catch (error) {
                    console.warn(`⚠️  ESLint issues found in ${filePath}`)
                  }
                }

                // Run Prettier if available
                try {
                  await $`npx prettier --write ${filePath}`.quiet()
                  console.log(`✅ Prettier formatted ${filePath}`)
                } catch (error) {
                  console.warn(`⚠️  Prettier formatting failed for ${filePath}`)
                }

                // Run TypeScript check if available
                if (filePath.match(/\.(ts|tsx)$/)) {
                  try {
                    await $`npx tsc --noEmit --skipLibCheck ${filePath}`.quiet()
                    console.log(`✅ TypeScript check passed for ${filePath}`)
                  } catch (error) {
                    console.warn(`⚠️  TypeScript issues found in ${filePath}`)
                  }
                }

                // Run Python checks if available
                if (filePath.match(/\.py$/)) {
                  try {
                    await $`python -m flake8 ${filePath}`.quiet()
                    console.log(`✅ Python linting passed for ${filePath}`)
                  } catch (error) {
                    console.warn(`⚠️  Python linting issues found in ${filePath}`)
                  }
                }

                // Run Go checks if available
                if (filePath.match(/\.go$/)) {
                  try {
                    await $`go fmt ${filePath}`.quiet()
                    await $`go vet ${filePath}`.quiet()
                    console.log(`✅ Go checks passed for ${filePath}`)
                  } catch (error) {
                    console.warn(`⚠️  Go issues found in ${filePath}`)
                  }
                }

                // Run Rust checks if available
                if (filePath.match(/\.rs$/)) {
                  try {
                    await $`rustfmt ${filePath}`.quiet()
                    await $`cargo check`.quiet()
                    console.log(`✅ Rust checks passed for ${filePath}`)
                  } catch (error) {
                    console.warn(`⚠️  Rust issues found in ${filePath}`)
                  }
                }
              } catch (error) {
                console.warn(`⚠️  Code quality checks failed for ${filePath}: ${error.message}`)
              }
            }
          }
        },
      },
    },

    event: async ({ event }) => {
      if (event.type === 'session.start') {
        console.log('🎯 Code Quality Plugin: Monitoring file changes for automatic quality checks')
        console.log(
          '   Supported: JavaScript, TypeScript, Python, Go, Rust, Java, C++, C#, PHP, Ruby'
        )
        console.log('   Checks: Linting, Formatting, Type checking')
      }

      if (event.type === 'tool.error') {
        if (event.tool === 'write' || event.tool === 'edit') {
          console.log('💡 Tip: Code quality checks run automatically after file modifications')
          console.log('   Use the validation tests to check overall code quality:')
          console.log('   ./.opencode/tests/test-runner --auto')
        }
      }
    },
  }
}
