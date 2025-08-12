import * as jose from "jose";
import { getWorkOS } from "@workos-inc/authkit-nextjs";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";

export type User = Awaited<
  ReturnType<ReturnType<typeof getWorkOS>["userManagement"]["getUser"]>
>;

/**
 * Auth info structure that includes WorkOS user data.
 * Access the user via: authInfo.user
 */
export interface AuthKitAuthInfo extends AuthInfo {
  user: User;
}

/**
 * Type for the extra parameter that MCP tools receive when using AuthKit.
 * Access auth via: extra.authInfo
 */
export interface AuthKitToolContext {
  authInfo?: AuthKitAuthInfo;
}

/**
 * Verify token function for use with withMcpAuth from mcp-handler.
 * Returns auth info with the WorkOS user attached directly for easy access.
 */
export async function verifyToken(
  _request: Request,
  bearerToken?: string,
): Promise<AuthKitAuthInfo | undefined> {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;
  const jwks = jose.createRemoteJWKSet(
    new URL(`https://${authkitDomain}/oauth2/jwks`),
  );

  if (!bearerToken) {
    return undefined;
  }

  try {
    // Verify the JWT access token issued by AuthKit
    const { payload } = await jose.jwtVerify(bearerToken, jwks, {
      audience: process.env.WORKOS_CLIENT_ID,
      issuer: `https://${authkitDomain}`,
    });

    // Validate required claims
    if (!payload.sub) {
      console.error("Missing sub claim in token");
      return undefined;
    }

    // Fetch the full user profile from WorkOS
    const workos = getWorkOS();
    const user = await workos.userManagement.getUser(payload.sub);

    // Return simplified auth info with user at top level
    return {
      token: bearerToken,
      clientId: payload.sub,
      scopes: [], // Add scopes if needed
      user, // User is directly accessible via authInfo.user
    };
  } catch (error) {
    console.error("Token verification failed:", error);
    return undefined;
  }
}