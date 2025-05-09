import Image from "next/image";
import { ThreeItemGrid } from "@/components/grid/three-items";

export default async function Home() {
  return (
    <>
      <nav className="relative flex items-center justify-between p-4">
        <Image alt="MCP Shop logo" src="/logo.png" height={30} width={30} />
        <div className="flex w-full items-center font-bold pl-1">MCP Shop</div>
      </nav>
      <main>
        <ThreeItemGrid />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <code>https://mcp.shop/mcp</code>
      </footer>
    </>
  );
}
