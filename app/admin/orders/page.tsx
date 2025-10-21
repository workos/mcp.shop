import { getOrdersForAllUsers } from "@/lib/orders";
import { OrdersTable } from "./orders-table";

export default async function AdminOrdersPage() {
  const orders = await getOrdersForAllUsers();

  return <OrdersTable initialOrders={orders} />;
}
