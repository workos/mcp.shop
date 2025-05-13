import { placeOrder } from "@/lib/orders";
import { products } from "@/lib/products";
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
                      description: products.shirt.descriptionHtml,
                      image_url:
                        "http://localhost:3000/_next/image?url=%2Fshirt.webp&w=1920&q=75",
                    },
                    {
                      label: "Mug",
                      description: products.mug.descriptionHtml,
                      image_url:
                        "http://localhost:3000/_next/image?url=%2Fmug.webp&w=1200&q=75",
                    },
                    {
                      label: "Beanie",
                      description: products.beanie.descriptionHtml,
                      image_url:
                        "http://localhost:3000/_next/image?url=%2Fbeanie.webp&w=1200&q=75",
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
          try {
            const order = await placeOrder(args, auth.user);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    ...order,
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
