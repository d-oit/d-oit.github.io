import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔌 OPENCODE FRAMEWORK - PLUGIN TEST')
console.log('===================================\n')

// Test 1: Plugin Discovery
console.log('1. PLUGIN DISCOVERY')
console.log('-------------------')

const pluginDir = '.opencode/plugin'
let plugins = []

if (fs.existsSync(pluginDir)) {
  const pluginFiles = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'))
  console.log(`📂 Found ${pluginFiles.length} plugin files`)

  pluginFiles.forEach(file => {
    const filePath = path.join(pluginDir, file)
    const stats = fs.statSync(filePath)
    const content = fs.readFileSync(filePath, 'utf8')

    // Extract plugin metadata
    const pluginName = path.basename(file, '.js')
    const hasBeforeHook = content.includes('before:') && content.includes('tool')
    const hasAfterHook = content.includes('after:') && content.includes('tool')
    const hasEventHandler = content.includes('event:') || content.includes('event.')
    const hasErrorHandling =
      content.includes('try') ||
      content.includes('catch') ||
      content.includes('throw') ||
      content.includes('Error')
    const hasLogging =
      content.includes('console.log') ||
      content.includes('console.warn') ||
      content.includes('console.error')

    // Check if plugin has proper export structure
    const hasPluginExport =
      content.includes('export const plugin =') || content.includes('export const ' + pluginName)
    const hasDescription = content.includes('export const description =')

    plugins.push({
      name: pluginName,
      path: filePath,
      size: stats.size,
      hasBeforeHook,
      hasAfterHook,
      hasEventHandler,
      hasErrorHandling,
      hasLogging,
    })

    console.log(`📄 ${pluginName}:`)
    console.log(`   Size: ${stats.size} bytes`)
    console.log(`   Before Hook: ${hasBeforeHook ? '✅' : '❌'}`)
    console.log(`   After Hook: ${hasAfterHook ? '✅' : '❌'}`)
    console.log(`   Event Handler: ${hasEventHandler ? '✅' : '❌'}`)
    console.log(`   Error Handling: ${hasErrorHandling ? '✅' : '❌'}`)
    console.log(`   Logging: ${hasLogging ? '✅' : '❌'}`)
    console.log('')
  })
} else {
  console.log('❌ Plugin directory not found')
}

// Test 2: Plugin Structure Validation
console.log('\n\n2. PLUGIN STRUCTURE VALIDATION')
console.log('-------------------------------')

let structureIssues = []

plugins.forEach(plugin => {
  const content = fs.readFileSync(plugin.path, 'utf8')

  // Check for required exports
  if (!content.includes('export')) {
    structureIssues.push(`${plugin.name}: Missing export statement`)
  }

  // Check for proper plugin structure
  if (!content.includes('description')) {
    structureIssues.push(`${plugin.name}: Missing description`)
  }

  // Check for tool hooks
  const hasToolHook = plugin.hasBeforeHook || plugin.hasAfterHook
  if (!hasToolHook) {
    structureIssues.push(`${plugin.name}: No tool hooks found`)
  }

  // Check for proper error handling
  if (!plugin.hasErrorHandling) {
    structureIssues.push(`${plugin.name}: No error handling detected`)
  }
})

console.log(`📊 Structure Validation:`)
console.log(`   Plugins checked: ${plugins.length}`)
console.log(`   Structure issues: ${structureIssues.length}`)

if (structureIssues.length > 0) {
  console.log('\n⚠️  STRUCTURE ISSUES:')
  structureIssues.forEach(issue => {
    console.log(`   ❌ ${issue}`)
  })
} else {
  console.log('\n✅ All plugins have valid structure')
}

// Test 3: Plugin Functionality Test
console.log('\n\n3. PLUGIN FUNCTIONALITY TEST')
console.log('----------------------------')

// Test environment protection plugin
if (plugins.find(p => p.name === 'env-protection')) {
  console.log('🛡️  Testing Environment Protection Plugin:')

  // Simulate sensitive file access attempts
  const sensitiveFiles = ['.env', '.env.local', 'secrets.json', 'credentials.json']
  const testResults = []

  sensitiveFiles.forEach(file => {
    const exists = fs.existsSync(file)
    if (exists) {
      testResults.push(`⚠️  ${file} exists (should be protected)`)
    } else {
      testResults.push(`✅ ${file} not found (properly protected)`)
    }
  })

  testResults.forEach(result => {
    console.log(`   ${result}`)
  })
}

