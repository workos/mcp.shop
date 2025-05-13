import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

export default authkitMiddleware({
  redirectUri:
    process.env.VERCEL_TARGET_ENV === "preview"
      ? `https://${process.env.VERCEL_URL}/callback`
      : process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI,
});

export const config = { matcher: ["/", "/orders", "/product/:handle*"] };
