import { notFound } from "next/navigation";

import { Gallery } from "@/components/product/gallery";
import { ProductDescription } from "@/components/product/product-description";
import { Image as ProductImage, getProduct } from "@/lib/products";
import { Suspense } from "react";
import { ProductProvider } from "@/components/product/product-context";

export default async function ProductPage() {
  const product = await getProduct("shirt");

  if (!product) return notFound();

  return (
    <ProductProvider>
      <div className="mx-auto max-w-[1440]">
        <div className="flex flex-col md:p-12 lg:flex-row lg:gap-0 justify-center lg:rounded-none lg:border-none">
          <div className="h-full w-full basis-full lg:basis-1/2 lg:mr-8 lg:max-h-[600px] overflow-y-auto scrollbar-hide mb-10">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.map((image: ProductImage) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full px-0 lg:basis-2/6 lg:pl-0">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}
