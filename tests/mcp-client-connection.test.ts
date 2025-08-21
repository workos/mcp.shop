import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { generateTestKeyPair, createValidJWT } from './utils/jwt-utils'
import { server } from './mocks/server'
import { http, HttpResponse, delay } from 'msw'

describe('MCP Client Connection Scenarios', () => {
  let keyPair: any
  let validJWT: string

  beforeEach(async () => {
    keyPair = await generateTestKeyPair()
    validJWT = await createValidJWT(keyPair)
    
    // Reset environment
    process.env.AUTHKIT_DOMAIN = 'test-domain.authkit.app'
    process.env.WORKOS_CLIENT_ID = 'test-client-id'
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('SSE Transport Connection', () => {
    it('should successfully connect via SSE transport with valid auth', async () => {
      const response = await fetch('http://localhost:3000/sse', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      expect(response.status).toBe(200)
      expect(response.headers.get('Content-Type')).toBe('text/event-stream')
    })

    it('should fail SSE connection with invalid auth', async () => {
      const response = await fetch('http://localhost:3000/sse', {
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Invalid or expired access token')
    })

    it('should handle SSE connection timeout', async () => {
      vi.useFakeTimers()

      // Mock delayed SSE response
      server.use(
        http.get('http://localhost:3000/sse', async () => {
          await delay(30000) // 30 second delay
          return new HttpResponse('data: timeout\n\n', { status: 200 })
        })
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      try {
        const fetchPromise = fetch('http://localhost:3000/sse', {
          headers: {
            'Authorization': `Bearer ${validJWT}`
          },
          signal: controller.signal
        })

        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(5000)
        
        await expect(fetchPromise).rejects.toThrow()
      } finally {
        clearTimeout(timeoutId)
        vi.useRealTimers()
      }
    }, 10000) // Increase test timeout to 10 seconds
  })

  describe('HTTP Transport Connection', () => {
    it('should successfully connect via HTTP transport with valid auth', async () => {
      // Mock successful MCP HTTP endpoint
      server.use(
        http.post('http://localhost:3000/mcp', () => {
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: 1,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {}
            }
          })
        })
      )

      // Note: HTTP transport would use fetch or similar
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {},
            clientInfo: {
              name: 'test-client',
              version: '1.0.0'
            }
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.protocolVersion).toBe('2024-11-05')
    })

    it('should fail HTTP connection with missing auth', async () => {
      server.use(
        http.post('http://localhost:3000/mcp', () => {
          return HttpResponse.json(
            { error: 'Missing Authorization Header' },
            { 
              status: 401,
              headers: {
                'WWW-Authenticate': 'Bearer error="unauthorized"'
              }
            }
          )
        })
      )

      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize'
        })
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Missing Authorization Header')
    })

    it('should handle HTTP connection timeout', async () => {
      vi.useFakeTimers()

      // Mock delayed HTTP response
      server.use(
        http.post('http://localhost:3000/mcp', async () => {
          await delay(30000) // 30 second delay
          return HttpResponse.json({ result: 'timeout' })
        })
      )

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

      try {
        const fetchPromise = fetch('http://localhost:3000/mcp', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validJWT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'initialize'
          }),
          signal: controller.signal
        })

        // Fast-forward time to trigger timeout
        vi.advanceTimersByTime(5000)
        
        await expect(fetchPromise).rejects.toThrow()
      } finally {
        clearTimeout(timeoutId)
        vi.useRealTimers()
      }
    })
  })

  describe('Network Error Scenarios', () => {
    it('should handle DNS resolution failures', async () => {
      server.use(
        http.get('http://nonexistent-domain.local/sse', () => {
          return HttpResponse.error()
        })
      )

      await expect(
        fetch('http://nonexistent-domain.local/sse', {
          headers: {
            'Authorization': `Bearer ${validJWT}`
          }
        })
      ).rejects.toThrow()
    })

    it('should handle server 5xx errors gracefully', async () => {
      server.use(
        http.get('http://localhost:3000/sse', () => {
          return new HttpResponse(null, { status: 503 })
        })
      )

      const response = await fetch('http://localhost:3000/sse', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      expect(response.status).toBe(503)
    })

    it('should handle connection drops during session', async () => {
      let connectionCount = 0
      
      server.use(
        http.get('http://localhost:3000/sse', () => {
          connectionCount++
          if (connectionCount === 1) {
            // First connection succeeds briefly then drops
            return new HttpResponse(
              'data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05"}}\n\n',
              { 
                status: 200,
                headers: { 'Content-Type': 'text/event-stream' }
              }
            )
          } else {
            // Subsequent reconnection attempts fail
            return HttpResponse.error()
          }
        })
      )

      // First connection should succeed
      const firstResponse = await fetch('http://localhost:3000/sse', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      expect(firstResponse.status).toBe(200)
      expect(connectionCount).toBe(1)

      // Second connection should fail
      try {
        await fetch('http://localhost:3000/sse', {
          headers: {
            'Authorization': `Bearer ${validJWT}`
          }
        })
      } catch (error) {
        expect(error).toBeDefined()
        expect(connectionCount).toBe(2)
      }
    })
  })

  describe('Protocol Version Negotiation', () => {
    it('should handle unsupported protocol version', async () => {
      server.use(
        http.post('http://localhost:3000/mcp', () => {
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: 1,
            error: {
              code: -32602,
              message: 'Unsupported protocol version'
            }
          })
        })
      )

      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2099-01-01', // Future version
            capabilities: {}
          }
        })
      })

      const data = await response.json()
      expect(data.error.message).toBe('Unsupported protocol version')
    })

    it('should successfully negotiate supported protocol version', async () => {
      server.use(
        http.post('http://localhost:3000/mcp', () => {
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: 1,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                tools: {},
                resources: {}
              }
            }
          })
        })
      )

      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {}
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.protocolVersion).toBe('2024-11-05')
      expect(data.result.capabilities).toBeDefined()
    })
  })
})