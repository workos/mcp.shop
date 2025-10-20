"use client";

import Price from "@/components/price";
import { Product } from "@/lib/products";
import { Instructions } from "@/components/instructions";
import { ChatGPTInstructions } from "@/components/chatgpt-instructions";
import { VariantSelector } from "./variant-selector";
import { Badge } from "@radix-ui/themes";
import React from "react";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="px-4 md:px-0">
      <div className="mb-2 flex flex-col pb-4 border-neutral-700 gap-2">
        <h1 className="mb-2 text-5xl font-mediu font-untitled force-untitled">
          {product.title}
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
          Order your shirt for free through MCP or ChatGPT Apps SDK.
        </div>
        <div className="font-untitled force-untitled mb-2 text-base text-white/70">
          This sleek tee features the MCP vibes and the phrase “Context is
          Everything”. Whether you’re a machine learning enthusiast, a protocol
          purist, or just someone who loves obscure tech references, this shirt
          delivers subtle nerd cred with style.
        </div>
        <div className="font-untitled force-untitled text-lg text-white text-base">
          Join the protocol. Set the context.
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />

      <div className="flex flex-col gap-4">
        <Instructions openButtonLabel="Order on MCP" />
        <ChatGPTInstructions openButtonLabel="Order with ChatGPT" />
      </div>
    </div>
  );
}
