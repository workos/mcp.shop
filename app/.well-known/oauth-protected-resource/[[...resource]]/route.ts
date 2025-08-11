export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource?: string[] }> },
): Promise<Response> {
  const { resource: [resourceParam, ...extraResourceParams] = [] } =
    await params;
  const mcpServerDomain =
    process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
  const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";

  if (extraResourceParams.length) {
    return new Response("Not found", { status: 404 });
  }

  let resource: string;
  switch (resourceParam) {
    case undefined:
      resource = "";
      break;
    case "mcp":
    case "sse":
      resource = `/${resourceParam}`;
      break;
    default:
      return new Response("Not found", { status: 404 });
  }

  return new Response(
    JSON.stringify({
      resource: `${protocol}://${mcpServerDomain}${resource}`,
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
