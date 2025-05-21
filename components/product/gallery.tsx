"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

type ImageType = {
  src: string;
  altText: string;
};

type GalleryProps = {
  images: ImageType[];
};

export const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check if the viewport is mobile-sized
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    // Mobile: all images same size, horizontal scroll, show part of next image, with left and right padding
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 8,
          overflowX: "auto",
          width: "100%",
          paddingLeft: 16,
          paddingRight: 16,
        }}
      >
        {images.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.altText}
            style={{
              width: 360, // smaller width to show part of next image
              height: 360,
              objectFit: "cover",
              borderRadius: 12,
              flex: "0 0 auto",
            }}
          />
        ))}
      </div>
    );
  }

  // Desktop: vertical thumbnails, large main image
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {/* Thumbnails */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {images.map((img, idx) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.altText}
            style={{
              width: 60,
              height: 60,
              minWidth: 60,
              minHeight: 60,
              aspectRatio: "1/1",
              objectFit: "cover",
              border:
                idx === selectedIndex ? "2px solid #333" : "1px solid #ccc",
              cursor: "pointer",
              borderRadius: 8,
              flex: "0 0 auto",
            }}
            onClick={() => setSelectedIndex(idx)}
          />
        ))}
      </div>
      {/* Main Image */}
      <div style={{ marginLeft: 16 }}>
        <img
          src={images[selectedIndex].src}
          alt={images[selectedIndex].altText}
          style={{
            width: "100%",
            maxWidth: 600,
            aspectRatio: "1/1",
            objectFit: "contain",
            borderRadius: 16,
            height: "auto",
          }}
        />
      </div>
    </div>
  );
};
