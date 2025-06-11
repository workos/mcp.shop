import { NextRequest } from "next/server";
import * as jose from "jose";
import { getWorkOS } from "@workos-inc/authkit-nextjs";

export type User = Awaited<
  ReturnType<ReturnType<typeof getWorkOS>["userManagement"]["getUser"]>
>;

export interface Authorization {
  user: User;
  accessToken: string;
  claims: {
    iss: string;
    aud: string;
    sub: string;
    sid: string;
    jti: string;
  };
}

/**
 * Middleware to protect MCP server endpoints with AuthKit authentication.
 *
 * This implements the authorization flow for Model Context Protocol (MCP) servers
 * as specified in the MCP authorization spec. AuthKit acts as the OAuth 2.0
 * authorization server while your MCP server is the resource server.
 *
 * Prerequisites:
 * - Enable Dynamic Client Registration in WorkOS Dashboard under Applications → Configuration
 * - Set AUTHKIT_DOMAIN environment variable (e.g., "subdomain.authkit.app")
 * - Implement /.well-known/oauth-protected-resource endpoint in your app
 *
 * @param next - The handler function to call after successful authentication
 * @returns A middleware function that verifies AuthKit access tokens
 */
export function withAuthkit(
  next: (request: NextRequest, auth: Authorization) => Promise<Response>,
): (request: NextRequest) => Promise<Response> {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;

  // Create a JWKS client to fetch and cache AuthKit's public keys
  // These keys are used to verify the JWT signatures
  const jwks = jose.createRemoteJWKSet(
    new URL(`https://${authkitDomain}/oauth2/jwks`),
  );

  const mcpServerDomain =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";

  // WWW-Authenticate header with resource_metadata challenge parameter
  // This enables MCP clients to discover the authorization server dynamically
  // when they receive a 401 response, promoting zero-config interoperability
  const wwwAuthenticateHeader = [
    'Bearer error="unauthorized"',
    'error_description="Authorization needed"',
    `resource_metadata="${protocol}://${mcpServerDomain}/.well-known/oauth-protected-resource"`,
  ].join(", ");

  const unauthorized = (error: string) =>
    new Response(JSON.stringify({ error }), {
      status: 401,
      headers: {
        "WWW-Authenticate": wwwAuthenticateHeader,
        "Content-Type": "application/json",
      },
    });

  return async (request: NextRequest) => {
    // Extract Bearer token from Authorization header
    const authorizationHeader = request.headers.get("Authorization");
    if (!authorizationHeader) {
      return unauthorized("Missing Authorization Header");
    }

    const [scheme = "", token] = authorizationHeader.split(" ");
    if (!/^Bearer$/i.test(scheme) || !token) {
      return unauthorized("Invalid Authorization Header");
    }

    let payload: Authorization["claims"];
    try {
      // Verify the JWT access token issued by AuthKit
      // This validates the signature, issuer, and expiration
      ({ payload } = await jose.jwtVerify(token, jwks, {
        issuer: `https://${authkitDomain}`,
      }));
    } catch (error) {
      if (
        error instanceof jose.errors.JWTExpired ||
        error instanceof jose.errors.JWKSInvalid
      ) {
        return unauthorized("Invalid or expired access token");
      }

      if (error instanceof jose.errors.JOSEError) {
        console.error("Error initializing JWKS", { error });

        return new Response("Internal server error", { status: 500 });
      }

      throw error;
    }

    // Fetch the full user profile from WorkOS using the subject claim
    // This provides additional user context beyond what's in the JWT
    const workos = getWorkOS();
    const user = await workos.userManagement.getUser(payload.sub);

    // Pass the authenticated user context to the protected handler
    return next(request, { user, accessToken: token, claims: payload });
  };
}
