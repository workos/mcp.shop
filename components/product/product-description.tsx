import Price from "@/components/price";
import Prose from "@/components/prose";
import { Product } from "@/lib/products";
import { Instructions } from "@/components/instructions";
import { VariantSelector } from "./variant-selector";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Badge } from "@radix-ui/themes";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className="px-4 md:px-0">
      <div className="mb-6 flex flex-col border-b pb-6 border-neutral-700 gap-2">
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
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      {product.descriptionHtml ? (
        <Prose
          className="mb-6 text-sm leading-tight text-white/[60%]"
          html={product.descriptionHtml}
        />
      ) : null}

      <div className="flex flex-col gap-4">
        <Instructions openButtonLabel="View ordering instructions" />
        <Accordion.Root
          type="single"
          defaultValue="tshirt-details"
          collapsible
          className="mb-6"
        >
          <Accordion.Item value="tshirt-details">
            <Accordion.Header>
              <Accordion.Trigger className="w-full flex items-center justify-between text-left text-sm text-neutral-400 py-2 px-2 rounded bg-neutral-900 hover:bg-neutral-800 transition group">
                <span>Product Details</span>
                <ChevronDownIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="px-2 pt-2 text-white/60 text-sm overflow-hidden transition-all duration-300 data-[state=closed]:max-h-0 data-[state=open]:max-h-[500px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100">
              <ul className="list-disc list-inside">
                <li>Soft, lightweight cotton blend</li>
                <li>Unisex fit, pre-shrunk</li>
                <li>Printed with durable, fade-resistant ink</li>
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
    </div>
  );
}
