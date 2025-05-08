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
