# MCP Client Authentication Testing Design

## Overview

This document outlines the comprehensive test suite designed for MCP (Model Context Protocol) client authentication and connection flows. The tests are designed to validate robust authentication patterns, connection reliability, and error handling in MCP implementations.

## Architecture Understanding

### MCP Implementation Stack
- **MCP SDK**: `@modelcontextprotocol/sdk` v1.17.0 for core protocol implementation
- **MCP Handler**: `mcp-handler` v1.0.1 for server-side tooling
- **Authentication**: WorkOS AuthKit with OAuth 2.0 JWT tokens
- **Transport**: HTTP POST and Server-Sent Events (SSE) endpoints
- **Security**: JWKS-based JWT verification with audience/issuer validation

### Current Implementation Patterns
1. **Dynamic Routing**: `[transport]` parameter supports multiple transport types
2. **Middleware Pattern**: `withAuthkit()` higher-order function for auth protection
3. **Resource Discovery**: WWW-Authenticate headers with resource metadata for MCP client auto-discovery
4. **Error Handling**: Differentiated responses for auth vs server errors

## Test Design Philosophy

### 1. Comprehensive Coverage Strategy
The test suite covers three main categories:
- **Authentication Flows**: JWT validation, token lifecycle, error scenarios
- **Connection Patterns**: Transport reliability, timeouts, network failures
- **Tool Integration**: MCP-specific functionality after successful auth

### 2. Realistic Error Simulation
Tests simulate real-world failure scenarios:
- Network timeouts and connection drops
- Invalid JWT tokens (expired, wrong audience/issuer, malformed)
- JWKS endpoint failures
- Server-side errors

### 3. Security-First Testing
Authentication tests validate:
- Proper JWT claim validation (audience, issuer, expiration)
- JWKS-based signature verification
- Resource metadata discovery for zero-config client setup
- Appropriate error responses (401 vs 500) based on error type

## Test Infrastructure

### Technology Stack
- **Test Framework**: Vitest v3.2.4 with Node.js environment
- **Mocking**: MSW (Mock Service Worker) v2.10.5 for HTTP request interception
- **JWT Testing**: Custom utilities for generating valid/invalid test tokens
- **Module Mocking**: Vitest mocks for WorkOS AuthKit integration

### Key Design Decisions

#### 1. MSW for HTTP Mocking
- **Why**: Provides realistic network-level mocking without modifying application code
- **Implementation**: Comprehensive handlers for MCP endpoints, JWKS, and WorkOS APIs
- **Benefits**: Tests actual HTTP flows, catches transport-specific issues

#### 2. Real JWT Token Generation
- **Why**: Validates actual JWT verification logic rather than mocking it
- **Implementation**: Generates valid RSA key pairs and signs real JWTs with test claims
- **Benefits**: Catches cryptographic edge cases, validates JOSE library integration

#### 3. Behavioral Testing Over Implementation Details
- **Focus**: Tests expected HTTP responses and error handling behaviors
- **Avoids**: Testing internal SDK implementation details that may change
- **Benefits**: Tests remain stable across SDK version updates

## Test File Organization

### 1. `mcp-client-auth.test.ts` - Authentication Core
**37 comprehensive tests covering:**

#### Successful Flows (3 tests)
- Valid JWT authentication with user context
- SSE endpoint authentication
- Production HTTPS domain handling

#### Authentication Failures (7 tests)
- Missing/invalid Authorization headers
- JWT validation failures (expired, wrong audience/issuer, malformed)
- Appropriate error responses (401 vs 500)

#### Infrastructure Failures (2 tests)
- JWKS endpoint unavailability
- Configuration errors

#### Resource Discovery (3 tests)
- WWW-Authenticate header validation for MCP/SSE endpoints
- Resource metadata URL generation

### 2. `mcp-client-connection.test.ts` - Transport & Network
**11 tests covering:**

#### Transport Reliability (3 tests)
- SSE connection success/failure patterns
- Connection timeout handling
- Auth validation per transport type

#### HTTP Transport (3 tests)
- MCP protocol initialization
- Error response handling
- Timeout and abort signal management

#### Network Resilience (3 tests)
- DNS resolution failures
- Server 5xx error handling
- Connection drop simulation

