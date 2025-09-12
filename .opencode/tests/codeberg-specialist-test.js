/**
 * Codeberg Specialist Agent Test Suite
 * Tests the Codeberg API integration and OpenCode framework compatibility
 */

import { CodebergSpecialist } from '../agent/codeberg-specialist.js'

describe('Codeberg Specialist Agent', () => {
  let agent

  beforeEach(() => {
    agent = CodebergSpecialist({ $: mockBashExecutor })
  })

  describe('Agent Structure', () => {
    test('should export a function', () => {
      expect(typeof CodebergSpecialist).toBe('function')
    })

    test('should return proper agent structure', () => {
      const result = agent
      expect(result).toHaveProperty('tool')
      expect(result).toHaveProperty('functions')
      expect(result).toHaveProperty('event')
    })

    test('should have all required tool handlers', () => {
      expect(agent.tool.execute).toHaveProperty('before')
      expect(agent.tool.execute).toHaveProperty('after')
      expect(agent.tool.webfetch).toHaveProperty('before')
      expect(agent.tool.webfetch).toHaveProperty('after')
    })
  })

  describe('API Functions', () => {
    test('should have repository operations', () => {
      expect(agent.functions).toHaveProperty('listUserRepos')
      expect(agent.functions).toHaveProperty('createRepo')
      expect(agent.functions).toHaveProperty('getRepo')
      expect(typeof agent.functions.listUserRepos).toBe('function')
    })

    test('should have issue operations', () => {
      expect(agent.functions).toHaveProperty('listIssues')
      expect(agent.functions).toHaveProperty('createIssue')
      expect(agent.functions).toHaveProperty('createComment')
    })

    test('should have pull request operations', () => {
      expect(agent.functions).toHaveProperty('listPullRequests')
      expect(agent.functions).toHaveProperty('createPullRequest')
      expect(agent.functions).toHaveProperty('mergePullRequest')
    })

    test('should have user management operations', () => {
      expect(agent.functions).toHaveProperty('getCurrentUser')
      expect(agent.functions).toHaveProperty('listSSHKeys')
      expect(agent.functions).toHaveProperty('addSSHKey')
    })
  })

  describe('Authentication', () => {
    test('should handle token authentication', () => {
      const headers = agent.functions.getDefaultHeaders('test-token')
      expect(headers.Authorization).toBe('token test-token')
    })

    test('should handle no token', () => {
      const headers = agent.functions.getDefaultHeaders()
      expect(headers.Authorization).toBe('')
    })
  })

  describe('Error Handling', () => {
    test('should handle API errors gracefully', async () => {
      // Mock a failed API call
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          json: () => Promise.resolve({ message: 'Bad credentials' }),
        })
      )

      await expect(agent.functions.makeRequest('/user')).rejects.toThrow(
        'Codeberg API error: 401 Unauthorized'
      )
    })
  })

  describe('Event Handling', () => {
    test('should handle session start event', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
      await agent.event({ event: { type: 'session.start' } })
      expect(consoleSpy).toHaveBeenCalledWith('🌐 Codeberg Specialist initialized')
      consoleSpy.mockRestore()
    })
  })
})

// Mock bash executor for testing
const mockBashExecutor = async command => {
  if (command.includes('git remote get-url origin')) {
    return { stdout: 'https://codeberg.org/user/repo.git' }
  }
  return { stdout: '' }
}
