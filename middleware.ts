import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  redirectUri:
    process.env.VERCEL_TARGET_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}/callback`
      : process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - .well-known (OAuth discovery endpoints)
     * Static assets in app directory:
     * - favicon.ico (favicon file)
     * - apple-icon.png (Apple touch icon)
     * - icon.png (app icon)
     */
    "/((?!api|_next/static|_next/image|\\.well-known|favicon\\.ico|apple-icon\\.png|icon\\.png).*)",
  ],
};
