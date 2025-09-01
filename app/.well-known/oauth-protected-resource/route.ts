import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from "mcp-handler";

function createHandler() {
  const authkitDomain = process.env.AUTHKIT_DOMAIN;
  if (!authkitDomain) {
    // Return a proper error response instead of throwing
    return () => new Response(
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
  
  return protectedResourceHandler({
    authServerUrls: [`https://${authkitDomain}`],
  });
}

export const GET = (req: Request) => createHandler()(req);
export { metadataCorsOptionsRequestHandler as OPTIONS };
