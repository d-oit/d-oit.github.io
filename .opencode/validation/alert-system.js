#!/usr/bin/env node

/**
 * Validation Alert System
 * Monitors validation results and sends alerts for low-confidence findings
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class ValidationAlertSystem {
  constructor() {
    this.alertsDir = path.join(__dirname, '../../alerts')
    this.reportsDir = path.join(__dirname, '../../reports')
    this.ensureDirectories()
    this.alertThresholds = {
      critical: 0.3,
      high: 0.5,
      medium: 0.7,
      low: 0.8,
    }
  }

  ensureDirectories() {
    ;[this.alertsDir, this.reportsDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
    })
  }

  loadLatestReport() {
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

  analyzeFindings(report) {
    const alerts = {
      critical: [],
      high: [],
      medium: [],
      low: [],
      summary: {
        totalAlerts: 0,
        criticalCount: 0,
        highCount: 0,
        mediumCount: 0,
        lowCount: 0,
      },
    }

    // Analyze test failures
    Object.entries(report.tests).forEach(([testName, test]) => {
      if (test.status === 'failed') {
        const alert = {
          type: 'test_failure',
          component: testName,
          severity: 'high',
          message: `${testName} test failed`,
          details: test.output || 'No details available',
          timestamp: new Date().toISOString(),
          confidence: 0.9,
        }
        alerts.high.push(alert)
      }
    })

    // Analyze performance metrics (if available)
    if (report.performance) {
      if (report.performance.bundleSize > 2000) {
        // KB
        alerts.medium.push({
          type: 'performance_issue',
          component: 'bundle_size',
          severity: 'medium',
          message: `Large bundle size detected: ${report.performance.bundleSize}KB`,
          details: 'Consider code splitting and optimization',
          timestamp: new Date().toISOString(),
          confidence: 0.8,
        })
      }
    }

    // Analyze security findings (if available)
    if (report.security && report.security.vulnerabilities) {
      report.security.vulnerabilities.forEach(vuln => {
        if (vuln.severity === 'critical' || vuln.severity === 'high') {
          alerts[vuln.severity === 'critical' ? 'critical' : 'high'].push({
            type: 'security_vulnerability',
            component: vuln.package || 'unknown',
            severity: vuln.severity,
            message: `${vuln.severity} security vulnerability in ${vuln.package}`,
            details: vuln.description || 'No details available',
            timestamp: new Date().toISOString(),
            confidence: 0.95,
          })
        }
      })
    }

    // Update summary
    alerts.summary.criticalCount = alerts.critical.length
    alerts.summary.highCount = alerts.high.length
    alerts.summary.mediumCount = alerts.medium.length
    alerts.summary.lowCount = alerts.low.length
    alerts.summary.totalAlerts =
      alerts.summary.criticalCount +
      alerts.summary.highCount +
      alerts.summary.mediumCount +
      alerts.summary.lowCount

    return alerts
  }

  generateAlertReport(alerts) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const alertReport = {
      timestamp: new Date().toISOString(),
      alerts: alerts,
      recommendations: this.generateRecommendations(alerts),
    }

    const reportPath = path.join(this.alertsDir, `alerts-${timestamp}.json`)
    fs.writeFileSync(reportPath, JSON.stringify(alertReport, null, 2))

    return reportPath
  }

  generateRecommendations(alerts) {
    const recommendations = {
      immediate: [],
      shortTerm: [],
      longTerm: [],
    }

    if (alerts.summary.criticalCount > 0) {
      recommendations.immediate.push('Address all critical alerts immediately')
      recommendations.immediate.push(
        'Consider pausing deployment until critical issues are resolved'
      )
    }

    if (alerts.summary.highCount > 0) {
      recommendations.shortTerm.push('Review and fix all high-priority alerts within this sprint')
      recommendations.shortTerm.push('Schedule security review if security alerts are present')
    }

    if (alerts.summary.mediumCount > 0) {
      recommendations.shortTerm.push('Address medium-priority alerts in next sprint')
      recommendations.shortTerm.push(
        'Consider performance optimization if performance alerts exist'
      )
    }

    if (alerts.summary.totalAlerts === 0) {
      recommendations.longTerm.push('Maintain current validation practices')
      recommendations.longTerm.push('Consider adding more comprehensive validation checks')
    }

    return recommendations
  }

  sendConsoleAlerts(alerts) {
    console.log('\n🚨 VALIDATION ALERTS DETECTED')
    console.log('==============================\n')

    if (alerts.summary.totalAlerts === 0) {
      console.log('✅ No alerts detected - system is healthy!\n')
      return
    }

    // Critical alerts
    if (alerts.critical.length > 0) {
      console.log('🔴 CRITICAL ALERTS:')
      alerts.critical.forEach(alert => {
        console.log(`  • ${alert.message}`)
        console.log(`    ${alert.details}`)
      })
      console.log()
    }

    // High alerts
    if (alerts.high.length > 0) {
      console.log('🟠 HIGH PRIORITY ALERTS:')
      alerts.high.forEach(alert => {
        console.log(`  • ${alert.message}`)
        console.log(`    ${alert.details}`)
      })
      console.log()
    }

    // Medium alerts
    if (alerts.medium.length > 0) {
      console.log('🟡 MEDIUM PRIORITY ALERTS:')
      alerts.medium.forEach(alert => {
        console.log(`  • ${alert.message}`)
        console.log(`    ${alert.details}`)
      })
      console.log()
    }

    // Summary
    console.log('📊 ALERT SUMMARY:')
    console.log(`  • Critical: ${alerts.summary.criticalCount}`)
    console.log(`  • High: ${alerts.summary.highCount}`)
    console.log(`  • Medium: ${alerts.summary.mediumCount}`)
    console.log(`  • Total: ${alerts.summary.totalAlerts}\n`)
  }

  createAlertBadge(alerts) {
    const badgePath = path.join(this.alertsDir, 'current-status.json')

    const status = {
      timestamp: new Date().toISOString(),
      status:
        alerts.summary.totalAlerts === 0
          ? 'healthy'
          : alerts.summary.criticalCount > 0
            ? 'critical'
            : alerts.summary.highCount > 0
              ? 'warning'
              : 'caution',
      alertCount: alerts.summary.totalAlerts,
      criticalCount: alerts.summary.criticalCount,
      lastChecked: new Date().toISOString(),
    }

    fs.writeFileSync(badgePath, JSON.stringify(status, null, 2))
    return status
  }

  runAlertCheck() {
    console.log('🔍 Checking for validation alerts...')

    const report = this.loadLatestReport()
    if (!report) {
      console.log('❌ No validation reports found. Run validation first.')
      return null
    }

    const alerts = this.analyzeFindings(report)
    const reportPath = this.generateAlertReport(alerts)
    const status = this.createAlertBadge(alerts)

    this.sendConsoleAlerts(alerts)

    console.log(`📋 Alert report saved: ${reportPath}`)
    console.log(`🏷️  Status badge updated: ${status.status}`)

    return {
      alerts,
      reportPath,
      status,
    }
  }

  getAlertHistory(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000
    const alertFiles = fs
      .readdirSync(this.alertsDir)
      .filter(file => file.startsWith('alerts-'))
      .sort()
      .reverse()

    const history = []

    alertFiles.forEach(file => {
      const filePath = path.join(this.alertsDir, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime.getTime() > cutoffTime) {
        try {
          const alertData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
          history.push({
            file: file,
            timestamp: alertData.timestamp,
            alertCount: alertData.alerts.summary.totalAlerts,
            criticalCount: alertData.alerts.summary.criticalCount,
          })
        } catch (error) {
          // Skip malformed files
        }
      }
    })

    return history
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const alertSystem = new ValidationAlertSystem()
  const command = process.argv[2]

  switch (command) {
    case 'check':
      alertSystem.runAlertCheck()
      break
    case 'history':
      const hours = parseInt(process.argv[3]) || 24
      const history = alertSystem.getAlertHistory(hours)
      console.log(`📊 Alert History (Last ${hours} hours):`)
      history.forEach(entry => {
        console.log(
          `${entry.timestamp}: ${entry.alertCount} alerts (${entry.criticalCount} critical)`
        )
      })
      break
    case 'status':
      const statusPath = path.join(alertSystem.alertsDir, 'current-status.json')
      if (fs.existsSync(statusPath)) {
        const status = JSON.parse(fs.readFileSync(statusPath, 'utf8'))
        console.log(`🏷️  Current Status: ${status.status.toUpperCase()}`)
        console.log(`📊 Total Alerts: ${status.alertCount}`)
        console.log(`🔴 Critical: ${status.criticalCount}`)
        console.log(`🕐 Last Checked: ${status.lastChecked}`)
      } else {
        console.log('❌ No status information available')
      }
      break
    default:
      console.log('💡 Alert System Commands:')
      console.log('• node .opencode/validation/alert-system.js check   - Check for alerts')
      console.log('• node .opencode/validation/alert-system.js history - Show alert history')
      console.log('• node .opencode/validation/alert-system.js status  - Show current status')
  }
}

export default ValidationAlertSystem
