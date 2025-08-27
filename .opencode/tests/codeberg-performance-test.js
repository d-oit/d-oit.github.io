/**
 * Codeberg Performance Test
 * Tests performance aspects of the Codeberg Specialist Agent
 */

import { CodebergSpecialist } from '../agent/codeberg-specialist.js'

describe('Codeberg Specialist Performance', () => {
  let agent

  beforeEach(() => {
    agent = CodebergSpecialist({ $: mockBashExecutor })
  })

  describe('API Efficiency', () => {
    test('should handle pagination parameters', async () => {
      const mockResponse = { data: [] }
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => 'application/json' },
          json: () => Promise.resolve(mockResponse),
        })
      )

      const params = { page: 1, limit: 10 }
      await agent.functions.makeRequest('/user/repos', { params })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=1&limit=10'),
        expect.any(Object)
      )
    })

    test('should use appropriate request headers', () => {
      const headers = agent.functions.getDefaultHeaders('test-token')
      expect(headers['User-Agent']).toBe('OpenCode-Codeberg-Agent/1.0')
      expect(headers['Content-Type']).toBe('application/json')
    })
  })

  describe('Memory Management', () => {
    test('should not retain sensitive data in memory', () => {
      const headers1 = agent.functions.getDefaultHeaders('token1')
      const headers2 = agent.functions.getDefaultHeaders('token2')

      // Each call should be independent
      expect(headers1.Authorization).not.toBe(headers2.Authorization)
    })
  })

  describe('Concurrent Operations', () => {
    test('should handle multiple concurrent requests', async () => {
      const mockResponse = { id: 1, name: 'test-repo' }
      global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          headers: { get: () => 'application/json' },
          json: () => Promise.resolve(mockResponse),
        })
      )

      // Make multiple concurrent requests
      const promises = [
        agent.functions.makeRequest('/repos/user1/repo1'),
        agent.functions.makeRequest('/repos/user2/repo2'),
        agent.functions.makeRequest('/repos/user3/repo3'),
      ]

      const results = await Promise.all(promises)
      expect(results).toHaveLength(3)
      results.forEach(result => {
        expect(result.name).toBe('test-repo')
      })
    })
  })
})

const mockBashExecutor = async () => ({ stdout: '' })
