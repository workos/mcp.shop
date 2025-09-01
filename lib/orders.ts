import redis, { scan, withTimeout } from "@/lib/redis";
import { User } from "./verify-authkit-token";

export interface Order {
  id: number;
  userId: User["id"];
  orderDate: string;
  sku: "MCP-NTSHRT-25-GW01";
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  mailingAddress: string;
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
    mailingAddress: args.mailingAddress ?? "UNKNOWN",
    email: user.email,
    company: args.company,
    tshirtSize: args.tshirtSize,
  };

  await withTimeout(redis.hset(`orders:${user.id}:${orderId}`, { ...order }));

  return order;
};

const getOrdersMatchingPattern = async (pattern: string) => {
  const orders: Order[] = [];

  for await (const key of scan({ match: pattern, count: 100 })) {
    orders.push((await redis.hgetall(key as string)) as unknown as Order);
  }

  return orders;
};

export const getOrders = async (user: User): Promise<Order[]> => {
  return getOrdersMatchingPattern(`orders:${user.id}:*`);
};

export const getOrdersForAllUsers = async (): Promise<Order[]> => {
  return getOrdersMatchingPattern(`orders:*`);
};
