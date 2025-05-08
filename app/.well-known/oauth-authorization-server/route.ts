import { NextRequest } from "next/server";

export function GET(_request: NextRequest): Response {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;

  return new Response(
    JSON.stringify({
      issuer: `https://${authkitDomain}`,
      authorization_endpoint: `https://${authkitDomain}/oauth2/authorize`,
      token_endpoint: `https://${authkitDomain}/oauth2/token`,
      registration_endpoint: `https://${authkitDomain}/oauth2/register`,
      response_types_supported: ["code"],
      response_modes_supported: ["query"],
      scopes_supported: ["openid", "profile", "email", "offline_access"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      token_endpoint_auth_methods_supported: ["none"],
      code_challenge_methods_supported: ["S256"],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
