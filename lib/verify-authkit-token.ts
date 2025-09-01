import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import * as jose from "jose";
import { getWorkOS } from "@workos-inc/authkit-nextjs";

/**
 * WorkOS User type from AuthKit
 * This type represents the full user object returned by WorkOS UserManagement API
 */
export type User = Awaited<
  ReturnType<ReturnType<typeof getWorkOS>["userManagement"]["getUser"]>
>;

// Lazy initialization of JWKS client
let jwks: ReturnType<typeof jose.createRemoteJWKSet> | null = null;
let authkitDomain: string | null = null;
let workosClientId: string | null = null;

function getConfig() {
  if (!authkitDomain) {
    authkitDomain = process.env.AUTHKIT_DOMAIN || null;
    if (!authkitDomain) {
      throw new Error("AUTHKIT_DOMAIN environment variable is required");
    }
  }
  
  if (!workosClientId) {
    workosClientId = process.env.WORKOS_CLIENT_ID || null;
    if (!workosClientId) {
      throw new Error("WORKOS_CLIENT_ID environment variable is required");
    }
  }
  
  if (!jwks) {
    jwks = jose.createRemoteJWKSet(
      new URL(`https://${authkitDomain}/oauth2/jwks`)
    );
  }
  
  return { jwks, authkitDomain, workosClientId };
}

/**
 * Verify WorkOS AuthKit bearer tokens and return MCP AuthInfo
 * This integrates WorkOS AuthKit with the MCP SDK's authentication system
 * 
 * Validates:
 * - JWT signature using AuthKit's public keys
 * - Token issuer matches AuthKit domain  
 * - Token audience matches WorkOS Client ID (required)
 * - Token is not expired
 * 
 * Required environment variables:
 * - AUTHKIT_DOMAIN: Your AuthKit domain (e.g., "subdomain.authkit.app")
 * - WORKOS_CLIENT_ID: Your WorkOS client ID for audience validation
 */
export async function verifyAuthkitToken(
  _req: Request,
  bearerToken?: string
): Promise<AuthInfo | undefined> {
  if (!bearerToken) {
    return undefined;
  }

  try {
    const { jwks, authkitDomain, workosClientId } = getConfig();
    
    // Verify the JWT with AuthKit's public keys
    // Validate audience to ensure token is for this application
    const { payload } = await jose.jwtVerify(bearerToken, jwks, {
      issuer: `https://${authkitDomain}`,
      audience: workosClientId,
    });

    // Fetch full user profile from WorkOS
    const workos = getWorkOS();
    const userId = payload.sub as string;
    const user = await workos.userManagement.getUser(userId);

    // Return MCP AuthInfo structure
    return {
      token: bearerToken,
      clientId: user.id,
      scopes: [], 
      expiresAt: payload.exp,
      extra: {
        user, // Full WorkOS user object for use in tools
        sessionId: payload.sid,
        jti: payload.jti,
      },
    };
  } catch (error) {
    // Log detailed error for debugging but return undefined for invalid tokens
    if (error instanceof jose.errors.JWTExpired) {
      console.error("AuthKit token expired");
    } else if (error instanceof jose.errors.JWTClaimValidationFailed) {
      // This catches audience validation failures
      console.error("Token validation failed:", error.message);
    } else if (error instanceof jose.errors.JWKSInvalid) {
      console.error("Invalid JWKS from AuthKit:", error.message);
    } else if (error instanceof jose.errors.JOSEError) {
      console.error("Token verification failed:", error.message);
    } else {
      console.error("Unexpected error during token verification:", error);
    }
    return undefined;
  }
}