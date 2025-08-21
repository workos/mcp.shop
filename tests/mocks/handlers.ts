import { http, HttpResponse } from 'msw'
import * as jose from 'jose'

// Mock JWKS for JWT verification
const mockJwks = {
  keys: [
    {
      kty: 'RSA',
      use: 'sig',
      kid: 'test-key-id',
      n: 'test-modulus',
      e: 'AQAB',
      alg: 'RS256'
    }
  ]
}

// Mock WorkOS user response
const mockUser = {
  id: 'user_01234567890abcdef',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  profilePictureUrl: null,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
}

export const handlers = [
  // Mock JWKS endpoint
  http.get('https://test-domain.authkit.app/oauth2/jwks', () => {
    return HttpResponse.json(mockJwks)
  }),

  // Mock WorkOS user management endpoint
  http.get('https://api.workos.com/user_management/users/:userId', () => {
    return HttpResponse.json(mockUser)
  }),

  // Mock OAuth protected resource endpoint  
  http.get('*/oauth-protected-resource*', () => {
    return HttpResponse.json({
      authorization_server: 'https://test-domain.authkit.app',
      authorization_endpoint: 'https://test-domain.authkit.app/oauth2/authorize',
      token_endpoint: 'https://test-domain.authkit.app/oauth2/token'
    })
  }),

  // Mock MCP server endpoints
  http.post('http://localhost:3000/mcp', async ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Missing Authorization Header' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="unauthorized"'
          }
        }
      )
    }

    const body = await request.json() as any
    
    // Handle tools/list requests
    if (body.method === 'tools/list') {
      return HttpResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          tools: [
            {
              name: 'listMcpShopInventory',
              description: 'Returns a list of items for sale at mcp.shop'
            },
            {
              name: 'buyMcpShopItem', 
              description: 'Orders a t-shirt from the MCP shop'
            },
            {
              name: 'listMcpShopOrders',
              description: 'Lists orders placed by the user'
            }
          ]
        }
      })
    }

    // Handle tools/call requests
    if (body.method === 'tools/call') {
      const toolName = body.params?.name

      switch (toolName) {
        case 'listMcpShopInventory':
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  title: 'mcp.shop inventory',
                  products: [{
                    label: 'Shirt',
                    description: 'MCP Shop T-Shirt',
                    image_url: 'https://mcp.shop/shirt.jpg'
                  }]
                })
              }]
            }
          })

        case 'buyMcpShopItem':
          const args = body.params?.arguments
          if (!args?.company || !args?.mailingAddress || !args?.tshirtSize) {
            return HttpResponse.json({
              jsonrpc: '2.0',
              id: body.id,
              error: {
                code: -32602,
                message: 'Invalid params'
              }
            })
          }
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  status: 'success',
                  orderId: 'order_123'
                })
              }]
            }
          })

        case 'listMcpShopOrders':
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            result: {
              content: [{
                type: 'text',
                text: JSON.stringify({
                  status: 'success',
                  orders: []
                })
              }]
            }
          })

        default:
          return HttpResponse.json({
            jsonrpc: '2.0',
            id: body.id,
            error: {
              code: -32601,
              message: 'Method not found'
            }
          })
      }
    }

    // Handle initialize requests
    if (body.method === 'initialize') {
      return HttpResponse.json({
        jsonrpc: '2.0',
        id: body.id,
        result: {
          protocolVersion: '2024-11-05',
          capabilities: {
            tools: {},
            resources: {}
          }
        }
      })
    }

    // Default response for unhandled methods
    return HttpResponse.json({
      jsonrpc: '2.0',
      id: body.id,
      error: {
        code: -32601,
        message: 'Method not found'
      }
    })
  }),

  // Mock SSE endpoint
  http.get('http://localhost:3000/sse', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        { error: 'Invalid or expired access token' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="unauthorized"'
          }
        }
      )
    }

    // Extract token and validate it
    const token = authHeader.split(' ')[1]
    if (!token || token === 'invalid-token' || token.length < 10) {
      return HttpResponse.json(
        { error: 'Invalid or expired access token' },
        { 
          status: 401,
          headers: {
            'WWW-Authenticate': 'Bearer error="unauthorized"'
          }
        }
      )
    }

    return new HttpResponse(
      'data: {"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{}}}\n\n',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      }
    )
  }),

  // Mock JWKS failure scenarios
  http.get('https://invalid-domain.authkit.app/oauth2/jwks', () => {
    return new HttpResponse(null, { status: 500 })
  }),

  // Mock network timeout scenarios
  http.get('https://timeout-domain.authkit.app/oauth2/jwks', () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(new HttpResponse(null, { status: 408 })), 10000)
    })
  }),
]