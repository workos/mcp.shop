import { getSignInUrl, withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

export async function Navbar() {
  const { user } = await withAuth({ ensureSignedIn: false });

  return (
    <nav className="flex items-center justify-between p-4 text-neutral-400">
      <Link className="flex" href="/">
        <Image alt="MCP Shop logo" src="/logo.png" height={40} width={40} />
        <div className="flex w-full items-center font-bold text-lg pl-1">
          mcp.shop
        </div>
      </Link>
      <div>
        {user ? (
          <div className="flex gap-2 items-center min-w-0">
            <Link className="flex gap-2 items-center" href="/orders">
              <ShoppingCartIcon className="h-5 border rounded m-1 text-foreground" />
              <div className="hidden lg:block whitespace-nowrap">
                Welcome back, {user.firstName ?? user.email}.
              </div>
            </Link>
            <form
              className="inline"
              action={async () => {
                "use server";
                const { withAuth } = await import("@workos-inc/authkit-nextjs");
                const { user: currentUser } = await withAuth({
                  ensureSignedIn: false,
                });
                if (currentUser) {
                  const { getPostHogClient } =
                    await import("@/lib/posthog-server");
                  const posthog = getPostHogClient();
                  posthog.capture({
                    distinctId: currentUser.id,
                    event: "sign_out",
                  });
                  await posthog.shutdown();
                }
                const { signOut } = await import("@workos-inc/authkit-nextjs");
                await signOut();
              }}
            >
              <button className="underline" type="submit">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link href={await getSignInUrl()}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
