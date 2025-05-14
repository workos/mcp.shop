import ProductPage from "@/components/product/product-page";
import { Instructions } from "@/components/instructions";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        <ProductPage />
      </main>
    </div>
  );
}