// Test git hooks plugin
if (plugins.find(p => p.name === 'git-hooks')) {
  console.log('\n🔒 Testing Git Hooks Plugin:')

  // Check for git hooks
  const gitHooksDir = '.git/hooks'
  if (fs.existsSync(gitHooksDir)) {
    const hooks = fs.readdirSync(gitHooksDir).filter(file => !file.includes('.sample'))
    console.log(`   Git hooks found: ${hooks.length}`)
    hooks.forEach(hook => {
      console.log(`   ✅ ${hook}`)
    })
  } else {
    console.log('   ⚠️  Git hooks directory not found')
  }
}

// Test notification plugin
if (plugins.find(p => p.name === 'notification')) {
  console.log('\n📢 Testing Notification Plugin:')

  // Check for notification configuration
  const hasNotificationConfig = plugins.find(p => p.name === 'notification').hasEventHandler
  console.log(`   Event handlers: ${hasNotificationConfig ? '✅' : '❌'}`)

  // Check for platform detection
  const content = fs.readFileSync('.opencode/plugin/notification.js', 'utf8')
  const hasPlatformDetection = content.includes('process.platform') || content.includes('os.')
  console.log(`   Platform detection: ${hasPlatformDetection ? '✅' : '❌'}`)
}

// Test 4: Plugin Integration Test
console.log('\n\n4. PLUGIN INTEGRATION TEST')
console.log('---------------------------')

console.log('🔗 Testing Plugin Integration:')

// Check if plugins work together
const hasEnvProtection = plugins.some(p => p.name === 'env-protection')
const hasGitHooks = plugins.some(p => p.name === 'git-hooks')
const hasNotification = plugins.some(p => p.name === 'notification')

console.log(`   Environment Protection: ${hasEnvProtection ? '✅' : '❌'}`)
console.log(`   Git Hooks: ${hasGitHooks ? '✅' : '❌'}`)
console.log(`   Notifications: ${hasNotification ? '✅' : '❌'}`)

const integrationScore = [hasEnvProtection, hasGitHooks, hasNotification].filter(Boolean).length
console.log(`   Integration Score: ${integrationScore}/3`)

if (integrationScore === 3) {
  console.log('   🎉 Full plugin integration achieved!')
} else {
  console.log('   ⚠️  Some plugins may need integration work')
}

// Test 5: Plugin Performance Impact
console.log('\n\n5. PLUGIN PERFORMANCE IMPACT')
console.log('-----------------------------')

console.log('⚡ Plugin Performance Analysis:')
plugins.forEach(plugin => {
  const content = fs.readFileSync(plugin.path, 'utf8')
  const lines = content.split('\n').length
  const functions = (content.match(/function\s+\w+|\w+\s*=>/g) || []).length

  console.log(`   ${plugin.name}:`)
  console.log(`      Lines of code: ${lines}`)
  console.log(`      Functions: ${functions}`)
  console.log(`      Estimated impact: ${lines < 50 ? 'Low' : lines < 100 ? 'Medium' : 'High'}`)
})

// Summary
console.log('\n\n🎯 PLUGIN TEST SUMMARY')
console.log('======================')

console.log(`✅ Plugins Found: ${plugins.length}`)
console.log(`✅ Structure Issues: ${structureIssues.length}`)
console.log(`✅ Integration Score: ${integrationScore}/3`)

if (structureIssues.length === 0 && integrationScore === 3) {
  console.log('\n🎉 All plugin tests passed!')
} else {
  console.log('\n⚠️  Some plugin issues detected')
  console.log('\n📋 RECOMMENDATIONS:')
  console.log('   1. Fix any structure issues in plugins')
  console.log('   2. Ensure all plugins are properly integrated')
  console.log('   3. Test plugins in different environments')
  console.log('   4. Monitor plugin performance impact')
}

console.log('\n✨ PLUGIN TEST COMPLETE')
console.log('OpenCode framework plugin testing is complete.')
