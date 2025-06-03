import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Footer from "@/components/footer";

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
        url: "https://vercel.com/api/www/screenshot?url=https://mcp.shop&width=1200&height=630",
        width: 1200,
        height: 630,
        alt: "MCP Shop Screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [
      "https://vercel.com/api/www/screenshot?url=https://mcp.shop&width=1200&height=630",
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Theme appearance="dark">
          <AuthKitProvider>
            <Navbar />
            {children}
            <Footer />
          </AuthKitProvider>
        </Theme>
      </body>
    </html>
  );
}
