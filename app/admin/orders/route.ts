import { withAuth } from "@workos-inc/authkit-nextjs";

export async function GET() {
  const { permissions } = await withAuth({ ensureSignedIn: true });
  if (!permissions || !permissions.includes("orders:manage")) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  return Response.json("cool");
}
