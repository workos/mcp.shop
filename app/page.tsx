import ProductPage from "@/components/product/product-page";
import { Suspense } from "react";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <ProductPage />
        </Suspense>
      </main>
    </div>
  );
}
