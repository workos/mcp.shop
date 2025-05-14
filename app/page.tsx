import ProductPage from "@/components/product/product-page";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductPage />
        </Suspense>
      </main>
    </div>
  );
}
