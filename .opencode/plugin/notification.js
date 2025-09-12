/**
 * Build Notification Plugin
 * @description Sends system notifications for important events
 * Provides validation and audit capabilities for notification delivery
 */

export const NotificationPlugin = async ({ client, $ }) => {
  // Platform detection
  const getPlatform = () => {
    const platform = process.platform
    if (platform === 'darwin') return 'macos'
    if (platform === 'linux') return 'linux'
    if (platform === 'win32') return 'windows'
    return 'unknown'
  }

  const sendNotification = async (title, message) => {
    const platform = getPlatform()

    try {
      switch (platform) {
        case 'macos':
          await $`osascript -e 'display notification "${message}" with title "${title}"'`.quiet()
          break
        case 'linux':
          await $`notify-send "${title}" "${message}"`.quiet()
          break
        case 'windows':
          await $`powershell -Command "Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.MessageBox]::Show('${message}', '${title}')"`().quiet()
          break
        default:
          // Fallback: try to detect by attempting commands
          try {
            await $`notify-send "${title}" "${message}"`.quiet()
          } catch {
            console.log(`📢 ${title}: ${message}`)
          }
      }
    } catch (error) {
      // Silent fallback - just log to console
      console.log(`📢 ${title}: ${message}`)
    }
  }

  // Validation function for notification system
  const validateNotificationSystem = async () => {
    const issues = []

    try {
      const platform = getPlatform()

      // Test notification delivery
      if (platform === 'unknown') {
        issues.push('⚠️  Unknown platform detected - notifications may not work')
      }

      // Check if notification commands are available
      if (platform === 'linux') {
        try {
          await $`which notify-send`
        } catch {
          issues.push('⚠️  notify-send not available on Linux system')
        }
      }

      if (platform === 'macos') {
        try {
          await $`which osascript`
        } catch {
          issues.push('⚠️  osascript not available on macOS system')
        }
      }

      if (platform === 'windows') {
        try {
          await $`powershell -Command "Get-Host"`
        } catch {
          issues.push('⚠️  PowerShell not available on Windows system')
        }
      }

    } catch (error) {
      issues.push(`❌ Notification validation error: ${error.message}`)
    }

    return issues
  }

  return {
    description: 'Build Notification Plugin - Sends system notifications for important events with validation and audit capabilities',

    // Add validation hook
    validate: {
      notifications: validateNotificationSystem
    },

    event: async ({ event }) => {
      switch (event.type) {
        case 'session.start':
          await sendNotification('OpenCode', 'New coding session started')
          break
        case 'session.idle':
          await sendNotification('OpenCode', 'Session completed successfully')
          break
        case 'tool.error':
          await sendNotification('OpenCode Error', `Tool ${event.tool} failed`)
          break
      }
    },

    tool: {
      execute: {
        after: async (input, output) => {
          if (input.tool === 'bash' && output.args.command) {
            const command = output.args.command

            // Notify on successful builds
            if (command.includes('build') && !output.error) {
              await sendNotification('Build Success', 'Project built successfully with pnpm')
            }

            // Notify on test completion
            if (command.includes('test') && !output.error) {
              await sendNotification('Tests Passed', 'All tests completed successfully')
            }

            // Notify on pnpm install completion
            if (command.includes('pnpm install') && !output.error) {
              await sendNotification(
                'Dependencies Installed',
                'pnpm install completed successfully'
              )
            }

            // Notify on deployment
            if (command.includes('deploy') && !output.error) {
              await sendNotification('Deployment Success', 'Application deployed successfully')
            }
          }
        },
      },
    },
  }
}
