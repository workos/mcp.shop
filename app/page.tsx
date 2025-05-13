import Image from "next/image";
import { ThreeItemGrid } from "@/components/grid/three-items";
import { Instructions } from "@/components/instructions";

export default async function Home() {
  return (
    <>
      <main>
        <ThreeItemGrid />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <Instructions openButtonLabel="Take my money!" />
      </footer>
    </>
  );
}
