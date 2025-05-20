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
        <div
          className="inline-block self-start text-gray-200 text-lg font-normal px-4 py-1 rounded-full shadow"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,126,95,0.15) 0%, rgba(254,180,123,0.15) 100%)",
          }}
        >
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
