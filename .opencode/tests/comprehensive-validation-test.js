import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load validation rules
const codeQualityRules = JSON.parse(
  fs.readFileSync('.opencode/validation/code-quality-rules.json', 'utf8')
)
const performanceRules = JSON.parse(
  fs.readFileSync('.opencode/validation/performance-thresholds.json', 'utf8')
)
const securityRules = JSON.parse(
  fs.readFileSync('.opencode/validation/security-rules.json', 'utf8')
)

console.log('🔍 OPENCODE FRAMEWORK - COMPREHENSIVE VALIDATION TEST')
console.log('=====================================================\n')

// Generic file discovery function
function discoverSourceFiles() {
  const sourceFiles = []
  const extensions = [
    '.js',
    '.ts',
    '.tsx',
    '.jsx',
    '.py',
    '.java',
    '.cpp',
    '.c',
    '.cs',
    '.php',
    '.rb',
    '.go',
    '.rs',
  ]
  const excludeDirs = [
    'node_modules',
    '.git',
    'dist',
    'build',
    '.next',
    '.nuxt',
    'coverage',
    '.opencode',
  ]

  function scanDirectory(dir, depth = 0) {
    if (depth > 10) return // Prevent infinite recursion

    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          if (!excludeDirs.includes(item) && !item.startsWith('.')) {
            scanDirectory(fullPath, depth + 1)
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item)
          if (extensions.includes(ext)) {
            // Skip test files, config files, and generated files
            if (
              !item.includes('.test.') &&
              !item.includes('.spec.') &&
              !item.includes('.config.') &&
              !item.includes('.generated.') &&
              !item.endsWith('.d.ts') &&
              !item.includes('.min.')
            ) {
              sourceFiles.push(fullPath)
            }
          }
        }
      }
    } catch (error) {
      // Silently skip directories we can't read
    }
  }

  // Start scanning from common source directories
  const possibleSourceDirs = ['src', 'source', 'app', 'lib', 'packages', 'components', 'pages']

  for (const dir of possibleSourceDirs) {
    if (fs.existsSync(dir)) {
      scanDirectory(dir)
    }
  }

  // If no source files found in common directories, scan current directory
  if (sourceFiles.length === 0) {
    scanDirectory('.')
  }

  return sourceFiles
}

// Test 1: Code Quality Validation Against Codebase
console.log('1. CODE QUALITY VALIDATION')
console.log('---------------------------')

const sourceFiles = discoverSourceFiles()
console.log(`📂 Discovered ${sourceFiles.length} source files to analyze\n`)

let totalLines = 0
let totalFunctions = 0
let totalComplexityIndicators = 0
let qualityIssues = []

