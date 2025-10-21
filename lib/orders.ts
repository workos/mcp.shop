import redis, { scan, withTimeout } from "@/lib/redis";
import { User } from "./with-authkit";

export interface Order {
  id: number;
  userId: User["id"];
  orderDate: string;
  sku: "MCP-NTSHRT-25-GW01" | "MCP-RUN-NTSHRT-25-GW01";
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  mailingAddress: string;
  tshirtSize: string;
  isRunMcpShirt: boolean;
}

export const placeOrder = async (
  args: {
    company: string;
    mailingAddress: string;
    tshirtSize: string;
    isRunMcpShirt?: boolean;
  },
  user: User,
) => {
  console.log("placeOrder", args, user);
  // Check if Redis is configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error(
      "Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.",
    );
  }

  try {
    const orderId = await withTimeout(redis.incr("order:id:counter"), 1000);
    const isRunShirt = args.isRunMcpShirt ?? false;

    const order: Order = {
      id: orderId,
      userId: user.id,
      orderDate: new Date().toISOString(),
      sku: isRunShirt ? "MCP-RUN-NTSHRT-25-GW01" : "MCP-NTSHRT-25-GW01",
      firstName: user.firstName ?? "UNKNOWN",
      lastName: user.lastName ?? "UNKNOWN",
      mailingAddress: args.mailingAddress ?? "UNKNOWN",
      email: user.email,
      company: args.company,
      tshirtSize: args.tshirtSize,
      isRunMcpShirt: isRunShirt,
    };

    await withTimeout(
      redis.hset(`orders:${user.id}:${orderId}`, { ...order }),
      1000,
    );

    console.log("✅ Order placed successfully:", {
      orderId: order.id,
      userId: user.id,
      email: user.email,
      sku: order.sku,
      size: order.tshirtSize,
      isRunMcpShirt: order.isRunMcpShirt,
    });
    
    return order;
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      throw new Error(
        "Redis connection timed out. Please check your Redis configuration.",
      );
    }
    throw error;
  }
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
