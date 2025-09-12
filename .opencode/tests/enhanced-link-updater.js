import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔗 ENHANCED OPENCODE FRAMEWORK - REPOSITORY LINK UPDATER')
console.log('=======================================================\n')

// Supported git platforms and their URL patterns
const GIT_PLATFORMS = {
  github: {
    domain: 'github.com',
    issuePattern: '{owner}/{repo}/issues',
    clonePattern: 'https://github.com/{owner}/{repo}.git',
    detectPattern: /github\.com\/([^\/]+)\/([^\/]+)/,
  },
  codeberg: {
    domain: 'codeberg.org',
    issuePattern: '{owner}/{repo}/issues',
    clonePattern: 'https://codeberg.org/{owner}/{repo}.git',
    detectPattern: /codeberg\.org\/([^\/]+)\/([^\/]+)/,
  },
  gitlab: {
    domain: 'gitlab.com',
    issuePattern: '{owner}/{repo}/-/issues',
    clonePattern: 'https://gitlab.com/{owner}/{repo}.git',
    detectPattern: /gitlab\.com\/([^\/]+)\/([^\/]+)/,
  },
  bitbucket: {
    domain: 'bitbucket.org',
    issuePattern: '{owner}/{repo}/issues',
    clonePattern: 'https://bitbucket.org/{owner}/{repo}.git',
    detectPattern: /bitbucket\.org\/([^\/]+)\/([^\/]+)/,
  },
}

// Function to get git remote URL with enhanced detection
function getGitRemoteUrl() {
  try {
    // Try to get the remote URL
    const remoteUrl = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim()

    if (!remoteUrl) {
      console.log('⚠️  No git remote URL found')
      return null
    }

    console.log(`📡 Raw remote URL: ${remoteUrl}`)

    // Convert SSH URL to HTTPS URL if needed
    let httpsUrl = remoteUrl
    if (remoteUrl.startsWith('git@')) {
      // Convert git@domain:user/repo.git to https://domain/user/repo
      const sshMatch = remoteUrl.match(/git@([^:]+):(.+)\.git/)
      if (sshMatch) {
        httpsUrl = `https://${sshMatch[1]}/${sshMatch[2]}`
      }
    } else if (remoteUrl.endsWith('.git')) {
      // Remove .git suffix
      httpsUrl = remoteUrl.slice(0, -4)
    }

    console.log(`🔄 Converted to HTTPS: ${httpsUrl}`)
    return httpsUrl
  } catch (error) {
    console.log('⚠️  Could not detect git remote URL')
    console.log('   Make sure you are in a git repository with a remote origin')
    return null
  }
}

// Function to detect git platform and extract repository info
function detectGitPlatform(remoteUrl) {
  if (!remoteUrl) return null

  for (const [platform, config] of Object.entries(GIT_PLATFORMS)) {
    const match = remoteUrl.match(config.detectPattern)
    if (match) {
      return {
        platform,
        owner: match[1],
        repo: match[2],
        url: remoteUrl,
        config,
      }
    }
  }

  return null
}

