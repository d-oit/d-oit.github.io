import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import https from 'https'
import http from 'http'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔗 OPENCODE FRAMEWORK - LINK VALIDATION TEST')
console.log('=============================================\n')

// Test 1: Placeholder Link Detection
console.log('1. PLACEHOLDER LINK DETECTION')
console.log('------------------------------')

function findMarkdownFiles() {
  const markdownFiles = []

  function scanDirectory(dir, depth = 0) {
    if (depth > 10) return // Prevent infinite recursion

    try {
      const items = fs.readdirSync(dir)

      for (const item of items) {
        const fullPath = path.join(dir, item)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          const excludeDirs = [
            'node_modules',
            '.git',
            'dist',
            'build',
            '.next',
            '.nuxt',
            'coverage',
          ]
          if (!excludeDirs.includes(item) && !item.startsWith('.')) {
            scanDirectory(fullPath, depth + 1)
          }
        } else if (stat.isFile() && item.endsWith('.md')) {
          markdownFiles.push(fullPath)
        }
      }
    } catch (error) {
      // Silently skip directories we can't read
    }
  }

  scanDirectory('.')
  return markdownFiles
}

const markdownFiles = findMarkdownFiles()
console.log(`📄 Found ${markdownFiles.length} markdown files to analyze\n`)

let placeholderLinks = []
let totalLinks = 0

// Placeholder patterns to detect (more specific)
const placeholderPatterns = [
  /https?:\/\/github\.com\/\{[^}]+\}/gi, // {your-org} patterns
  /https?:\/\/github\.com\/your-org\b/gi, // your-org (word boundary)
  /https?:\/\/github\.com\/your-username\b/gi, // your-username (word boundary)
  /https?:\/\/github\.com\/your-repository\b/gi, // your-repository (word boundary)
  /https?:\/\/your-domain\.com/gi, // your-domain patterns
  /https?:\/\/example\.com/gi, // example.com patterns
  /https?:\/\/localhost\b/gi, // localhost (word boundary)
  /https?:\/\/127\.0\.0\.1\b/gi, // localhost IP (word boundary)
  /https?:\/\/0\.0\.0\.0\b/gi, // 0.0.0.0 (word boundary)
]

markdownFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8')

    // Find all markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    let match
    while ((match = linkRegex.exec(content)) !== null) {
      totalLinks++
      const linkText = match[1]
      const linkUrl = match[2]

      // Check for placeholder patterns
      placeholderPatterns.forEach(pattern => {
        if (pattern.test(linkUrl)) {
          placeholderLinks.push({
            file: path.relative('.', file),
            text: linkText,
            url: linkUrl,
            pattern: pattern.source,
          })
        }
      })
    }
  }
})

console.log(`📊 Link Analysis Results:`)
console.log(`   Total links found: ${totalLinks}`)
console.log(`   Placeholder links detected: ${placeholderLinks.length}`)

if (placeholderLinks.length > 0) {
  console.log('\n⚠️  PLACEHOLDER LINKS FOUND:')
  placeholderLinks.forEach(link => {
    console.log(`   📄 ${link.file}:`)
    console.log(`      Text: "${link.text}"`)
    console.log(`      URL: ${link.url}`)
    console.log(`      Pattern: ${link.pattern}`)
    console.log('')
  })
} else {
  console.log('\n✅ No placeholder links detected')
}

// Test 2: External Link Validation
console.log('\n\n2. EXTERNAL LINK VALIDATION')
console.log('----------------------------')

function checkUrl(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https://') ? https : http
    const req = client.request(url, { method: 'HEAD' }, (res) => {
      resolve({ url, status: res.statusCode, ok: res.statusCode < 400 })
    })
    req.on('error', () => resolve({ url, status: 'ERROR', ok: false }))
    req.setTimeout(5000, () => {
      req.destroy()
      resolve({ url, status: 'TIMEOUT', ok: false })
    })
    req.end()
  })
}

async function validateExternalLinks() {
  const externalLinks = []
  
  markdownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let match
      while ((match = linkRegex.exec(content)) !== null) {
        const linkUrl = match[2]
        if (linkUrl.startsWith('http://') || linkUrl.startsWith('https://')) {
          externalLinks.push({
            file: path.relative('.', file),
            text: match[1],
            url: linkUrl
          })
        }
      }
    }
  })
  
  if (externalLinks.length === 0) {
    console.log('ℹ️  No external links found to validate')
    return []
  }
  
  console.log(`🔍 Checking ${externalLinks.length} external links...`)
  
  const results = []
  for (const link of externalLinks) {
    const result = await checkUrl(link.url)
    results.push({ ...link, ...result })
    process.stdout.write('.')
  }
  console.log('\n')
  
  return results
}

// Check if external validation is enabled
const enableExternalCheck = process.env.ENABLE_EXTERNAL_LINK_CHECK === 'true'

if (enableExternalCheck) {
  console.log('ℹ️  External link validation enabled')
  console.log('   ⚠️  This will make HTTP requests and may be slow')
  
  // Run external validation
  validateExternalLinks().then(results => {
    const broken = results.filter(r => !r.ok)
    
    if (broken.length > 0) {
      console.log('❌ BROKEN EXTERNAL LINKS:')
      broken.forEach(link => {
        console.log(`   📄 ${link.file}:`)
        console.log(`      Text: "${link.text}"`)
        console.log(`      URL: ${link.url}`)
        console.log(`      Status: ${link.status}`)
        console.log('')
      })
    } else {
      console.log('✅ All external links are accessible')
    }
    
    console.log(`📊 External links summary: ${results.length} checked, ${broken.length} broken`)
    
    // Continue with internal validation
    continueValidation(broken.length > 0)
  }).catch(error => {
    console.error('❌ Error during external link validation:', error.message)
    continueValidation(true)
  })
} else {
  console.log('ℹ️  External link validation is disabled by default')
  console.log('   💡 To enable, set ENABLE_EXTERNAL_LINK_CHECK=true')
  console.log('   ⚠️  Note: This will make HTTP requests and may be slow')
  console.log('\n⏭️  Skipping external link validation')
  continueValidation(false)
}

