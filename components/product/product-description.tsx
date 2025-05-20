import Price from "@/components/price";
import Prose from "@/components/prose";
import { Product } from "@/lib/products";
import { Instructions } from "@/components/instructions";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b pb-6 border-neutral-700">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="inline-block self-start bg-neutral-800 text-gray-200 text-lg font-normal px-4 py-1 rounded-full shadow">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}
      <Instructions openButtonLabel="Order with AI" />

      {/* <AddToCart product={product} /> */}
    </>
  );
}
