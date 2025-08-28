import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🔗 OPENCODE FRAMEWORK - LINK UPDATE TEST')
console.log('=========================================\n')

// Function to get git remote URL
function getGitRemoteUrl() {
  try {
    const remoteUrl = execSync('git config --get remote.origin.url', {
      encoding: 'utf8',
      stdio: 'pipe',
    }).trim()

    if (!remoteUrl) {
      console.log('⚠️  No git remote URL found')
      return null
    }

    // Convert SSH URL to HTTPS URL if needed
    let httpsUrl = remoteUrl
    if (remoteUrl.startsWith('git@')) {
      // Convert git@github.com:user/repo.git to https://github.com/user/repo
      const match = remoteUrl.match(/git@([^:]+):(.+)\.git/)
      if (match) {
        httpsUrl = `https://${match[1]}/${match[2]}`
      }
    } else if (remoteUrl.endsWith('.git')) {
      // Remove .git suffix
      httpsUrl = remoteUrl.slice(0, -4)
    }

    console.log(`📡 Detected git remote: ${httpsUrl}`)
    return httpsUrl
  } catch (error) {
    console.log('⚠️  Could not detect git remote URL')
    console.log('   Make sure you are in a git repository with a remote origin')
    return null
  }
}

// Function to extract repository info from URL
function extractRepoInfo(remoteUrl) {
  if (!remoteUrl) return null

  const match = remoteUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      url: remoteUrl,
    }
  }

  return null
}

// Function to find all markdown files
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

// Function to update links in a file
function updateLinksInFile(filePath, repoInfo) {
  if (!repoInfo) return { updated: false, changes: 0 }

  const content = fs.readFileSync(filePath, 'utf8')
  let updatedContent = content
  let changes = 0

  // Patterns to replace
  const replacements = [
    // GitHub Issues
    {
      pattern: /https:\/\/github\.com\/your-org\/do-opencode-template\/issues/g,
      replacement: `${repoInfo.url}/issues`,
    },
    {
      pattern: /https:\/\/github\.com\/your-organization\/your-project-name\/issues/g,
      replacement: `${repoInfo.url}/issues`,
    },
    // Repository URL
    {
      pattern: /https:\/\/github\.com\/your-org\/do-opencode-template/g,
      replacement: repoInfo.url,
    },
    {
      pattern: /https:\/\/github\.com\/your-organization\/your-project-name/g,
      replacement: repoInfo.url,
    },
    // Clone URL
    {
      pattern: /git clone https:\/\/github\.com\/your-org\/do-opencode-template\.git/g,
      replacement: `git clone ${repoInfo.url}.git`,
    },
    {
      pattern: /git clone https:\/\/github\.com\/your-organization\/your-project-name\.git/g,
      replacement: `git clone ${repoInfo.url}.git`,
    },
  ]

  replacements.forEach(({ pattern, replacement }) => {
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

// Main execution
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

  const repoInfo = extractRepoInfo(remoteUrl)
  if (!repoInfo) {
    console.log('\n❌ Could not extract repository information from URL')
    process.exit(1)
  }

  console.log(`\n📋 Repository Info:`)
  console.log(`   Owner: ${repoInfo.owner}`)
  console.log(`   Repository: ${repoInfo.repo}`)
  console.log(`   URL: ${repoInfo.url}`)

  console.log('\n\n2. MARKDOWN FILE DISCOVERY')
  console.log('---------------------------')

  const markdownFiles = findMarkdownFiles()
  console.log(`📄 Found ${markdownFiles.length} markdown files to check`)

  console.log('\n\n3. LINK UPDATES')
  console.log('----------------')

  let totalFilesUpdated = 0
  let totalChanges = 0

  markdownFiles.forEach(filePath => {
    const relativePath = path.relative('.', filePath)
    const result = updateLinksInFile(filePath, repoInfo)

    if (result.updated) {
      console.log(`✅ ${relativePath}: ${result.changes} links updated`)
      totalFilesUpdated++
      totalChanges += result.changes
    } else {
      console.log(`⏭️  ${relativePath}: No changes needed`)
    }
  })

  console.log('\n\n4. UPDATE SUMMARY')
  console.log('-----------------')

  console.log(`📊 Update Results:`)
  console.log(`   Files processed: ${markdownFiles.length}`)
  console.log(`   Files updated: ${totalFilesUpdated}`)
  console.log(`   Total link changes: ${totalChanges}`)

  if (totalChanges > 0) {
    console.log('\n✅ Repository links have been successfully updated!')
    console.log('\n📋 What was updated:')
    console.log('   - GitHub Issues links')
    console.log('   - Repository clone URLs')
    console.log('   - Repository homepage links')
    console.log('   - All placeholder organization/repository references')
  } else {
    console.log('\n✅ All links are already up to date!')
  }

  console.log('\n📋 Next Steps:')
  console.log('   1. Review the updated files')
  console.log('   2. Commit the changes: git add . && git commit -m "Update repository links"')
  console.log('   3. Push to remote: git push origin main')

  console.log('\n✨ LINK UPDATE COMPLETE')
  console.log('OpenCode framework link update is complete.')
}

// Run the main function
main()
