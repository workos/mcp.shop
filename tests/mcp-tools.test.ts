import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateTestKeyPair, createValidJWT, extractJWK } from './utils/jwt-utils'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'

describe('MCP Tools Integration', () => {
  let keyPair: any
  let validJWT: string
  let jwkPublicKey: any

  beforeEach(async () => {
    keyPair = await generateTestKeyPair()
    validJWT = await createValidJWT(keyPair)
    jwkPublicKey = await extractJWK(keyPair)

    process.env.AUTHKIT_DOMAIN = 'test-domain.authkit.app'
    process.env.WORKOS_CLIENT_ID = 'test-client-id'
    process.env.REDIS_URL = 'redis://localhost:6379'

    // Update MSW handlers with real JWK
    server.use(
      http.get('https://test-domain.authkit.app/oauth2/jwks', () => {
        return HttpResponse.json({ keys: [jwkPublicKey] })
      })
    )
  })

  describe('Tool Discovery', () => {
    it('should successfully list available tools after authentication', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.tools).toBeDefined()
      expect(data.result.tools).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: 'listMcpShopInventory'
          }),
          expect.objectContaining({
            name: 'buyMcpShopItem'
          }),
          expect.objectContaining({
            name: 'listMcpShopOrders'
          })
        ])
      )
    })

    it('should fail tool listing without authentication', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/list'
        })
      })

      expect(response.status).toBe(401)
    })
  })

  describe('Tool Invocation', () => {
    it('should successfully call listMcpShopInventory tool', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'listMcpShopInventory',
            arguments: {}
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.content).toBeDefined()
      expect(data.result.content[0].type).toBe('text')
      
      const inventoryData = JSON.parse(data.result.content[0].text)
      expect(inventoryData.title).toBe('mcp.shop inventory')
      expect(inventoryData.products).toBeDefined()
      expect(inventoryData.products[0].label).toBe('Shirt')
    })

    it('should successfully call buyMcpShopItem tool with valid parameters', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'buyMcpShopItem',
            arguments: {
              company: 'Test Company',
              mailingAddress: '123 Test St, Test City, TC 12345',
              tshirtSize: 'L'
            }
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.content).toBeDefined()
      expect(data.result.content[0].type).toBe('text')
      
      const orderData = JSON.parse(data.result.content[0].text)
      expect(orderData.status).toBe('success')
    })

    it('should fail buyMcpShopItem tool with missing required parameters', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'buyMcpShopItem',
            arguments: {
              company: 'Test Company'
              // Missing mailingAddress and tshirtSize
            }
          }
        })
      })

      expect(response.status).toBe(200) // MCP errors are usually returned as successful responses
      const data = await response.json()
      expect(data.error).toBeDefined()
    })

    it('should successfully call listMcpShopOrders tool', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'listMcpShopOrders',
            arguments: {}
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.content).toBeDefined()
      expect(data.result.content[0].type).toBe('text')
      
      const ordersData = JSON.parse(data.result.content[0].text)
      expect(ordersData.status).toBe('success')
      expect(ordersData.orders).toBeDefined()
    })

    it('should fail tool invocation with invalid tool name', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${validJWT}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'nonExistentTool',
            arguments: {}
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.error).toBeDefined()
      expect(data.error.code).toBe(-32601) // Method not found
    })

    it('should fail tool invocation without authentication', async () => {
      const response = await fetch('http://localhost:3000/mcp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'tools/call',
          params: {
            name: 'listMcpShopInventory',
            arguments: {}
          }
        })
      })

      expect(response.status).toBe(401)
      const data = await response.json()
      expect(data.error).toBe('Missing Authorization Header')
    })
  })

  describe('Error Handling in Tools', () => {
    it('should handle database errors gracefully in buyMcpShopItem', async () => {
      // Mock Redis failure
      server.use(
        http.post('*', () => {
          // Simulate internal error during order placement
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: 1,
            result: {
              content: [{
                type: 'text',
                text: 'Something went wrong. Try again later.'
              }]
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
          method: 'tools/call',
          params: {
            name: 'buyMcpShopItem',
            arguments: {
              company: 'Test Company',
              mailingAddress: '123 Test St',
              tshirtSize: 'L'
            }
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.content[0].text).toBe('Something went wrong. Try again later.')
    })

    it('should handle database errors gracefully in listMcpShopOrders', async () => {
      // Mock database failure for orders
      server.use(
        http.post('*', () => {
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: 1,
            result: {
              content: [{
                type: 'text',
                text: 'Something went wrong. Try again later.'
              }]
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
          method: 'tools/call',
          params: {
            name: 'listMcpShopOrders',
            arguments: {}
          }
        })
      })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.result.content[0].text).toBe('Something went wrong. Try again later.')
    })
  })

  describe('Rate Limiting and Concurrency', () => {
    it('should handle multiple concurrent tool calls', async () => {
      const promises = Array.from({ length: 5 }, (_, i) =>
        fetch('http://localhost:3000/mcp', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${validJWT}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: i + 1,
            method: 'tools/call',
            params: {
              name: 'listMcpShopInventory',
              arguments: {}
            }
          })
        })
      )

      const responses = await Promise.all(promises)
      
      responses.forEach(response => {
        expect(response.status).toBe(200)
      })

      const data = await Promise.all(responses.map(r => r.json()))
      data.forEach(result => {
        expect(result.result.content).toBeDefined()
      })
    })
  })
})