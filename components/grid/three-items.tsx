import { GridTileImage } from "./tile";
// import { getCollectionProducts } from 'lib/shopify';
// import type { Product } from 'lib/shopify/types';
import Link from "next/link";

interface Product {
  handle: string;
  featuredImage: {
    url: string;
  };
  priceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  title: string;
}

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <Link
        className="relative block aspect-square h-full w-full"
        href={`#/product/${item.handle}`}
        prefetch={false}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </Link>
    </div>
  );
}

export async function ThreeItemGrid() {
  const homepageItems: Product[] = [
    {
      handle: "shirt",
      featuredImage: {
        url: "/shirt.webp",
      },
      priceRange: {
        maxVariantPrice: {
          amount: "20.00",
          currencyCode: "USD",
        },
      },
      title: "MCP tee shirt",
    },
    {
      handle: "mug",
      featuredImage: {
        url: "/mug.webp",
      },
      priceRange: {
        maxVariantPrice: {
          amount: "15.00",
          currencyCode: "USD",
        },
      },
      title: "MCP coffee mug",
    },
    {
      handle: "beanie",
      featuredImage: {
        url: "/beanie.webp",
      },
      priceRange: {
        maxVariantPrice: {
          amount: "30.00",
          currencyCode: "USD",
        },
      },
      title: "MCP beanie",
    },
  ];

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null;

  const [firstProduct, secondProduct, thirdProduct] = homepageItems;

  return (
    <section className="mx-auto grid max-w-(--breakpoint-2xl) gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
