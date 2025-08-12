import { getOrders, placeOrder } from "@/lib/orders";
import { products } from "@/lib/products";
import { verifyToken, type AuthKitToolContext } from "@/lib/with-authkit";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";

const resourceHandler = createMcpHandler(
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
        async (args, extra) => {
          try {
            const { authInfo } = extra as AuthKitToolContext;
            if (!authInfo?.user) {
              throw new Error("Authentication required");
            }
            const typedArgs = args as { company: string; mailingAddress: string; tshirtSize: string };
            const order = await placeOrder(typedArgs, authInfo.user);
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
        async (extra) => {
          try {
            const { authInfo } = extra as AuthKitToolContext;
            if (!authInfo?.user) {
              throw new Error("Authentication required");
            }
            const orders = await getOrders(authInfo.user);
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
);

const authHandler = withMcpAuth(resourceHandler, verifyToken, {
  required: true,
});

export { authHandler as GET, authHandler as POST };
