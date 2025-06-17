import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
export default authkitMiddleware({
  redirectUri:
    process.env.VERCEL_TARGET_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}/callback`
      : process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/",
      "/user_management/authorize",
      "/user_management/callback",
      "/callback",
      "/oauth/callback",
      "/mcp",
      "/sse",
      "/.well-known/:path*",
      "/_next/static/:path*",
      "/static/:path*",
      "/public/:path*",
      "/fonts/:path*",
      "/favicon.ico",
      "/icon.png",
      "/apple-icon.png",
      "/robots.txt",
      "/sitemap.xml",
    ],
  },
});
