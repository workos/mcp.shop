import { notFound } from "next/navigation";

import Image from "next/image";
// import Footer from 'components/layout/footer';
import { Gallery } from "@/components/product/gallery";
// import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from "@/components/product/product-description";
// import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image as ProductImage, getProduct } from "@/lib/products";
import { Suspense } from "react";
import { ProductProvider } from "@/components/product/product-context";

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  return (
    <ProductProvider>
      <nav className="relative flex items-center justify-between p-4">
        <Image alt="MCP Shop logo" src="/logo.png" height={30} width={30} />
        <div className="flex w-full items-center font-bold pl-1">MCP Shop</div>
      </nav>
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border p-8 md:p-12 lg:flex-row lg:gap-8 border-neutral-800 bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images
                  .slice(0, 5)
                  .map((image: ProductImage) => ({
                    src: image.url,
                    altText: image.altText,
                  }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </ProductProvider>
  );
}
