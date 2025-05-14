"use client";

import Image from "next/image";

export function Gallery({
  images,
}: {
  images: { src: string; altText: string }[];
}) {
  // Only show the first three images
  const [mainImage, ...restImages] = images;
  const subImages = restImages.slice(0, 2);

  return (
    <div className="w-full max-w-[550px] aspect-[2/3] flex flex-col gap-1">      {/* Main image on top, full width */}
      {mainImage && (
        <div className="w-full h-2/3 relative">
          <Image
            className="object-contain rounded-md"
            fill
            sizes="100vw"
            alt={mainImage.altText}
            src={mainImage.src}
            priority={true}
          />
        </div>
      )}
      {/* Two images below, side by side */}
      <div className="flex flex-row justify-center items-center gap-1 h-1/3">
        {subImages.map((img) => (
          <div key={img.src} className="relative w-1/2 h-full">
            <Image
              className="object-contain rounded-md"
              fill
              sizes="50vw"
              alt={img.altText}
              src={img.src}
              priority={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
