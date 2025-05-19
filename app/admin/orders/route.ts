import { getOrdersForAllUsers } from "@/lib/orders";
import { withAuth } from "@workos-inc/authkit-nextjs";

export async function GET() {
  const { permissions } = await withAuth({ ensureSignedIn: true });
  if (!permissions || !permissions.includes("orders:manage")) {
    return new Response("Forbidden", {
      status: 403,
    });
  }

  const allOrders = await getOrdersForAllUsers();
  return Response.json(allOrders);
}
