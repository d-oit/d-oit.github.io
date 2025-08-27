import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('📋 OPENCODE FRAMEWORK - VALIDATION RULES TEST')
console.log('=============================================\n')

// Test 1: Validation Rules File Structure
console.log('1. VALIDATION RULES FILE STRUCTURE')
console.log('-----------------------------------')

const validationFiles = [
  '.opencode/validation/code-quality-rules.json',
  '.opencode/validation/performance-thresholds.json',
  '.opencode/validation/security-rules.json',
]

let validationStructure = []
let schemaIssues = []

validationFiles.forEach(file => {
  if (fs.existsSync(file)) {
    try {
      const rules = JSON.parse(fs.readFileSync(file, 'utf8'))
      const stats = fs.statSync(file)

      // Analyze structure
      const mainSections = Object.keys(rules).filter(key => key !== '$schema')
      const hasSchema = !!rules['$schema']
      const isValidSchema = rules['$schema'] === 'https://opencode.ai/validation-schema.json'

      validationStructure.push({
        file: path.basename(file),
        size: stats.size,
        mainSections: mainSections.length,
        sections: mainSections,
        hasSchema,
        isValidSchema,
        rules: rules,
      })

      console.log(`📄 ${path.basename(file)}:`)
      console.log(`   Size: ${stats.size} bytes`)
      console.log(`   Main sections: ${mainSections.length}`)
      console.log(`   Schema present: ${hasSchema ? '✅' : '❌'}`)
      console.log(`   Schema valid: ${isValidSchema ? '✅' : '❌'}`)

      if (mainSections.length > 0) {
        console.log(`   Sections: ${mainSections.join(', ')}`)
      }

      if (!isValidSchema) {
        schemaIssues.push(`${path.basename(file)}: Invalid or missing schema`)
      }
    } catch (error) {
      console.log(`❌ ${path.basename(file)}: JSON parsing error - ${error.message}`)
      schemaIssues.push(`${path.basename(file)}: JSON parsing error`)
    }
  } else {
    console.log(`❌ ${path.basename(file)}: File not found`)
    schemaIssues.push(`${path.basename(file)}: File not found`)
  }
  console.log('')
})

// Test 2: Code Quality Rules Validation
console.log('\n\n2. CODE QUALITY RULES VALIDATION')
console.log('----------------------------------')

const codeQualityRules = validationStructure.find(v => v.file === 'code-quality-rules.json')
if (codeQualityRules) {
  const rules = codeQualityRules.rules

  console.log('🔍 Analyzing Code Quality Rules:')

  // Check complexity thresholds
  if (rules.code_quality_validation?.complexity_thresholds) {
    const thresholds = rules.code_quality_validation.complexity_thresholds
    console.log('\n📊 Complexity Thresholds:')

    const critical = thresholds.cyclomatic_complexity?.critical
    const warning = thresholds.cyclomatic_complexity?.warning
    const info = thresholds.cyclomatic_complexity?.info

    const validEscalation = critical > warning && warning > info
    console.log(`   Cyclomatic complexity (C/W/I): ${critical}/${warning}/${info}`)
    console.log(`   Valid escalation: ${validEscalation ? '✅' : '❌'}`)

    if (!validEscalation) {
      schemaIssues.push('Code Quality: Invalid complexity threshold escalation')
    }
  }

  // Check false positive patterns
  if (rules.code_quality_validation?.false_positive_patterns) {
    const patterns = rules.code_quality_validation.false_positive_patterns
    console.log(`\n🎯 False Positive Patterns: ${patterns.length}`)

    patterns.forEach(pattern => {
      console.log(`   - ${pattern.pattern}: ${pattern.description}`)
      console.log(`     Auto-dismiss: ${pattern.auto_dismiss || false}`)
    })
  }
}

// Test 3: Performance Rules Validation
console.log('\n\n3. PERFORMANCE RULES VALIDATION')
console.log('-------------------------------')

const performanceRules = validationStructure.find(v => v.file === 'performance-thresholds.json')
if (performanceRules) {
  const rules = performanceRules.rules

  console.log('⚡ Analyzing Performance Rules:')

  // Check response time thresholds
  if (rules.performance_validation?.thresholds?.response_time) {
    const responseTime = rules.performance_validation.thresholds.response_time
    console.log('\n⏱️  Response Time Thresholds:')

    Object.entries(responseTime).forEach(([key, thresholds]) => {
      // For response times, lower values are more critical (200ms critical < 500ms warning < 1000ms info)
      const valid = thresholds.critical < thresholds.warning && thresholds.warning < thresholds.info
      console.log(
        `   ${key}: ${thresholds.critical}ms/${thresholds.warning}ms/${thresholds.info}ms - ${valid ? '✅' : '❌'}`
      )

      if (!valid) {
        schemaIssues.push(`Performance: Invalid ${key} threshold escalation`)
      }
    })
  }

  // Check resource usage thresholds
  if (rules.performance_validation?.thresholds?.resource_usage) {
    const resourceUsage = rules.performance_validation.thresholds.resource_usage
    console.log('\n💻 Resource Usage Thresholds:')

    Object.entries(resourceUsage).forEach(([resource, thresholds]) => {
      const valid = thresholds.critical > thresholds.warning && thresholds.warning > thresholds.info
      const criticalPercent = (thresholds.critical * 100).toFixed(0)
      const warningPercent = (thresholds.warning * 100).toFixed(0)
      const infoPercent = (thresholds.info * 100).toFixed(0)
      console.log(
        `   ${resource}: ${criticalPercent}%/${warningPercent}%/${infoPercent}% - ${valid ? '✅' : '❌'}`
      )

      if (!valid) {
        schemaIssues.push(`Performance: Invalid ${resource} threshold escalation`)
      }
    })
  }
}

