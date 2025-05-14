export interface Money {
  amount: string;
  currencyCode: string;
}

export interface Image {
  url: string;
  altText: string;
  width: number;
  height: number;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
}

export interface Product {
  handle: string;
  availableForSale: boolean;
  featuredImage: Image;
  images: Image[];
  priceRange: {
    maxVariantPrice: Money;
  };
  title: string;
  descriptionHtml?: string;
  options: ProductOption[];
  variants: ProductVariant[];
}

export const products: Record<string, Product> = {
  shirt: {
    handle: "shirt",
    availableForSale: true,
    featuredImage: {
      altText: "MCP tee shirt",
      height: 1024,
      url: "/shirt.webp",
      width: 1024,
    },
    images: [
      {
        altText: "MCP tee shirt",
        height: 1024,
        url: "/shirt.jpg",
        width: 1024,
      },
      {
        altText: "Zoomed in design",
        height: 512,
        url: "/zoom.jpg",
        width: 512,
      },
      {
        altText: "Man wearing the shirt",
        height: 512,
        url: "/man.jpg",
        width: 512,
      },
      
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "Free through MCP",
        currencyCode: "USD",
      },
    },
    title: "MCP tee shirt",
    descriptionHtml: `<p class="my-2">Minimalist, mysterious, and maybe a little meta.</p>
      <p class="my-2">This sleek silver-grey tee features the phrase “Model Context Protocol” emblazoned in a soft-rounded rectangle—just enough to spark curiosity and conversation. Whether you’re a machine learning enthusiast, a protocol purist, or just someone who loves obscure tech references, this shirt delivers subtle nerd cred with style.</p>
      <ul class="list-disc list-inside my-2">
	      <li>Soft, lightweight cotton blend</li>
	      <li>Unisex fit, pre-shrunk</li>
	      <li>Printed with durable, fade-resistant ink</li>
	      <li>Color: Silver-grey with black graphic</li>
			</ul>
      <p class="my-2">Join the protocol. Set the context.</p>`,
    options: [
      {
        id: "size",
        name: "Size",
        values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
    ],
    variants: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((size) => ({
      id: size.toLowerCase(),
      title: size,
      availableForSale: true,
      selectedOptions: [
        {
          name: "size",
          value: size,
        },
      ],
      price: {
        amount: "20.00",
        currencyCode: "USD",
      },
    })),
  },
  mug: {
    handle: "mug",
    availableForSale: true,
    featuredImage: {
      altText: "MCP coffee mug",
      height: 1024,
      url: "/mug.webp",
      width: 1024,
    },
    images: [
      {
        altText: "MCP coffee mug",
        height: 1024,
        url: "/mug.webp",
        width: 1024,
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "Coming soon",
        currencyCode: "USD",
      },
    },
    title: "MCP coffee mug",
    descriptionHtml: `<p class="my-2">Define the boundaries of your day—one sip at a time.</p>
      <p class="my-2">The Model Context Protocol mug is a sleek, white ceramic vessel adorned with a crisp, rounded-rectangle design and those three enigmatic words. Whether you’re deep in the zone or just context-switching between meetings, this mug brings a touch of quiet tech gravitas to your desk.</p>
      <ul class="list-disc list-inside my-2">
       	<li>11 oz or 15 oz ceramic mug</li>
       	<li>Glossy finish with high-quality print</li>
       	<li>Dishwasher and microwave safe</li>
       	<li>Color: White with black imprint</li>
      </ul>
      <p class="my-2">Perfect for developers, AI whisperers, or anyone who knows the value of a well-defined input.</p>
      <p class="my-2">Set your context. Then caffeinate accordingly.</p>`,
    options: [],
    variants: [
      {
        id: "mug",
        title: "MCP coffee mug",
        availableForSale: true,
        selectedOptions: [],
        price: {
          amount: "15.00",
          currencyCode: "USD",
        },
      },
    ],
  },
  beanie: {
    handle: "beanie",
    availableForSale: true,
    featuredImage: {
      altText: "MCP beanie",
      height: 1024,
      url: "/beanie.webp",
      width: 1024,
    },
    images: [
      {
        altText: "MCP beanie",
        height: 1024,
        url: "/beanie.webp",
        width: 1024,
      },
    ],
    priceRange: {
      maxVariantPrice: {
        amount: "Coming soon",
        currencyCode: "USD",
      },
    },
    title: "MCP beanie",
    descriptionHtml: `<p class="my-2">Subtle. Structured. Always on spec.</p>
      <p class="my-2">This cozy beanie keeps your head warm and your protocols tighter. Featuring a soft knit design in charcoal or deep grey, the highlight is a minimalist embossed leather patch stamped with “MCP”—a nod to those who know the power of a well-scoped context.</p>
      <p class="my-2">Whether you’re on a chilly morning walk, debugging in a drafty office, or just signaling allegiance to clean abstractions, this beanie has you covered (literally and philosophically).
      <ul class="list-disc list-inside my-2">
       	<li>Warm acrylic knit, soft stretch fit</li>
       	<li>Folded cuff with embossed leather “MCP” patch</li>
       	<li>One size fits most</li>
       	<li>Color: Silver grey</li>
      </ul>
      <p class="my-2">Because every model needs context—and every protocol deserves style.<p>`,
    options: [],
    variants: [
      {
        id: "beanie",
        title: "MCP beanie",
        availableForSale: true,
        selectedOptions: [],
        price: {
          amount: "30.00",
          currencyCode: "USD",
        },
      },
    ],
  },
};

export const getProduct = async (
  handle: keyof typeof products,
): Promise<Product> => products[handle];
