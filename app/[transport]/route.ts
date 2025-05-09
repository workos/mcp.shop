import { withAuthkit } from "@/lib/with-authkit";
import createMcpHandler from "@vercel/mcp-adapter/next";
import { z } from "zod";

const handler = withAuthkit((request, auth) =>
  createMcpHandler(
    (server) => {
      server.tool(
        "roll",
        "Roll a given number of 6-sided dice. Returns the individual rolls and the list of rolls. If the user does not specify a number of dice, use 1. If the user does not specify a number of sides, use 6.",
        { dice: z.number(), sides: z.number() },
        async ({ dice, sides }) => {
          const rolls = [];
          let sum = 0;
          for (let i = 0; i < dice; i++) {
            const roll = Math.floor(Math.random() * sides) + 1;
            rolls.push(roll);
            sum += roll;
          }
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ rolls, sum }),
              },
              {
                type: "text",
                text: `These rolls were generated for user with ID ${auth.claims.sub}`,
              },
            ],
          };
        },
      );

      server.tool(
        "listMcpShopInventory",
        "Returns a list of the items for sale at mcp.shop. " +
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
                  fields: [
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
                      image_url: "https://static.custombeaniesnow.com/fit-in/900x900/product_20221122-0c4a92a0-6ab7-11ed-accf-577841ebe15f.png.webp",
                    },
                  ],
                }),
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
      maxDuration: 60,
      verboseLogs: true,
    },
  )(request),
);

export { handler as GET, handler as POST };
