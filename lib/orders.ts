import redis from "@/lib/redis";
import { User } from "./with-authkit";

export interface Order extends HSETObject {
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
    orderDate: new Date().toUTCString(),
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
  let cursor = 0;
  do {
    const orderKeys = await redis.scan(cursor, {
      MATCH: `orders:${user.id}:*`,
      COUNT: 100,
    });
    for (const key of orderKeys.keys) {
      orders.push((await redis.hGetAll(key)) as unknown as Order);
    }
    cursor = orderKeys.cursor;
  } while (cursor !== 0);
  return orders;
};
