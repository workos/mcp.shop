import { getOrders, placeOrder } from "@/lib/orders";
import { products } from "@/lib/products";
import { withAuthkit } from "@/lib/with-authkit";
import { createMcpHandler } from "mcp-handler";
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
                      image_url: "https://mcp.shop/shirt.jpg",
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
          "Company is a required field." +
          "tshirtSize is one of the standard t-shirt sizes (S, M, L, XL, XXL, XXL).",
        {
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

      server.tool(
        "listMcpShopOrders",
        "Lists the orders placed by the user at mcp.shop" +
          "Use this tool if a user needs to review the orders they've " +
          "placed. There is no way to adjust an order at this time. " +
          "(The user should contact WorkOS instead).",
        async () => {
          try {
            const orders = await getOrders(auth.user);
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({
                    status: "success",
                    orders,
                  }),
                },
              ],
            };
          } catch (e) {
            console.error("Error listing orders", e);
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

      // For ChatGPT support, a server must specifically support the search and fetch tools
      server.tool(
        "search",
        "Search for products available at mcp.shop. Returns a list of relevant products matching the search query.",
        {
          query: z.string(),
        },
        async () => {
          // Always return the shirt - it's the only product available
          const results = [
            {
              id: "shirt",
              title: "The MCP tee",
            }
          ];

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ results }),
              },
            ],
          };
        },
      );

      server.tool(
        "fetch",
        "Fetch detailed information about a specific product by its ID.",
        {
          id: z.string(),
        },
        async (args) => {
          const { id } = args;
          
          if (id !== "shirt") {
            throw new Error(`Product with ID "${id}" not found. Only "shirt" is available.`);
          }

          const result = {
            id: "shirt",
            title: "The MCP tee",
            text: `Context is Everything

Minimalist, mysterious, and maybe a little meta.

This sleek tee features the MCP vibes and the phrase "Context is Everything". Whether you're a machine learning enthusiast, a protocol purist, or just someone who loves obscure tech references, this shirt delivers subtle nerd cred with style.

Join the protocol. Set the context.

Price: FREE
Available: Yes (but slow delivery)

Sizes: XS, S, M, L, XL, 2XL, 3XL

To purchase this free shirt, you need to use a full-featured MCP client that supports tool use (like Claude Desktop, VS Code with MCP extension, or other MCP-compatible applications). The shirt cannot be purchased through this search interface alone.`,
            metadata: {
              price: "FREE",
              requiresMcpClient: true,
              availableSizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"]
            },
          };

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(result),
              },
            ],
          };
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
      maxDuration: 600,
      verboseLogs: true,
    },
  )(request),
);

export { handler as GET, handler as POST };
