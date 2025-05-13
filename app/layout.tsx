import Image from "next/image";
import Link from "next/link";
import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthKitProvider>
          <nav className="flex items-center justify-between p-4">
            <Link className="flex" href="/">
              <Image
                alt="MCP Shop logo"
                src="/logo.png"
                height={30}
                width={30}
              />
              <div className="flex w-full items-center font-bold pl-1">
                MCP Shop
              </div>
            </Link>
          </nav>
          {children}
        </AuthKitProvider>
      </body>
    </html>
  );
}
