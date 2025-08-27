#!/usr/bin/env node

/**
 * Validation Dashboard
 * Displays real-time validation metrics and confidence scores
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class ValidationDashboard {
  constructor() {
    this.reportsDir = path.join(__dirname, '../../reports')
    this.ensureReportsDir()
  }

  ensureReportsDir() {
    if (!fs.existsSync(this.reportsDir)) {
      fs.mkdirSync(this.reportsDir, { recursive: true })
    }
  }

  loadLatestReport() {
    const summaryPath = path.join(this.reportsDir, 'latest-validation-summary.md')
    if (fs.existsSync(summaryPath)) {
      return fs.readFileSync(summaryPath, 'utf8')
    }
    return null
  }

  loadDetailedReport() {
    const reportFiles = fs
      .readdirSync(this.reportsDir)
      .filter(file => file.startsWith('validation-report-'))
      .sort()
      .reverse()

    if (reportFiles.length > 0) {
      const latestReport = path.join(this.reportsDir, reportFiles[0])
      return JSON.parse(fs.readFileSync(latestReport, 'utf8'))
    }
    return null
  }

  generateDashboard() {
    const summary = this.loadLatestReport()
    const detailed = this.loadDetailedReport()

    console.clear()
    console.log('🚀 OpenCode Validation Dashboard')
    console.log('================================\n')

    if (!summary || !detailed) {
      console.log('❌ No validation reports found. Run automated validation first.')
      console.log('\n💡 Run: node .opencode/validation/automated-validation.js')
      return
    }

    // Overall Score
    const score = detailed.summary.score
    const scoreColor = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴'
    console.log(`${scoreColor} Overall Score: ${score}/100\n`)

    // Test Results Table
    console.log('📊 Test Results:')
    console.log('─'.repeat(50))
    console.log('Test Name'.padEnd(25) + 'Status'.padEnd(10) + 'Details')
    console.log('─'.repeat(50))

    Object.entries(detailed.tests).forEach(([name, test]) => {
      const status = test.status === 'passed' ? '✅' : '❌'
      const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      console.log(`${displayName.padEnd(25)} ${status.padEnd(10)} ${test.status}`)
    })

    console.log('─'.repeat(50))
    console.log(`Total Tests: ${detailed.summary.totalTests}`)
    console.log(`Passed: ${detailed.summary.passed}`)
    console.log(`Failed: ${detailed.summary.failed}\n`)

    // Confidence Assessment
    console.log('🎯 Confidence Assessment:')
    if (score >= 90) {
      console.log('🟢 HIGH CONFIDENCE - System is well-validated')
    } else if (score >= 70) {
      console.log('🟡 MEDIUM CONFIDENCE - Some issues need attention')
    } else {
      console.log('🔴 LOW CONFIDENCE - Critical issues require immediate action')
    }

    console.log('\n📋 Recommendations:')
    if (detailed.summary.failed > 0) {
      console.log('• Address failed tests immediately')
      console.log('• Review error logs for detailed information')
      console.log('• Consider running individual test suites')
    } else {
      console.log('• All tests passing - system is healthy')
      console.log('• Consider adding more comprehensive tests')
      console.log('• Set up automated monitoring alerts')
    }

    console.log('\n📅 Last Updated:', detailed.timestamp)
    console.log('\n💡 Commands:')
    console.log('• Run validation: node .opencode/validation/automated-validation.js')
    console.log('• View detailed report: cat reports/latest-validation-summary.md')
    console.log('• Setup cron job: crontab -e (add the generated cron script)')
  }

  startLiveDashboard() {
    console.log('🔄 Starting live dashboard... (Ctrl+C to exit)')
    this.generateDashboard()

    // Update every 30 seconds
    setInterval(() => {
      this.generateDashboard()
    }, 30000)
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const dashboard = new ValidationDashboard()

  if (process.argv[2] === '--live') {
    dashboard.startLiveDashboard()
  } else {
    dashboard.generateDashboard()
  }
}

export default ValidationDashboard
