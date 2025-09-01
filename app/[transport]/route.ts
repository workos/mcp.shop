import { getOrders, placeOrder } from "@/lib/orders";
import { products } from "@/lib/products";
import { verifyAuthkitToken, type User } from "@/lib/verify-authkit-token";
import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";

const handler = createMcpHandler(
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
        if (!extra.authInfo?.extra?.user) {
          return {
            content: [
              {
                type: "text",
                text: "Authentication required to place an order.",
              },
            ],
          };
        }

        try {
          const order = await placeOrder(args, extra.authInfo.extra.user as User);
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
      {},
      async (_args, extra) => {
        if (!extra.authInfo?.extra?.user) {
          return {
            content: [
              {
                type: "text",
                text: "Authentication required to view orders.",
              },
            ],
          };
        }

        // Check for admin role
        const user = extra.authInfo.extra.user as User;
        if (user.metadata?.role !== "admin") {
          return {
            content: [
              {
                type: "text",
                text: "Admin access required to view orders.",
              },
            ],
          };
        }

        try {
          const orders = await getOrders(user);
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
    // Server capabilities - advertise auth requirement
    capabilities: {
      auth: {
        type: "bearer",
        required: true,
      },
    },
  },
  {
    // Configuration
    redisUrl: process.env.REDIS_URL,
    basePath: "/",
    maxDuration: 600,
    verboseLogs: true,
  },
);

// Apply auth wrapper with WorkOS AuthKit verification
const authHandler = withMcpAuth(handler, verifyAuthkitToken, {
  required: true,
  resourceMetadataPath: "/.well-known/oauth-protected-resource",
});

export { authHandler as GET, authHandler as POST };
