import { placeOrder } from "@/lib/orders";
import { withAuthkit } from "@/lib/with-authkit";
import createMcpHandler from "@vercel/mcp-adapter/next";
import { z } from "zod";

const handler = withAuthkit((request, auth) =>
  createMcpHandler(
    (server) => {
      server.tool(
        "listMcpShopInventory",
        "Returns a list of the items for sale at mcp.shop. " +
          "mcp.shop is a promotional store hosted by WorkOS for MCP Night" +
          "This tool should be used whenever someone wants to purchase " +
          "products relating to MCP, model context protocol, or items from " +
          "mcp.shop. Currently, everything is free.",
        () => {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  title: "mcp.shop inventory",
                  products: [
                    {
                      label: "Shirt",
                      description:
                        "A very handsome MCP shirt on the finest blend of Cotton/Rayon that nature (or whatever) provides",
                      image_url:
                        "http://localhost:3000/_next/image?url=%2Fshirt.webp&w=1920&q=75",
                    },
                    {
                      label: "Mug",
                      description: "Look at this neat mug!",
                      image_url:
                        "http://localhost:3000/_next/image?url=%2Fmug.webp&w=1200&q=75",
                    },
                    {
                      label: "Beanie",
                      description: "It's like a sock for your head",
                      image_url:
                        "https://static.custombeaniesnow.com/fit-in/900x900/product_20221122-0c4a92a0-6ab7-11ed-accf-577841ebe15f.png.webp",
                    },
                  ],
                }),
              },
            ],
          };
        },
      );

      server.tool(
        "buyMcpShopItem",
        "Orders a t-shirt from the MCP shop. WorkOS is providing the items." +
          "This tool should be used when someone wants an MCP (model context protocol) t-shirt." +
          "We cannot fulfill their order without a valid U.S. based mailing address. " +
          "fullName should be first and last name." +
          "tshirtSize is one of the standard t-shirt sizes (S, M, L, XL, XXL, XXL)." +
          "No other items (mug, beanie, etc.) are available at this time.",
        {
          fullName: z.string(),
          company: z.string(),
          mailingAddress: z.string(),
          tshirtSize: z.string(),
        },
        async (args) => {
          // TODO: do some validation of the order?
          try {
            // should this be ulid instead?
            const orderId = await redis.incr("order:id:counter");
            await redis.hSet(`orders:${orderId}`, args);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    orderNumber: orderId,
                    item: "t-shirt",
                    tshirtSize: args.tshirtSize,
                    user: auth.claims.sub,
                    name: args.fullName,
                    company: args.company,
                    address: args.mailingAddress,
                  }),
                },
              ],
            };
          } catch (e) {
            console.error("Error placing order", e);
            return {
              content: [
                {
                  type: "text",
                  text: "Something went wrong. Try again later.",
                },
              ],
            };
          }
        },
      );
    },
    {
      // Optional server options
    },
    {
      // Optional configuration
      redisUrl: process.env.REDIS_URL,
      streamableHttpEndpoint: "/mcp",
      sseEndpoint: "/sse",
      maxDuration: 60,
      verboseLogs: true,
    },
  )(request),
);

export { handler as GET, handler as POST };
