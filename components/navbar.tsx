import { getSignInUrl, signOut, withAuth } from "@workos-inc/authkit-nextjs";
import Link from "next/link";
import Image from "next/image";

export async function Navbar() {
  const { user } = await withAuth();

  return (
    <nav className="flex items-center justify-between p-4">
      <Link className="flex" href="/">
        <Image alt="MCP Shop logo" src="/logo.png" height={30} width={30} />
        <div className="flex w-full items-center font-bold pl-1">MCP Shop</div>
      </Link>
      <div>
        {user ? (
          <>
            Welcome back, {user.firstName ?? user.email}.{" "}
            <form
              className="inline"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="underline" type="submit">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link href={await getSignInUrl()}>Sign in</Link>
        )}
      </div>
    </nav>
  );
}
