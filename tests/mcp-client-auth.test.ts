import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'

// Mock WorkOS AuthKit before importing withAuthkit
vi.mock('@workos-inc/authkit-nextjs', () => ({
  getWorkOS: vi.fn(() => ({
    userManagement: {
      getUser: vi.fn().mockResolvedValue({
        id: 'user_01234567890abcdef',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        profilePictureUrl: null,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      })
    }
  }))
}))

import { withAuthkit, type Authorization } from '@/lib/with-authkit'
import { 
  generateTestKeyPair, 
  createValidJWT, 
  createExpiredJWT,
  createInvalidAudienceJWT,
  createInvalidIssuerJWT,
  createMalformedJWT,
  extractJWK 
} from './utils/jwt-utils'
import { server } from './mocks/server'
import { http, HttpResponse } from 'msw'
import * as jose from 'jose'

describe('MCP Client Authentication Flow', () => {
  let keyPair: jose.GenerateKeyPairResult
  let validJWT: string
  let jwkPublicKey: any

  beforeEach(async () => {
    // Generate a fresh key pair for each test
    keyPair = await generateTestKeyPair()
    validJWT = await createValidJWT(keyPair)
    jwkPublicKey = await extractJWK(keyPair)

    // Mock environment variables
    process.env.AUTHKIT_DOMAIN = 'test-domain.authkit.app'
    process.env.WORKOS_CLIENT_ID = 'test-client-id'
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = 'localhost:3000'

    // Update MSW handlers with real JWK
    server.use(
      http.get('https://test-domain.authkit.app/oauth2/jwks', () => {
        return HttpResponse.json({ keys: [jwkPublicKey] })
      })
    )
  })

  describe('Successful Authentication Flows', () => {
    it('should successfully authenticate with valid JWT and proceed to handler', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response('Success', { status: 200 }))
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('Success')
      expect(mockHandler).toHaveBeenCalledOnce()
      
      // Verify the auth object passed to handler
      const authArg = mockHandler.mock.calls[0][1] as Authorization
      expect(authArg.user).toBeDefined()
      expect(authArg.accessToken).toBe(validJWT)
      expect(authArg.claims.sub).toBe('user_01234567890abcdef')
      expect(authArg.claims.aud).toBe('test-client-id')
    })

    it('should handle SSE endpoint authentication', async () => {
      const mockHandler = vi.fn().mockResolvedValue(new Response('SSE Success', { status: 200 }))
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/sse', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(200)
      expect(await response.text()).toBe('SSE Success')
      expect(mockHandler).toHaveBeenCalledOnce()
    })

    it('should handle HTTPS production domain correctly', async () => {
      process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL = 'myapp.vercel.app'
      
      const mockHandler = vi.fn().mockResolvedValue(new Response('Production Success', { status: 200 }))
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('https://myapp.vercel.app/mcp', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(200)
    })
  })

  describe('Authentication Failure Scenarios', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp')
      const response = await authenticatedHandler(request)

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Missing Authorization Header')
      expect(mockHandler).not.toHaveBeenCalled()

      // Verify WWW-Authenticate header
      const wwwAuth = response.headers.get('WWW-Authenticate')
      expect(wwwAuth).toContain('Bearer error="unauthorized"')
      expect(wwwAuth).toContain('resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource/mcp"')
    })

    it('should return 401 when Authorization header format is invalid', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': 'InvalidFormat token123'
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Invalid Authorization Header')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should return 401 when Bearer token is missing', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': 'Bearer'
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Invalid Authorization Header')
    })

    it('should return 401 when JWT token is expired', async () => {
      const expiredJWT = await createExpiredJWT(keyPair)
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${expiredJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(401)
      const body = await response.json()
      expect(body.error).toBe('Invalid or expired access token')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should return 500 when JWT audience is invalid', async () => {
      const invalidAudJWT = await createInvalidAudienceJWT(keyPair)
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${invalidAudJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should return 500 when JWT issuer is invalid', async () => {
      const invalidIssJWT = await createInvalidIssuerJWT(keyPair)
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${invalidIssJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    it('should return 500 when JWT token is malformed', async () => {
      const malformedJWT = createMalformedJWT()
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${malformedJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
      expect(mockHandler).not.toHaveBeenCalled()
    })
  })

  describe('JWKS and Network Failure Scenarios', () => {
    it('should return 500 when JWKS endpoint is unavailable', async () => {
      // Override with failing JWKS endpoint
      server.use(
        http.get('https://test-domain.authkit.app/oauth2/jwks', () => {
          return new HttpResponse(null, { status: 500 })
        })
      )

      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp', {
        headers: {
          'Authorization': `Bearer ${validJWT}`
        }
      })

      const response = await authenticatedHandler(request)

      expect(response.status).toBe(500)
      expect(await response.text()).toBe('Internal server error')
      expect(mockHandler).not.toHaveBeenCalled()
    })

    // Note: WorkOS user fetch failures are handled by the WorkOS SDK internally
    // and would typically result in proper error responses. This edge case is
    // difficult to test reliably in the test environment due to mocking limitations.
  })

  describe('Configuration Error Scenarios', () => {
    it('should throw error when AUTHKIT_DOMAIN is not set', () => {
      delete process.env.AUTHKIT_DOMAIN

      const mockHandler = vi.fn()
      
      expect(() => withAuthkit(mockHandler)).toThrow('AUTHKIT_DOMAIN is not set')
    })
  })

  describe('Resource Metadata Discovery', () => {
    it('should include correct resource metadata for MCP endpoint', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/mcp')
      const response = await authenticatedHandler(request)

      const wwwAuth = response.headers.get('WWW-Authenticate')
      expect(wwwAuth).toContain('resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource/mcp"')
    })

    it('should include correct resource metadata for SSE endpoint', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/sse')
      const response = await authenticatedHandler(request)

      const wwwAuth = response.headers.get('WWW-Authenticate')
      expect(wwwAuth).toContain('resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource/sse"')
    })

    it('should include empty resource metadata for other endpoints', async () => {
      const mockHandler = vi.fn()
      const authenticatedHandler = withAuthkit(mockHandler)

      const request = new NextRequest('http://localhost:3000/other')
      const response = await authenticatedHandler(request)

      const wwwAuth = response.headers.get('WWW-Authenticate')
      expect(wwwAuth).toContain('resource_metadata="http://localhost:3000/.well-known/oauth-protected-resource"')
    })
  })
})