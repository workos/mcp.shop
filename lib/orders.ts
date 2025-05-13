import redis from "@/lib/redis";
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
  const orderId = await redis.incr("order:id:counter");

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

  await redis.hSet(`orders:${user.id}:${orderId}`, { ...order });

  return order;
};

export const getOrders = async (user: User): Promise<Order[]> => {
  const orders: Order[] = [];

  for await (const key of redis.scanIterator({
    MATCH: `orders:${user.id}:*`,
    COUNT: 100,
  })) {
    orders.push((await redis.hGetAll(key)) as unknown as Order);
  }

  return orders;
};
