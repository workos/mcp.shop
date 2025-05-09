export function GET(): Response {
  const mcpServerDomain =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";

  return new Response(
    JSON.stringify({
      resource: `${protocol}://${mcpServerDomain}`,
      authorization_servers: [`https://${process.env.AUTHKIT_DOMAIN}`],
      bearer_methods_supported: ["header"],
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}
