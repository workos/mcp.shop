import { NextRequest } from "next/server";
import * as jose from "jose";

export interface Authorization {
  accessToken: string;
  claims: {
    iss: string;
    aud: string;
    sub: string;
    sid: string;
    jti: string;
  };
}

export function withAuthkit(
  next: (request: NextRequest, auth: Authorization) => Promise<Response>,
): (request: NextRequest) => Promise<Response> {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;

  const jwks = jose.createRemoteJWKSet(
    new URL(`https://${authkitDomain}/oauth2/jwks`),
  );

  const mcpServerDomain =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";

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

    return next(request, { accessToken: token, claims: payload });
  };
}
