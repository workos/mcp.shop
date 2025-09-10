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

      server.tool(
        "search",
        "Search for products available at mcp.shop. Returns a list of relevant products matching the search query.",
        {
          query: z.string(),
        },
        async (args) => {
          const { query } = args;
          
          if (!query || !query.trim()) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify({ results: [] }),
                },
              ],
            };
          }

          const searchQuery = query.toLowerCase();
          const results = [];
          
          // Get the base URL for the shop
          const mcpServerDomain = 
            process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
          const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";
          const baseUrl = `${protocol}://${mcpServerDomain}`;

          // Search through all products
          for (const [handle, product] of Object.entries(products)) {
            // Check if query matches title, description, or handle
            const titleMatch = product.title.toLowerCase().includes(searchQuery);
            const descriptionMatch = product.descriptionHtml?.toLowerCase().includes(searchQuery) || false;
            const handleMatch = handle.toLowerCase().includes(searchQuery);
            
            if (titleMatch || descriptionMatch || handleMatch) {
              results.push({
                id: handle,
                title: product.title,
                url: `${baseUrl}/${handle}`,
              });
            }
          }

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
          
          if (!id || !products[id]) {
            throw new Error(`Product with ID "${id}" not found`);
          }

          const product = products[id];
          
          // Get the base URL for the shop
          const mcpServerDomain = 
            process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL ?? "localhost:3000";
          const protocol = mcpServerDomain.startsWith("localhost") ? "http" : "https";
          const baseUrl = `${protocol}://${mcpServerDomain}`;

          // Create detailed product information
          const result = {
            id,
            title: product.title,
            text: `${product.title}

${product.descriptionHtml?.replace(/<[^>]*>/g, '') || ''}

Price: ${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}
Available: ${product.availableForSale ? 'Yes' : 'No'}

${product.options.length > 0 ? `Options:
${product.options.map(option => `${option.name}: ${option.values.join(', ')}`).join('\n')}` : ''}

${product.variants.length > 0 ? `Variants:
${product.variants.map(variant => `${variant.title} - $${variant.price.amount} ${variant.price.currencyCode}`).join('\n')}` : ''}`,
            url: `${baseUrl}/${id}`,
            metadata: {
              handle: product.handle,
              availableForSale: product.availableForSale,
              featuredImage: product.featuredImage,
              priceRange: product.priceRange,
              options: product.options,
              variants: product.variants,
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