// Test 4: Security Rules Validation
console.log('\n\n4. SECURITY RULES VALIDATION')
console.log('----------------------------')

const securityRules = validationStructure.find(v => v.file === 'security-rules.json')
if (securityRules) {
  const rules = securityRules.rules

  console.log('🔒 Analyzing Security Rules:')

  // Check vulnerability thresholds
  if (rules.security_validation?.vulnerability_thresholds) {
    const vulnThresholds = rules.security_validation.vulnerability_thresholds
    console.log('\n🚨 Vulnerability Thresholds:')

    Object.entries(vulnThresholds).forEach(([level, config]) => {
      const valid = config.cvss_min >= 0 && config.cvss_min <= 10
      console.log(
        `   ${level}: CVSS ≥${config.cvss_min}, Exploit prob ≥${config.exploit_probability_min} - ${valid ? '✅' : '❌'}`
      )

      if (!valid) {
        schemaIssues.push(`Security: Invalid ${level} CVSS threshold`)
      }
    })
  }

  // Check false positive patterns
  if (rules.security_validation?.false_positive_patterns) {
    const patterns = rules.security_validation.false_positive_patterns
    console.log(`\n🛡️  Security False Positive Patterns: ${patterns.length}`)

    patterns.forEach(pattern => {
      console.log(`   - ${pattern.pattern}: ${pattern.description}`)
      console.log(`     Auto-dismiss: ${pattern.auto_dismiss || false}`)
    })
  }
}

// Test 5: Cross-Rules Consistency
console.log('\n\n5. CROSS-RULES CONSISTENCY')
console.log('---------------------------')

console.log('🔄 Checking Rule Consistency:')

// Check if all rules have consistent structure
const allHaveSchema = validationStructure.every(v => v.hasSchema && v.isValidSchema)
console.log(`   All rules have valid schema: ${allHaveSchema ? '✅' : '❌'}`)

const allHaveMainSections = validationStructure.every(v => v.mainSections > 0)
console.log(`   All rules have main sections: ${allHaveMainSections ? '✅' : '❌'}`)

// Check for consistent naming
const sectionNames = validationStructure.flatMap(v => v.sections)
const uniqueSections = [...new Set(sectionNames)]
console.log(`   Unique section names: ${uniqueSections.length}`)
console.log(`   Total section references: ${sectionNames.length}`)

// Test 6: Rule Effectiveness Validation
console.log('\n\n6. RULE EFFECTIVENESS VALIDATION')
console.log('---------------------------------')

console.log('🎯 Testing Rule Effectiveness:')

// Test code quality rules against sample code
const sampleCode = `
function testFunction() {
  if (condition1) {
    if (condition2) {
      if (condition3) {
        console.log('deep nesting')
      }
    }
  }
}
`

// Simple complexity analysis
const ifStatements = (sampleCode.match(/\bif\b/g) || []).length
console.log(`   Sample code complexity: ${ifStatements} if statements`)

if (codeQualityRules) {
  const thresholds = codeQualityRules.rules.code_quality_validation?.complexity_thresholds
  if (thresholds) {
    const nestingLimit = thresholds.nesting_depth?.critical || 6
    console.log(`   Nesting threshold: ${nestingLimit}`)
    console.log(`   Sample within limit: ${ifStatements <= nestingLimit ? '✅' : '❌'}`)
  }
}

// Test 7: Configuration Completeness
console.log('\n\n7. CONFIGURATION COMPLETENESS')
console.log('-----------------------------')

console.log('📋 Configuration Completeness Check:')

const requiredSections = {
  'code-quality-rules.json': ['code_quality_validation'],
  'performance-thresholds.json': ['performance_validation'],
  'security-rules.json': ['security_validation'],
}

let completenessIssues = []

Object.entries(requiredSections).forEach(([file, sections]) => {
  const fileConfig = validationStructure.find(v => v.file === file)
  if (fileConfig) {
    sections.forEach(section => {
      const hasSection = fileConfig.sections.includes(section)
      console.log(`   ${file} → ${section}: ${hasSection ? '✅' : '❌'}`)

      if (!hasSection) {
        completenessIssues.push(`${file}: Missing ${section} section`)
      }
    })
  }
})

// Summary
console.log('\n\n🎯 VALIDATION RULES TEST SUMMARY')
console.log('=================================')

console.log(`✅ Files analyzed: ${validationStructure.length}`)
console.log(`✅ Schema issues: ${schemaIssues.length}`)
console.log(`✅ Completeness issues: ${completenessIssues.length}`)

const totalIssues = schemaIssues.length + completenessIssues.length
if (totalIssues === 0) {
  console.log('\n🎉 All validation rules tests passed!')
} else {
  console.log('\n⚠️  Issues detected:')
  if (schemaIssues.length > 0) {
    console.log('\n📋 Schema Issues:')
    schemaIssues.forEach(issue => {
      console.log(`   ❌ ${issue}`)
    })
  }
  if (completenessIssues.length > 0) {
    console.log('\n📋 Completeness Issues:')
    completenessIssues.forEach(issue => {
      console.log(`   ❌ ${issue}`)
    })
  }
}

console.log('\n📋 RECOMMENDATIONS:')
console.log('   1. Ensure all validation files have correct schema')
console.log('   2. Verify threshold escalations are logical (Critical > Warning > Info)')
console.log('   3. Add missing required sections to validation files')
console.log('   4. Test rules against sample code for effectiveness')
console.log('   5. Validate rules in different environments')

console.log('\n✨ VALIDATION RULES TEST COMPLETE')
console.log('OpenCode framework validation rules testing is complete.')
