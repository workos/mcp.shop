import redis, { withTimeout } from "@/lib/redis";
import { User } from "./with-authkit";

export interface Order {
  id: number;
  userId: User["id"];
  orderDate: string;
  sku: "MCP-NTSHRT-25-GW01";
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  tshirtSize: string;
}

export const placeOrder = async (
  args: {
    company: string;
    mailingAddress: string;
    tshirtSize: string;
  },
  user: User,
) => {
  const orderId = await withTimeout(redis.incr("order:id:counter"), 500);

  const order: Order = {
    id: orderId,
    userId: user.id,
    orderDate: new Date().toISOString(),
    sku: "MCP-NTSHRT-25-GW01",
    firstName: user.firstName ?? "UNKNOWN",
    lastName: user.lastName ?? "UNKNOWN",
    email: user.email,
    company: args.company,
    tshirtSize: args.tshirtSize,
  };

  await withTimeout(redis.hset(`orders:${user.id}:${orderId}`, { ...order }));

  return order;
};

export const getOrders = async (user: User): Promise<Order[]> => {
  const orders: Order[] = [];
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: `orders:${user.id}:*`,
      count: 100,
    });
    cursor = nextCursor;
    for (const key of keys) {
      orders.push((await redis.hgetall(key)) as unknown as Order);
    }
  } while (cursor !== "0");

  return orders;
};
