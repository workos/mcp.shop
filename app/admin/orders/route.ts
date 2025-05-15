import { withAuth } from "@workos-inc/authkit-nextjs";

export async function GET(_req: Request) {
  const { permissions } = await withAuth();
  if (!permissions?.includes("orders:manage")) {
    return new Response("Forbidden", {
      status: 403,
    });
  }
  return Response.json("cool");
}