// Function to find all markdown files (excluding .opencode directory)
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
          // Skip .opencode directory and other common exclusions
          const excludeDirs = [
            'node_modules',
            '.git',
            'dist',
            'build',
            '.next',
            '.nuxt',
            'coverage',
            '.opencode', // Exclude .opencode directory
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

// Function to generate replacement patterns for a specific repository
function generateReplacementPatterns(repoInfo) {
  const patterns = []
  const { owner, repo, url, config } = repoInfo

  // Generic placeholder patterns commonly found in templates
  // These are generic patterns that should be replaced with actual repository info
  const genericPlaceholders = [
    // Owner placeholders
    'your-username',
    'your-org',
    'your-organization',
    'template-owner',
    'project-owner',
    'repo-owner',
    'my-username',
    'my-org',
    'user-name',
    'organization-name',
    
    // Repository placeholders  
    'your-repository',
    'your-repo',
    'your-project',
    'your-project-name',
    'template-repo',
    'template-name',
    'project-name',
    'repo-name',
    'my-repo',
    'my-project',
    
    // Common template combinations
    'your-username/your-repository',
    'your-org/your-repo',
    'your-organization/your-project-name',
    'template-owner/template-repo',
    'project-owner/project-name',
  ]

  // For each generic placeholder, create patterns for different platforms
  genericPlaceholders.forEach(placeholder => {
    // Handle both single values (owner or repo) and combinations (owner/repo)
    if (placeholder.includes('/')) {
      // This is an owner/repo combination
      const [placeholderOwner, placeholderRepo] = placeholder.split('/')
      
      // Git clone patterns for different platforms
      patterns.push({
        pattern: new RegExp(`git clone https://github\.com/${placeholderOwner}/${placeholderRepo}\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      patterns.push({
        pattern: new RegExp(`git clone https://codeberg\.org/${placeholderOwner}/${placeholderRepo}\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      patterns.push({
        pattern: new RegExp(`git clone https://gitlab\.com/${placeholderOwner}/${placeholderRepo}\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      // Issue URL patterns
      patterns.push({
        pattern: new RegExp(`https://github\.com/${placeholderOwner}/${placeholderRepo}/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      patterns.push({
        pattern: new RegExp(`https://codeberg\.org/${placeholderOwner}/${placeholderRepo}/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      patterns.push({
        pattern: new RegExp(`https://gitlab\.com/${placeholderOwner}/${placeholderRepo}/-/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      // Repository URL patterns
      patterns.push({
        pattern: new RegExp(`https://github\.com/${placeholderOwner}/${placeholderRepo}`, 'g'),
        replacement: url,
      })

      patterns.push({
        pattern: new RegExp(`https://codeberg\.org/${placeholderOwner}/${placeholderRepo}`, 'g'),
        replacement: url,
      })

      patterns.push({
        pattern: new RegExp(`https://gitlab\.com/${placeholderOwner}/${placeholderRepo}`, 'g'),
        replacement: url,
      })
    } else {
      // This is a single placeholder (owner or repo)
      // We'll try to match it in various contexts
      
      // Git clone patterns with placeholder as owner
      patterns.push({
        pattern: new RegExp(`git clone https://github\.com/${placeholder}/[^/]+\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      patterns.push({
        pattern: new RegExp(`git clone https://codeberg\.org/${placeholder}/[^/]+\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      patterns.push({
        pattern: new RegExp(`git clone https://gitlab\.com/${placeholder}/[^/]+\.git`, 'g'),
        replacement: `git clone ${url}.git`,
      })

      // Issue URL patterns with placeholder as owner
      patterns.push({
        pattern: new RegExp(`https://github\.com/${placeholder}/[^/]+/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      patterns.push({
        pattern: new RegExp(`https://codeberg\.org/${placeholder}/[^/]+/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      patterns.push({
        pattern: new RegExp(`https://gitlab\.com/${placeholder}/[^/]+/-/issues`, 'g'),
        replacement: `${url}/issues`,
      })

      // Repository URL patterns with placeholder as owner
      patterns.push({
        pattern: new RegExp(`https://github\.com/${placeholder}/[^/]+`, 'g'),
        replacement: url,
      })

      patterns.push({
        pattern: new RegExp(`https://codeberg\.org/${placeholder}/[^/]+`, 'g'),
        replacement: url,
      })

      patterns.push({
        pattern: new RegExp(`https://gitlab\.com/${placeholder}/[^/]+`, 'g'),
        replacement: url,
      })
    }
  })

  return patterns
}

// Function to update links in a file
function updateLinksInFile(filePath, patterns) {
  if (!fs.existsSync(filePath)) {
    return { updated: false, changes: 0 }
  }

  const content = fs.readFileSync(filePath, 'utf8')
  let updatedContent = content
  let changes = 0

  patterns.forEach(({ pattern, replacement }) => {
    if (pattern.test(updatedContent)) {
      updatedContent = updatedContent.replace(pattern, replacement)
      changes++
    }
  })

  if (changes > 0) {
    fs.writeFileSync(filePath, updatedContent, 'utf8')
    return { updated: true, changes }
  }

  return { updated: false, changes: 0 }
}

// Main execution function
function main() {
  console.log('1. GIT REMOTE DETECTION')
  console.log('-----------------------')

  const remoteUrl = getGitRemoteUrl()
  if (!remoteUrl) {
    console.log('\n❌ Cannot proceed without git remote URL')
    console.log('   Please set up a git remote origin first:')
    console.log('   git remote add origin https://github.com/your-org/your-repo.git')
    process.exit(1)
  }

  const repoInfo = detectGitPlatform(remoteUrl)
  if (!repoInfo) {
    console.log('\n❌ Could not detect git platform from URL')
    console.log('   Supported platforms: GitHub, Codeberg, GitLab, Bitbucket')
    process.exit(1)
  }

  console.log(`\n📋 Repository Info:`)
  console.log(`   Platform: ${repoInfo.platform}`)
  console.log(`   Owner: ${repoInfo.owner}`)
  console.log(`   Repository: ${repoInfo.repo}`)
  console.log(`   URL: ${repoInfo.url}`)

  console.log('\n\n2. MARKDOWN FILE DISCOVERY')
  console.log('---------------------------')

  const markdownFiles = findMarkdownFiles()
  console.log(`📄 Found ${markdownFiles.length} markdown files to check`)

  console.log('\n\n3. GENERATING REPLACEMENT PATTERNS')
  console.log('-----------------------------------')

  const patterns = generateReplacementPatterns(repoInfo)
  console.log(`🔄 Generated ${patterns.length} generic replacement patterns`)

  console.log('\n\n4. LINK UPDATES')
  console.log('----------------')

  let totalFilesUpdated = 0
  let totalChanges = 0

  markdownFiles.forEach(filePath => {
    const relativePath = path.relative('.', filePath)
    const result = updateLinksInFile(filePath, patterns)

    if (result.updated) {
      console.log(`✅ ${relativePath}: ${result.changes} links updated`)
      totalFilesUpdated++
      totalChanges += result.changes
    } else {
      console.log(`⏭️  ${relativePath}: No changes needed`)
    }
  })

  console.log('\n\n5. UPDATE SUMMARY')
  console.log('-----------------')

  console.log(`📊 Update Results:`)
  console.log(`   Files processed: ${markdownFiles.length}`)
  console.log(`   Files updated: ${totalFilesUpdated}`)
  console.log(`   Total link changes: ${totalChanges}`)

  if (totalChanges > 0) {
    console.log('\n✅ Repository links have been successfully updated!')
    console.log('\n📋 What was updated:')
    console.log('   - Git clone URLs with placeholder owners/repos')
    console.log('   - Issue tracker links with placeholder owners/repos')
    console.log('   - Repository homepage links with placeholder owners/repos')
    console.log('   - All generic placeholder patterns replaced with actual repository info')
  } else {
    console.log('\n✅ All links are already up to date!')
  }

  console.log('\n📋 Next Steps:')
  console.log('   1. Review the updated files')
  console.log('   2. Commit the changes: git add . && git commit -m "Update repository links"')
  console.log('   3. Push to remote: git push origin main')

  console.log('\n✨ ENHANCED LINK UPDATE COMPLETE')
  console.log('OpenCode framework enhanced link update is complete.')
}

// Run the main function if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { getGitRemoteUrl, detectGitPlatform, findMarkdownFiles, generateReplacementPatterns, updateLinksInFile }