function continueValidation(hasExternalErrors) {
  // Test 3: Internal Link Validation
  console.log('\n\n3. INTERNAL LINK VALIDATION')
  console.log('----------------------------')

  let brokenInternalLinks = []

  markdownFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const fileDir = path.dirname(file)

      // Find relative links
      const relativeLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
      let match
      while ((match = relativeLinkRegex.exec(content)) !== null) {
        const linkText = match[1]
        const linkUrl = match[2]

        // Check relative links (not starting with http/https)
        if (
          !linkUrl.startsWith('http://') &&
          !linkUrl.startsWith('https://') &&
          !linkUrl.startsWith('#')
        ) {
          // Resolve the relative path
          const resolvedPath = path.resolve(fileDir, linkUrl)

          // Check if the target exists
          let targetExists = false
          try {
            // Handle different link types
            if (linkUrl.endsWith('.md')) {
              targetExists = fs.existsSync(resolvedPath)
            } else if (linkUrl.includes('#')) {
              // Section links - just check if the file exists
              const filePath = resolvedPath.split('#')[0]
              targetExists = fs.existsSync(filePath)
            } else {
              // Other file types
              targetExists = fs.existsSync(resolvedPath)
            }
          } catch (error) {
            targetExists = false
          }

          if (!targetExists) {
            brokenInternalLinks.push({
              file: path.relative('.', file),
              text: linkText,
              url: linkUrl,
              resolvedPath: path.relative('.', resolvedPath),
            })
          }
        }
      }
    }
  })

  console.log(`📊 Internal Link Validation:`)
  console.log(`   Broken internal links: ${brokenInternalLinks.length}`)

  if (brokenInternalLinks.length > 0) {
    console.log('\n❌ BROKEN INTERNAL LINKS:')
    brokenInternalLinks.forEach(link => {
      console.log(`   📄 ${link.file}:`)
      console.log(`      Text: "${link.text}"`)
      console.log(`      URL: ${link.url}`)
      console.log(`      Expected: ${link.resolvedPath}`)
      console.log('')
    })
  } else {
    console.log('\n✅ All internal links are valid')
  }

  // Test 4: Documentation Completeness
  console.log('\n\n4. DOCUMENTATION COMPLETENESS')
  console.log('----------------------------')

  const requiredDocs = [
    'README.md',
    '.opencode/docs/GETTING-STARTED.md',
    '.opencode/docs/TEMPLATE-USAGE.md',
    '.opencode/docs/TROUBLESHOOTING.md',
  ]

  let missingDocs = []
  requiredDocs.forEach(doc => {
    if (!fs.existsSync(doc)) {
      missingDocs.push(doc)
    }
  })

  console.log(`📊 Documentation Check:`)
  console.log(`   Required docs: ${requiredDocs.length}`)
  console.log(`   Missing docs: ${missingDocs.length}`)

  if (missingDocs.length > 0) {
    console.log('\n📝 MISSING DOCUMENTATION:')
    missingDocs.forEach(doc => {
      console.log(`   ❌ ${doc}`)
    })
  } else {
    console.log('\n✅ All required documentation is present')
  }

  // Summary
  console.log('\n\n🎯 LINK VALIDATION SUMMARY')
  console.log('===========================')

  const placeholderIssues = placeholderLinks.length > 0
  const internalIssues = brokenInternalLinks.length > 0
  const docIssues = missingDocs.length > 0
  const externalIssues = hasExternalErrors

  console.log(`✅ Placeholder Links: ${placeholderIssues ? 'ISSUES FOUND' : 'PASSED'}`)
  console.log(`✅ Internal Links: ${internalIssues ? 'ISSUES FOUND' : 'PASSED'}`)
  console.log(`✅ Documentation: ${docIssues ? 'ISSUES FOUND' : 'PASSED'}`)
  if (enableExternalCheck) {
    console.log(`✅ External Links: ${externalIssues ? 'ISSUES FOUND' : 'PASSED'}`)
  }

  if (placeholderIssues || internalIssues || docIssues || externalIssues) {
    console.log('\n⚠️  ISSUES DETECTED:')
    if (placeholderIssues) {
      console.log(`   - ${placeholderLinks.length} placeholder links need to be updated`)
    }
    if (internalIssues) {
      console.log(`   - ${brokenInternalLinks.length} broken internal links`)
    }
    if (docIssues) {
      console.log(`   - ${missingDocs.length} missing documentation files`)
    }
    if (externalIssues && enableExternalCheck) {
      console.log('   - Broken external links detected')
    }
  } else {
    console.log('\n🎉 All link validations passed!')
  }

  console.log('\n📋 RECOMMENDATIONS:')
  console.log('   1. Replace placeholder links with actual URLs before deployment')
  console.log('   2. Fix any broken internal links')
  console.log('   3. Ensure all required documentation is present')
  if (!enableExternalCheck) {
    console.log('   4. Consider enabling external link validation in CI/CD')
  } else {
    console.log('   4. Fix broken external links or remove them')
  }

  console.log('\n✨ LINK VALIDATION COMPLETE')
  console.log('OpenCode framework link validation is complete.')
}
