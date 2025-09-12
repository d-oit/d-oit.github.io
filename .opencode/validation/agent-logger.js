#!/usr/bin/env node

/**
 * Agent Activity Logger
 * Logs all agent activities for validation and monitoring
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class AgentLogger {
  constructor() {
    this.logsDir = path.join(__dirname, '../../logs')
    this.ensureLogsDir()
    this.currentSession = this.generateSessionId()
  }

  ensureLogsDir() {
    if (!fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true })
    }
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  }

  logActivity(agentType, action, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      sessionId: this.currentSession,
      agentType: agentType,
      action: action,
      details: details,
      metadata: {
        platform: process.platform,
        nodeVersion: process.version,
        workingDirectory: process.cwd(),
      },
    }

    const logFile = path.join(this.logsDir, `agent-activity-${this.getDateString()}.jsonl`)

    try {
      fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n')
      console.log(`📝 Agent activity logged: ${agentType} -> ${action}`)
    } catch (error) {
      console.error('❌ Failed to log agent activity:', error.message)
    }
  }

  logAgentStart(agentType, prompt = '') {
    this.logActivity(agentType, 'start', {
      prompt: prompt.substring(0, 200) + (prompt.length > 200 ? '...' : ''),
      startTime: Date.now(),
    })
  }

  logAgentComplete(agentType, result = '', duration = 0) {
    this.logActivity(agentType, 'complete', {
      result: result.substring(0, 500) + (result.length > 500 ? '...' : ''),
      duration: duration,
      endTime: Date.now(),
    })
  }

  logAgentError(agentType, error) {
    this.logActivity(agentType, 'error', {
      error: error.message || error,
      stack: error.stack ? error.stack.substring(0, 500) : undefined,
    })
  }

  logValidationEvent(validationType, confidence, findings = []) {
    this.logActivity('validation-specialist', 'validation', {
      validationType: validationType,
      confidence: confidence,
      findingsCount: findings.length,
      findings: findings.slice(0, 10), // Limit to first 10 findings
    })
  }

  getDateString() {
    return new Date().toISOString().split('T')[0]
  }

  getRecentLogs(hours = 24) {
    const cutoffTime = Date.now() - hours * 60 * 60 * 1000
    const logFiles = fs
      .readdirSync(this.logsDir)
      .filter(file => file.startsWith('agent-activity-'))
      .sort()
      .reverse()

    const recentLogs = []

    for (const logFile of logFiles) {
      const filePath = path.join(this.logsDir, logFile)
      const content = fs.readFileSync(filePath, 'utf8')
      const lines = content.trim().split('\n')

      for (const line of lines) {
        try {
          const entry = JSON.parse(line)
          if (new Date(entry.timestamp).getTime() > cutoffTime) {
            recentLogs.push(entry)
          }
        } catch (error) {
          // Skip malformed lines
        }
      }
    }

    return recentLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }

  generateActivityReport() {
    const recentLogs = this.getRecentLogs()
    const reportPath = path.join(this.logsDir, `activity-report-${this.getDateString()}.md`)

    const agentStats = {}
    const actionStats = {}

    recentLogs.forEach(log => {
      agentStats[log.agentType] = (agentStats[log.agentType] || 0) + 1
      actionStats[log.action] = (actionStats[log.action] || 0) + 1
    })

    const report = `# Agent Activity Report

**Generated:** ${new Date().toISOString()}
**Period:** Last 24 hours
**Total Activities:** ${recentLogs.length}

## Agent Usage Statistics

| Agent Type | Activities |
|------------|------------|
${Object.entries(agentStats)
  .map(([agent, count]) => `| ${agent} | ${count} |`)
  .join('\n')}

## Action Distribution

| Action | Count |
|--------|-------|
${Object.entries(actionStats)
  .map(([action, count]) => `| ${action} | ${count} |`)
  .join('\n')}

## Recent Activities

${recentLogs
  .slice(0, 20)
  .map(
    log =>
      `### ${log.agentType} - ${log.action}
**Time:** ${log.timestamp}
**Details:** ${JSON.stringify(log.details, null, 2)}
`
  )
  .join('\n')}

---

*This report was generated automatically by the Agent Logger.*
`

    fs.writeFileSync(reportPath, report)
    console.log(`📊 Activity report generated: ${reportPath}`)
    return reportPath
  }

  cleanupOldLogs(days = 30) {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000
    const logFiles = fs.readdirSync(this.logsDir).filter(file => file.startsWith('agent-activity-'))

    let deletedCount = 0
    logFiles.forEach(file => {
      const filePath = path.join(this.logsDir, file)
      const stats = fs.statSync(filePath)

      if (stats.mtime.getTime() < cutoffTime) {
        fs.unlinkSync(filePath)
        deletedCount++
      }
    })

    console.log(`🧹 Cleaned up ${deletedCount} old log files`)
    return deletedCount
  }
}

// Global logger instance
const logger = new AgentLogger()

// Export for use in other modules
export default logger

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2]

  switch (command) {
    case 'report':
      logger.generateActivityReport()
      break
    case 'cleanup':
      logger.cleanupOldLogs()
      break
    case 'stats':
      const logs = logger.getRecentLogs()
      console.log(`📊 Agent Activity Stats (24h):`)
      console.log(`Total activities: ${logs.length}`)
      const agentStats = {}
      logs.forEach(log => {
        agentStats[log.agentType] = (agentStats[log.agentType] || 0) + 1
      })
      Object.entries(agentStats).forEach(([agent, count]) => {
        console.log(`${agent}: ${count} activities`)
      })
      break
    default:
      console.log('💡 Agent Logger Commands:')
      console.log('• node .opencode/validation/agent-logger.js report  - Generate activity report')
      console.log('• node .opencode/validation/agent-logger.js cleanup - Clean old logs')
      console.log('• node .opencode/validation/agent-logger.js stats   - Show activity stats')
  }
}
