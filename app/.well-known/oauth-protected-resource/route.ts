import {
  protectedResourceHandler,
  metadataCorsOptionsRequestHandler,
} from "mcp-handler";

function createHandler() {  
  return protectedResourceHandler({
    authServerUrls: [`https://${process.env.AUTHKIT_DOMAIN}`],
  });
}

export const GET = (req: Request) => createHandler()(req);
export { metadataCorsOptionsRequestHandler as OPTIONS };
