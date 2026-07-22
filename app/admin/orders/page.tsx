import { getOrdersForAllUsers } from "@/lib/orders";
import { requireAdmin } from "@/lib/admin-auth";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = await getOrdersForAllUsers();

  return <OrdersTable initialOrders={orders} />;
}