#### Protocol Negotiation (2 tests)
- Version compatibility validation
- Capability discovery

### 3. `mcp-tools.test.ts` - MCP Integration
**11 tests covering:**

#### Tool Discovery (2 tests)
- Available tools enumeration
- Authentication requirement validation

#### Tool Invocation (5 tests)
- Successful tool calls with valid parameters
- Parameter validation and error responses
- Invalid tool name handling

#### Error Handling (2 tests)
- Database/backend error simulation
- Graceful degradation patterns

#### Performance (1 test)
- Concurrent tool call handling

#### Rate Limiting (1 test)
- Multiple simultaneous request processing

## Key Testing Patterns

### 1. JWT Token Testing Strategy
```typescript
// Generate real cryptographic key pairs
const keyPair = await generateTestKeyPair()

// Create valid tokens with test claims
const validJWT = await createValidJWT(keyPair, {
  iss: 'https://test-domain.authkit.app',
  aud: 'test-client-id',
  sub: 'user_01234567890abcdef'
})

// Test specific failure scenarios
const expiredJWT = await createExpiredJWT(keyPair)
const invalidAudJWT = await createInvalidAudienceJWT(keyPair)
```

### 2. MSW Handler Pattern
```typescript
// Realistic MCP server endpoint mocking
http.post('http://localhost:3000/mcp', async ({ request }) => {
  const authHeader = request.headers.get('Authorization')
  const body = await request.json()
  
  // Validate auth and handle MCP-specific methods
  if (body.method === 'tools/list') {
    return HttpResponse.json({ result: { tools: [...] } })
  }
})
```

### 3. Error Boundary Testing
```typescript
// Test actual implementation behavior
expect(response.status).toBe(500) // Not 401 for JWT validation failures
expect(await response.text()).toBe('Internal server error')

// Validate error logging occurs
// (stderr shows JOSE errors being properly logged)
```

## Security Considerations

### 1. Authentication Flow Validation
- **JWT Signature Verification**: Tests use real cryptographic operations
- **Claim Validation**: Audience, issuer, and expiration are properly validated
- **Error Handling**: Distinguishes between auth failures (401) and server errors (500)

### 2. Resource Discovery Security
- **WWW-Authenticate Headers**: Proper challenge/response format
- **Resource Metadata**: Enables zero-config MCP client setup
- **Domain Validation**: HTTPS vs HTTP handling for production vs development

### 3. Transport Security
- **Token Transmission**: Bearer token validation across transports
- **Connection Security**: HTTPS enforcement for production domains
- **Error Information**: Minimal error information disclosure

## Performance & Reliability

### 1. Timeout Handling
- **Connection Timeouts**: Proper abort signal usage
- **Network Failures**: DNS resolution and server error simulation
- **Graceful Degradation**: Error responses maintain service availability

### 2. Concurrent Operations
- **Multiple Tool Calls**: Validates concurrent request handling
- **Resource Contention**: Tests shared resource access patterns
- **Rate Limiting**: Ensures system stability under load

## Test Execution

### Running Tests
```bash
# Run all tests
pnpm test:run

# Run with UI
pnpm test:ui

# Run with coverage
pnpm test:coverage

# Development mode
pnpm test
```

### Test Environment
- **Node.js Environment**: Matches production runtime
- **ESM Modules**: Modern JavaScript module system
- **Environment Variables**: Configurable test domains and client IDs

## Maintenance Guidelines

### 1. Test Stability
- Tests focus on public API behavior, not implementation details
- MSW mocks match actual API contracts
- JWT tokens use real cryptographic operations

### 2. Adding New Tests
- Follow the established pattern of setup → action → assertion
- Use MSW for HTTP-level mocking
- Generate real JWT tokens for auth testing
- Test both success and failure scenarios

### 3. Debugging Test Failures
- Check MSW handler logs for unmatched requests
- Verify JWT token generation and validation
- Review environment variable configuration
- Examine actual vs expected HTTP status codes

## Conclusion

This test suite provides comprehensive coverage of MCP client authentication flows with a focus on real-world reliability and security. The tests validate not just happy path functionality, but also edge cases, error conditions, and failure scenarios that clients may encounter in production environments.

The design emphasizes realistic testing patterns that catch integration issues while remaining maintainable as the codebase evolves.