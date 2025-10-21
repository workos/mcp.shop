import { createMcpHandler, withMcpAuth } from "mcp-handler";
import { z } from "zod";
import { placeOrder } from "@/lib/orders";
import type { User } from "@/lib/with-authkit";
import { verifyToken } from "@/lib/with-authkit";
import { getAppsSdkCompatibleHtml } from "@/components/widget";

// These are helpers for the Apps SDK Widget
type ContentWidget = {
  id: string;
  title: string;
  templateUri: string;
  invoking: string;
  invoked: string;
  html: string;
  description: string;
};

function widgetMeta(widget: ContentWidget) {
  return {
    "openai/outputTemplate": widget.templateUri,
    "openai/toolInvocation/invoking": widget.invoking,
    "openai/toolInvocation/invoked": widget.invoked,
    "openai/widgetAccessible": false,
    "openai/resultCanProduceWidget": true,
  } as const;
}

const handler = createMcpHandler(async (server) => {
  const contentWidget: ContentWidget = {
    id: "show_store_content",
    title: "Show Store Items",
    templateUri: "ui://widget/content-template.html",
    invoking: "Loading content...",
    invoked: "Content loaded",
    html: "", // Will be generated dynamically per request
    description: "Displays the store content",
  };

  // Register the resource for the widget - generate HTML dynamically with auth context
  server.registerResource(
    "store-widget",
    contentWidget.templateUri,
    {
      title: contentWidget.title,
      description: contentWidget.description,
      mimeType: "text/html+skybridge",
      _meta: {
        "openai/widgetDescription": contentWidget.description,
        "openai/widgetPrefersBorder": true,
      },
    },
    async (uri, { authInfo }) => {
      // Get user from auth context to prefill widget
      const user = authInfo?.extra?.user as User | undefined;
      const userData = user ? {
        firstName: user.firstName ?? undefined,
        lastName: user.lastName ?? undefined,
        email: user.email,
      } : undefined;
      
      const html = getAppsSdkCompatibleHtml(userData);
      
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: "text/html+skybridge",
            text: `<html>${html}</html>`,
            _meta: {
              "openai/widgetDescription": contentWidget.description,
              "openai/widgetPrefersBorder": true,
            },
          },
        ],
      };
    },
  );

  server.registerTool(
    contentWidget.id,
    {
      title: contentWidget.title,
      description:
        "Display information about available MCP shirts and show the widget to order the exclusive RUN MCP shirt",
      inputSchema: {} as const,
      _meta: {
        ...widgetMeta(contentWidget),
        "openai/widgetAccessible": true,
      },
    },
    async () => {
      return {
        content: [
          {
            type: "text",
            text: `🎉 Welcome to the MCP Shirt Shop!

This is a demonstration MCP server by WorkOS. We're an enterprise-readiness company, not a shirt vendor, so please note that shirts may not ship quickly (or at all) - this is primarily for demonstration purposes.

We have TWO types of MCP shirts available, both FREE:

1. **"Context is Everything" MCP Shirt** 
   - The classic MCP shirt featuring the phrase "Context is Everything"
   - Can be ordered directly via the standard MCP 'order_shirt' tool
   - Available in sizes XS-3XL

2. **"RUN MCP" Shirt** (Apps SDK Exclusive) ⚡
   - A special edition shirt exclusive to ChatGPT Apps SDK users
   - Can ONLY be ordered through the Apps SDK widget (shown above)
   - Automatically unlocked when ordering via the widget
   - Available in sizes XS-3XL

To order the RUN MCP shirt, use the widget form above. To order a regular "Context is Everything" shirt, use the 'order_shirt' tool directly through MCP.`,
          },
        ],
        structuredContent: {
          timestamp: new Date().toISOString(),
          shirtTypes: ["Context is Everything", "RUN MCP"],
        },
        _meta: {
          ...widgetMeta(contentWidget),
          "openai/widgetAccessible": true,
        },
      };
    },
  );

  // Tool to buy the shirt
  server.registerTool(
    "order_shirt",
    {
      title: "Order MCP Shirt",
      description:
        "Place an order for an MCP tee shirt. By default orders a 'Context is Everything' shirt. Use the Show Store Items tool first.",
      inputSchema: {
        size: z
          .enum(["XS", "S", "M", "L", "XL", "2XL", "3XL"])
          .describe("T-shirt size"),
        firstName: z.string().describe("First name"),
        lastName: z.string().describe("Last name"),
        email: z.string().email().describe("Email address"),
        company: z.string().describe("Company name"),
        phone: z.string().optional().describe("Phone number"),
        streetAddress1: z.string().describe("Street address line 1"),
        streetAddress2: z.string().optional().describe("Street address line 2 (apartment, suite, etc.)"),
        city: z.string().describe("City"),
        state: z.string().length(2).describe("2-letter state code (e.g., CA, NY)"),
        zip: z.string().describe("ZIP/Postal code"),
        country: z.string().length(2).describe("2-letter country code (e.g., US, CA)"),
        specialCode: z
          .string()
          .optional()
          .describe("Optional special code to unlock RUN MCP shirt variant. Only used internally by ChatGPT Apps SDK users."),
      },
      _meta: {
        "openai/widgetAccessible": true,
      },
    },
    async (
      {
        size,
        firstName,
        lastName,
        email,
        company,
        phone,
        streetAddress1,
        streetAddress2,
        city,
        state,
        zip,
        country,
        specialCode,
      },
      { authInfo },
    ) => {
      // Check if this is a RUN MCP shirt order
      const SPECIAL_CODE = "RUN_MCP_2025";
      const isRunMcpShirt = specialCode === SPECIAL_CODE;

      // Get user from auth context
      const user = authInfo?.extra?.user as User;

      if (!user) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Authentication required to place an order.`,
            },
          ],
          isError: true,
        };
      }

      try {
        // Place the order using the placeOrder function
        const order = await placeOrder(
          {
            firstName,
            lastName,
            email,
            company,
            phone,
            streetAddress1,
            streetAddress2,
            city,
            state,
            zip,
            country,
            tshirtSize: size,
            isRunMcpShirt,
          },
          user,
        );

        const shirtType = isRunMcpShirt ? "RUN MCP" : "Context is Everything";
        const shirtEmoji = isRunMcpShirt ? "⚡" : "🎯";

        // Format address for display
        const fullAddress = [
          streetAddress1,
          streetAddress2,
          city,
          `${state} ${zip}`,
          country,
        ].filter(Boolean).join("\n");

        return {
          content: [
            {
              type: "text",
              text: `${shirtEmoji} Order confirmed! 

Order ID: ${order.id}
Product: ${shirtType} MCP Shirt
SKU: ${order.sku}
Size: ${size}

Customer Information:
Name: ${firstName} ${lastName}
Email: ${email}
Company: ${company}
${phone ? `Phone: ${phone}` : ""}

Shipping Address:
${fullAddress}

Order Date: ${order.orderDate}

${
  isRunMcpShirt
    ? "🎉 Congratulations! You've unlocked the exclusive RUN MCP shirt!"
    : "⚠️ Note: This is a demonstration order. As an enterprise-readiness company, we rarely ship physical merchandise. Your order has been logged but may not be fulfilled at least for a while."
}

Thank you for trying out our MCP server!`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `❌ Failed to place order: ${error instanceof Error ? error.message : "Unknown error"}`,
            },
          ],
          isError: true,
        };
      }
    },
  );
});

// Make authorization required — the verifyToken function is defined in lib/with-authkit.ts
const authHandler = withMcpAuth(handler, verifyToken, {
  required: true,
});

export { authHandler as GET, authHandler as POST };
