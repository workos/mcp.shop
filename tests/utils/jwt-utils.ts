import * as jose from 'jose'

// Generate a test key pair for JWT signing and verification
const algorithm = 'RS256'

export const generateTestKeyPair = async () => {
  return await jose.generateKeyPair(algorithm, { extractable: true })
}

// Create a valid JWT token for testing
export const createValidJWT = async (
  keyPair: jose.GenerateKeyPairResult,
  payload: Record<string, any> = {}
) => {
  const defaultPayload = {
    iss: 'https://test-domain.authkit.app',
    aud: 'test-client-id',
    sub: 'user_01234567890abcdef',
    sid: 'session_01234567890abcdef', 
    jti: 'jwt_01234567890abcdef',
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
    ...payload
  }

  return await new jose.SignJWT(defaultPayload)
    .setProtectedHeader({ alg: algorithm, kid: 'test-key-id' })
    .sign(keyPair.privateKey)
}

// Create an expired JWT token for testing
export const createExpiredJWT = async (keyPair: jose.GenerateKeyPairResult) => {
  return await createValidJWT(keyPair, {
    exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    iat: Math.floor(Date.now() / 1000) - 7200   // 2 hours ago
  })
}

// Create a JWT with invalid audience
export const createInvalidAudienceJWT = async (keyPair: jose.GenerateKeyPairResult) => {
  return await createValidJWT(keyPair, {
    aud: 'wrong-client-id'
  })
}

// Create a JWT with invalid issuer
export const createInvalidIssuerJWT = async (keyPair: jose.GenerateKeyPairResult) => {
  return await createValidJWT(keyPair, {
    iss: 'https://wrong-domain.authkit.app'
  })
}

// Create a malformed JWT token
export const createMalformedJWT = () => {
  return 'malformed.jwt.token'
}

// Extract JWK from key pair for JWKS mocking
export const extractJWK = async (keyPair: jose.GenerateKeyPairResult) => {
  const jwk = await jose.exportJWK(keyPair.publicKey)
  return {
    ...jwk,
    kty: 'RSA',
    use: 'sig', 
    kid: 'test-key-id',
    alg: algorithm
  }
}