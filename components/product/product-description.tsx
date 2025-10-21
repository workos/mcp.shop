"use client";

import Price from "@/components/price";
import { Product } from "@/lib/products";
import { Instructions } from "@/components/instructions";
import { ChatGPTInstructions } from "@/components/chatgpt-instructions";
import { Badge } from "@radix-ui/themes";
import React from "react";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="px-4 md:px-0">
      <div className="mb-2 flex flex-col pb-4 border-neutral-700 gap-2">
        <h1 className="mb-2 text-5xl font-mediu font-untitled force-untitled">
          Context is Everything
        </h1>
        <Badge
          color="gray"
          variant="soft"
          className="inline-block self-start text-lg font-normal px-4 py-1 rounded-full shadow"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,126,95,0.15) 0%, rgba(254,180,123,0.15) 100%)",
          }}
        >
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </Badge>
      </div>
      <div className="mb-6">
        <div className="font-untitled force-untitled text-lg mb-2 text-white">
          Get a free t-shirt with ChatGPT Apps SDK.
        </div>
        <div className="font-untitled force-untitled mb-2 text-base text-white/70">
          Interfaces like ChatGPTs Apps SDK and Anthropics MCP are the new way 
          do interact with services. Auhtkit allows you to connect your servers to
          ChatGPT, and every MCP supporting AI agent. 
          See how it works by ordering a (free) t-shirt. 
          If you want to build your own MCP server, 
          check out <a href="https://workos.com/mcp" target="_blank" rel="noopener noreferrer" className="underline">workos.com/mcp</a> or 
          use this website as a template on <a href="https://github.com/workos/mcp.shop" target="_blank" rel="noopener noreferrer" className="underline">Github</a>.

        </div>
        <div className="font-untitled force-untitled text-lg text-white text-base">
          See the power of MCP and the Apps SDK in action.
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <Instructions openButtonLabel="Order on MCP" />
        <ChatGPTInstructions openButtonLabel="Order with ChatGPT App" />
      </div>
    </div>
  );
}
