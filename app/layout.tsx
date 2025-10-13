import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MCP Shop",
  description: "The latest and greatest MCP merch",
  openGraph: {
    images: [
      {
        url: "/images/mcp-shop.png",
        width: 1200,
        height: 630,
        alt: "MCP Shop OG Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/images/mcp-shop.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <AuthKitProvider>
          <Theme appearance="dark" className="flex flex-col">
            <main className="flex-grow">{children}</main>
          </Theme>
        </AuthKitProvider>
      </body>
    </html>
  );
}