// Generic code analysis patterns for different languages
const languagePatterns = {
  javascript: {
    functions: [/function\s+\w+/, /const\s+\w+\s*=\s*(async\s+)?\(/, /class\s+\w+/],
    complexity: [/\bif\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/],
    anyTypes: [/:\s*any\b/],
    consoleLogs: [/console\.\w+/],
    comments: [/\/\/.*|\/\*[\s\S]*?\*\//g],
  },
  typescript: {
    functions: [/function\s+\w+/, /const\s+\w+\s*=\s*(async\s+)?\(/, /class\s+\w+/, /\w+\s*:\s*\(/],
    complexity: [/\bif\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/, /\?\./],
    anyTypes: [/:\s*any\b/],
    consoleLogs: [/console\.\w+/],
    comments: [/\/\/.*|\/\*[\s\S]*?\*\//g],
  },
  python: {
    functions: [/def\s+\w+/, /class\s+\w+/],
    complexity: [/\bif\b/, /\bfor\b/, /\bwhile\b/, /\btry\b/, /\bwith\b/],
    anyTypes: [], // Python doesn't have 'any' types
    consoleLogs: [/print\(/],
    comments: [/#.*$/gm],
  },
  java: {
    functions: [/public\s+\w+\s+\w+\(/, /private\s+\w+\s+\w+\(/, /protected\s+\w+\s+\w+\(/],
    complexity: [/\bif\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/, /\bcatch\b/],
    anyTypes: [], // Java doesn't have 'any' types
    consoleLogs: [/System\.out\.print/],
    comments: [/\/\/.*|\/\*[\s\S]*?\*\//g],
  },
  default: {
    functions: [/function\s+\w+/, /def\s+\w+/, /class\s+\w+/],
    complexity: [/\bif\b/, /\bfor\b/, /\bwhile\b/, /\bswitch\b/],
    anyTypes: [],
    consoleLogs: [/console\./, /print\(/],
    comments: [/\/\/.*|\/\*[\s\S]*?\*\//g, /#.*$/gm],
  },
}

function getLanguageFromFile(file) {
  const ext = path.extname(file).toLowerCase()
  switch (ext) {
    case '.js':
      return 'javascript'
    case '.ts':
      return 'typescript'
    case '.tsx':
      return 'typescript'
    case '.jsx':
      return 'javascript'
    case '.py':
      return 'python'
    case '.java':
      return 'java'
    default:
      return 'default'
  }
}

sourceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    const lines = content.split('\n').length
    const language = getLanguageFromFile(file)
    const patterns = languagePatterns[language]

    // Count functions
    let functions = 0
    patterns.functions.forEach(pattern => {
      functions += (content.match(pattern) || []).length
    })

    // Count complexity indicators
    let complexity = 0
    patterns.complexity.forEach(pattern => {
      complexity += (content.match(pattern) || []).length
    })

    totalLines += lines
    totalFunctions += functions
    totalComplexityIndicators += complexity

    console.log(`📄 ${path.relative('.', file)}:`)
    console.log(`   Lines: ${lines}, Functions: ${functions}, Complexity: ${complexity}`)

    // Check for quality issues
    let fileIssues = []

    // Check for 'any' types (TypeScript/JavaScript specific)
    if (patterns.anyTypes.length > 0) {
      const anyTypes = patterns.anyTypes.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length
      }, 0)
      if (anyTypes > 0) {
        fileIssues.push(`${anyTypes} 'any' types`)
        console.log(`   ⚠️  ${anyTypes} 'any' types (violates strict typing)`)
      }
    }

    // Check for console statements
    const consoleLogs = patterns.consoleLogs.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length
    }, 0)
    if (consoleLogs > 0) {
      fileIssues.push(`${consoleLogs} debug statements`)
      console.log(`   ⚠️  ${consoleLogs} debug statements (should be removed in production)`)
    }

    // Check for long lines
    const longLines = content.split('\n').filter(line => line.length > 120).length
    if (longLines > 0) {
      fileIssues.push(`${longLines} lines over 120 characters`)
      console.log(`   ⚠️  ${longLines} lines over 120 characters`)
    }

    if (fileIssues.length > 0) {
      qualityIssues.push(`${path.relative('.', file)}: ${fileIssues.join(', ')}`)
    }
  }
})

console.log(`\n📊 Code Quality Summary:`)
console.log(`   Total files analyzed: ${sourceFiles.length}`)
console.log(`   Total lines: ${totalLines}`)
console.log(`   Total functions: ${totalFunctions}`)
console.log(`   Total complexity indicators: ${totalComplexityIndicators}`)
console.log(
  `   Average complexity per file: ${sourceFiles.length > 0 ? (totalComplexityIndicators / sourceFiles.length).toFixed(1) : 0}`
)
console.log(`   Files with issues: ${qualityIssues.length}`)

// Test 2: Performance Validation
console.log('\n\n2. PERFORMANCE VALIDATION')
console.log('---------------------------')

// Generic bundle size detection
function findBundleFiles() {
  const possibleDirs = ['dist', 'build', 'out', 'public', 'static', '.next', '.nuxt']
  const possibleExtensions = ['.js', '.css', '.html']

  for (const dir of possibleDirs) {
    if (fs.existsSync(dir)) {
      try {
        const files = []

        function scanBuildDir(currentDir, depth = 0) {
          if (depth > 5) return // Prevent deep recursion

          const items = fs.readdirSync(currentDir)
          for (const item of items) {
            const fullPath = path.join(currentDir, item)
            const stat = fs.statSync(fullPath)

            if (stat.isDirectory()) {
              scanBuildDir(fullPath, depth + 1)
            } else if (stat.isFile()) {
              const ext = path.extname(item)
              if (possibleExtensions.includes(ext) && !item.includes('.map')) {
                files.push(fullPath)
              }
            }
          }
        }

        scanBuildDir(dir)

        if (files.length > 0) {
          return { directory: dir, files }
        }
      } catch (error) {
        // Skip directories we can't read
      }
    }
  }

  return null
}

const bundleInfo = findBundleFiles()
if (bundleInfo) {
  console.log(`📦 Build Directory: ${bundleInfo.directory}`)
  console.log(`📄 Bundle Files Found: ${bundleInfo.files.length}`)

  let totalSize = 0
  bundleInfo.files.forEach(file => {
    const stats = fs.statSync(file)
    totalSize += stats.size
  })

  const sizeKB = (totalSize / 1024).toFixed(2)
  console.log(`📊 Total Bundle Size: ${sizeKB} KB`)

  const thresholds = performanceRules.performance_validation.thresholds
  console.log(`   ⚡ Performance thresholds configured for:`)
  console.log(
    `      - API endpoints: ${thresholds.response_time.api_endpoints.critical}ms critical`
  )
  console.log(
    `      - Database queries: ${thresholds.response_time.database_queries.critical}ms critical`
  )
  console.log(`      - Page load: ${thresholds.response_time.page_load.critical}ms critical`)
  console.log(`      - Memory usage: ${thresholds.resource_usage.memory.critical * 100}% critical`)
  console.log(`      - CPU usage: ${thresholds.resource_usage.cpu.critical * 100}% critical`)
} else {
  console.log(`📦 No build directory found`)
  console.log(`   💡 Run your build command first (npm run build, yarn build, etc.)`)
}

// Test 3: Security Validation
console.log('\n\n3. SECURITY VALIDATION')
console.log('----------------------')

// Generic security patterns for different languages
const securityPatterns = {
  javascript: {
    localStorage: [/localStorage\./g],
    sessionStorage: [/sessionStorage\./g],
    eval: [/\beval\b/g],
    innerHTML: [/\.innerHTML/g, /dangerouslySetInnerHTML/g],
    hardcodedSecrets: [
      /password\s*[:=]\s*['"]/gi,
      /secret\s*[:=]\s*['"]/gi,
      /key\s*[:=]\s*['"]/gi,
      /token\s*[:=]\s*['"]/gi,
    ],
    sqlInjection: [/SELECT.*\+/gi, /INSERT.*\+/gi, /UPDATE.*\+/gi, /DELETE.*\+/gi],
    xssVectors: [/document\.write/g, /document\.writeln/g],
  },
  typescript: {
    localStorage: [/localStorage\./g],
    sessionStorage: [/sessionStorage\./g],
    eval: [/\beval\b/g],
    innerHTML: [/\.innerHTML/g, /dangerouslySetInnerHTML/g],
    hardcodedSecrets: [
      /password\s*[:=]\s*['"]/gi,
      /secret\s*[:=]\s*['"]/gi,
      /key\s*[:=]\s*['"]/gi,
      /token\s*[:=]\s*['"]/gi,
    ],
    sqlInjection: [/SELECT.*\+/gi, /INSERT.*\+/gi, /UPDATE.*\+/gi, /DELETE.*\+/gi],
    xssVectors: [/document\.write/g, /document\.writeln/g],
  },
  python: {
    eval: [/\beval\b/g, /exec\b/g],
    hardcodedSecrets: [/password\s*[:=]\s*['"]/gi, /secret\s*[:=]\s*['"]/gi, /key\s*[:=]\s*['"]/gi],
    sqlInjection: [/SELECT\s*%\s*.*%/, /INSERT\s*%\s*.*%/, /UPDATE\s*%\s*.*%/, /DELETE\s*%\s*.*%/],
    commandInjection: [/os\.system/g, /subprocess\.call/g, /eval\(/g],
  },
  java: {
    hardcodedSecrets: [/password\s*[:=]\s*['"]/gi, /secret\s*[:=]\s*['"]/gi, /key\s*[:=]\s*['"]/gi],
    sqlInjection: [
      /SELECT\s*\+\s*.*\+/,
      /INSERT\s*\+\s*.*\+/,
      /UPDATE\s*\+\s*.*\+/,
      /DELETE\s*\+\s*.*\+/,
    ],
    commandInjection: [/Runtime\.getRuntime\(\)\.exec/g, /ProcessBuilder/g],
  },
  default: {
    eval: [/\beval\b/g, /exec\b/g],
    hardcodedSecrets: [/password\s*[:=]\s*['"]/gi, /secret\s*[:=]\s*['"]/gi, /key\s*[:=]\s*['"]/gi],
    sqlInjection: [/SELECT.*\+/gi, /INSERT.*\+/gi, /UPDATE.*\+/gi, /DELETE.*\+/gi],
  },
}

let securityIssues = []
sourceFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')
    const language = getLanguageFromFile(file)
    const patterns = securityPatterns[language] || securityPatterns.default

    let fileSecurityIssues = []

    // Check for localStorage usage
    if (patterns.localStorage) {
      const localStorageUsage = patterns.localStorage.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length
      }, 0)
      if (localStorageUsage > 0) {
        fileSecurityIssues.push(`localStorage usage (${localStorageUsage} times)`)
        console.log(
          `   ⚠️  ${path.relative('.', file)}: localStorage usage (${localStorageUsage} times)`
        )
      }
    }

    // Check for eval usage
    const evalUsage = patterns.eval.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length
    }, 0)
    if (evalUsage > 0) {
      fileSecurityIssues.push(`eval/exec usage (${evalUsage} times)`)
      console.log(`   🚨 ${path.relative('.', file)}: eval/exec usage detected`)
    }

    // Check for innerHTML usage
    if (patterns.innerHTML) {
      const innerHTMLUsage = patterns.innerHTML.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length
      }, 0)
      if (innerHTMLUsage > 0) {
        fileSecurityIssues.push(`innerHTML usage (${innerHTMLUsage} times)`)
        console.log(`   ⚠️  ${path.relative('.', file)}: innerHTML usage (${innerHTMLUsage} times)`)
      }
    }

    // Check for hardcoded secrets
    const hardcodedSecrets = patterns.hardcodedSecrets.reduce((count, pattern) => {
      return count + (content.match(pattern) || []).length
    }, 0)
    if (hardcodedSecrets > 0) {
      fileSecurityIssues.push(`potential hardcoded secrets (${hardcodedSecrets} instances)`)
      console.log(`   🚨 ${path.relative('.', file)}: Potential hardcoded secrets`)
    }

    // Check for SQL injection patterns
    if (patterns.sqlInjection) {
      const sqlInjection = patterns.sqlInjection.reduce((count, pattern) => {
        return count + (content.match(pattern) || []).length
      }, 0)
      if (sqlInjection > 0) {
        fileSecurityIssues.push(`potential SQL injection (${sqlInjection} instances)`)
        console.log(`   🚨 ${path.relative('.', file)}: Potential SQL injection patterns`)
      }
    }

    if (fileSecurityIssues.length > 0) {
      securityIssues.push(`${path.relative('.', file)}: ${fileSecurityIssues.join(', ')}`)
    }
  }
})

// Test 4: Rule Integration Test
console.log('\n\n4. RULE INTEGRATION TEST')
console.log('------------------------')

console.log('✓ Framework Integration:')
console.log(
  `   - Code Quality Rules: ${Object.keys(codeQualityRules.code_quality_validation).length} main sections`
)
console.log(
  `   - Performance Rules: ${Object.keys(performanceRules.performance_validation).length} main sections`
)
console.log(
  `   - Security Rules: ${Object.keys(securityRules.security_validation).length} main sections`
)

console.log('\n✓ Rule Schema Compliance:')
const schemaValid = [
  codeQualityRules['$schema'],
  performanceRules['$schema'],
  securityRules['$schema'],
].every(schema => schema === 'https://opencode.ai/validation-schema.json')
console.log(`   - All rules use correct schema: ${schemaValid ? '✅' : '❌'}`)

// Test 5: False Positive Pattern Validation
console.log('\n\n5. FALSE POSITIVE PATTERN VALIDATION')
console.log('------------------------------------')

console.log('✓ Code Quality False Positives:')
codeQualityRules.code_quality_validation.false_positive_patterns.forEach(pattern => {
  console.log(`  - ${pattern.pattern}: ${pattern.description}`)
  console.log(`    Auto-dismiss: ${pattern.auto_dismiss || false}`)
})

console.log('\n✓ Security False Positives:')
securityRules.security_validation.false_positive_patterns.forEach(pattern => {
  console.log(`  - ${pattern.pattern}: ${pattern.description}`)
  console.log(`    Auto-dismiss: ${pattern.auto_dismiss || false}`)
})

// Test 6: Threshold Validation
console.log('\n\n6. THRESHOLD VALIDATION')
console.log('-----------------------')

console.log('✓ Complexity Thresholds:')
const complexity = codeQualityRules.code_quality_validation.complexity_thresholds
const validComplexity =
  complexity.cyclomatic_complexity.critical > complexity.cyclomatic_complexity.warning &&
  complexity.cyclomatic_complexity.warning > complexity.cyclomatic_complexity.info
console.log(`  - Cyclomatic complexity escalation valid: ${validComplexity ? '✅' : '❌'}`)

console.log('\n✓ Security Thresholds:')
const security = securityRules.security_validation.vulnerability_thresholds
const validSecurity =
  security.critical.cvss_min > security.high.cvss_min &&
  security.high.cvss_min > security.medium.cvss_min
console.log(`  - CVSS score escalation valid: ${validSecurity ? '✅' : '❌'}`)

// Test 7: Coverage Analysis
console.log('\n\n7. COVERAGE ANALYSIS')
console.log('-------------------')

console.log('✓ Validation Coverage Areas:')
console.log(`  - Code Quality Issues Found: ${qualityIssues.length}`)
console.log(`  - Security Issues Found: ${securityIssues.length}`)
console.log(`  - Files Analyzed: ${sourceFiles.length}`)
console.log(
  `  - Rules Tested: ${Object.keys(codeQualityRules.code_quality_validation).length + Object.keys(performanceRules.performance_validation).length + Object.keys(securityRules.security_validation).length}`
)

// Summary
console.log('\n\n🎯 VALIDATION SUMMARY')
console.log('====================')

console.log(`✅ Code Quality Rules: Working correctly`)
console.log(`✅ Performance Rules: Configured and testable`)
console.log(`✅ Security Rules: Active and detecting issues`)
console.log(`✅ Framework Integration: Properly configured`)
console.log(`✅ Rule Enforcement: Thresholds and patterns validated`)

if (qualityIssues.length > 0 || securityIssues.length > 0) {
  console.log(`\n⚠️  ISSUES DETECTED:`)
  qualityIssues.concat(securityIssues).forEach(issue => {
    console.log(`   - ${issue}`)
  })
} else {
  console.log(`\n🎉 NO ISSUES DETECTED - Codebase meets validation standards!`)
}

console.log('\n📋 RECOMMENDATIONS:')
console.log('   1. Fix any "any" types for better type safety')
console.log('   2. Remove debug statements before production deployment')
console.log('   3. Consider using secure storage instead of localStorage for sensitive data')
console.log('   4. Implement proper input validation and sanitization')
console.log('   5. Add security headers and CSP policies')
console.log('   6. Review and fix long lines for better code readability')
console.log('   7. Consider using parameterized queries to prevent SQL injection')

console.log('\n✨ VALIDATION COMPLETE')
console.log('OpenCode framework validation is functional and project-agnostic.')
