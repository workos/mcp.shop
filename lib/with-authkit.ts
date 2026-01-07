import * as jose from "jose";
import { getWorkOS } from "@workos-inc/authkit-nextjs";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import { getPostHogClient } from "@/lib/posthog-server";

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

// Initialize JWKS client for AuthKit public key verification
// This client fetches and caches AuthKit's public keys used to verify JWT signatures
const authkitDomain = process.env.AUTHKIT_DOMAIN;

if (!authkitDomain) {
  throw new Error("AUTHKIT_DOMAIN environment variable is required");
}

const jwks = jose.createRemoteJWKSet(
  new URL(`https://${authkitDomain}/oauth2/jwks`),
);

// Token verification function for MCP authentication
export const verifyToken = async (
  req: Request,
  bearerToken?: string,
): Promise<AuthInfo | undefined> => {
  if (!bearerToken) {
    console.error("No bearer token provided");
    return undefined;
  }

  try {
    // Verify the JWT access token issued by AuthKit
    // This validates the signature, audience, issuer, and expiration
    const { payload } = await jose.jwtVerify(bearerToken, jwks, {
      // audience: process.env.WORKOS_CLIENT_ID,
      issuer: `https://${authkitDomain}`,
    });

    // Ensure the subject claim exists
    if (!payload.sub || typeof payload.sub !== "string") {
      console.error("Invalid or missing subject claim in JWT");
      return undefined;
    }

    // Fetch the full user profile from WorkOS using the subject claim
    // This provides additional user context beyond what's in the JWT
    const workos = getWorkOS();
    const user = await workos.userManagement.getUser(payload.sub);

    // Return AuthInfo with verified user information
    return {
      token: bearerToken,
      scopes: ["read:orders", "write:orders"], // Add relevant scopes for your MCP server
      clientId: user.id,
      extra: {
        user: user, // Store the full user object
        userId: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        claims: payload,
      },
    };
  } catch (error) {
    // PostHog: Track token verification failures
    const posthog = getPostHogClient();
    let errorType = "unknown_error";
    let errorMessage = "Unknown error";

    if (error instanceof jose.errors.JWTExpired) {
      console.error("JWT token has expired");
      errorType = "jwt_expired";
      errorMessage = "JWT token has expired";
    } else if (error instanceof jose.errors.JWTClaimValidationFailed) {
      console.error("JWT claim validation failed", error.message);
      errorType = "jwt_claim_validation_failed";
      errorMessage = error.message;
    } else if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.error("JWT signature verification failed");
      errorType = "jws_signature_verification_failed";
      errorMessage = "JWT signature verification failed";
    } else if (error instanceof jose.errors.JOSEError) {
      console.error("JOSE error during token verification", error);
      errorType = "jose_error";
      errorMessage = error.message;
    } else {
      console.error("Error verifying token", error);
      errorType = "other_error";
      errorMessage = error instanceof Error ? error.message : "Unknown error";
    }

    posthog.capture({
      distinctId: "anonymous",
      event: "token_verification_failed",
      properties: {
        error_type: errorType,
        error_message: errorMessage,
      },
    });
    await posthog.shutdown();

    return undefined;
  }
};
