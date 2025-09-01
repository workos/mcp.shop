/**
 * OAuth Authorization Server Metadata endpoint for MCP compatibility
 * 
 * Some MCP clients don't support Protected Resource Metadata and instead
 * fetch authorization server metadata directly from the MCP server.
 * This endpoint returns AuthKit as the authorization server.
 * 
 */
export function GET(): Response {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;
  
  if (!authkitDomain) {
    return new Response(
      JSON.stringify({ 
        error: "Server configuration error",
        message: "AUTHKIT_DOMAIN environment variable is not configured" 
      }),
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Return AuthKit metadata as documented
  return new Response(
    JSON.stringify({
      issuer: `https://${authkitDomain}`,
      authorization_endpoint: `https://${authkitDomain}/oauth2/authorize`,
      token_endpoint: `https://${authkitDomain}/oauth2/token`,
      registration_endpoint: `https://${authkitDomain}/oauth2/register`,
      introspection_endpoint: `https://${authkitDomain}/oauth2/introspection`,
      jwks_uri: `https://${authkitDomain}/oauth2/jwks`,
      response_types_supported: ["code"],
      response_modes_supported: ["query"],
      scopes_supported: ["openid", "profile", "email", "offline_access"],
      grant_types_supported: ["authorization_code", "refresh_token"],
      token_endpoint_auth_methods_supported: ["none", "client_secret_post", "client_secret_basic"],
      code_challenge_methods_supported: ["S256"],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
