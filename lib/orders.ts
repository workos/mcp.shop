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
  phone?: string;
  // Address fields
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  // Legacy field for backward compatibility
  mailingAddress: string;
  tshirtSize: string;
  isRunMcpShirt: boolean;
  sent: boolean;
  deleted?: boolean;
}

export const placeOrder = async (
  args: {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    phone?: string;
    streetAddress1: string;
    streetAddress2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
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

    // Build legacy mailingAddress from components for backward compatibility
    const mailingAddressParts = [
      args.streetAddress1,
      args.streetAddress2,
      args.city,
      args.state,
      args.zip,
      args.country,
    ].filter(Boolean);
    const mailingAddress = mailingAddressParts.join(", ");

    const order: Order = {
      id: orderId,
      userId: user.id,
      orderDate: new Date().toISOString(),
      sku: isRunShirt ? "MCP-RUN-NTSHRT-25-GW01" : "MCP-NTSHRT-25-GW01",
      firstName: args.firstName,
      lastName: args.lastName,
      email: args.email,
      company: args.company,
      phone: args.phone,
      streetAddress1: args.streetAddress1,
      streetAddress2: args.streetAddress2,
      city: args.city,
      state: args.state,
      zip: args.zip,
      country: args.country,
      mailingAddress: mailingAddress,
      tshirtSize: args.tshirtSize,
      isRunMcpShirt: isRunShirt,
      sent: false,
      deleted: false,
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
  const allOrders = await getOrdersMatchingPattern(`orders:*`);
  // Filter out deleted orders
  return allOrders.filter(order => !order.deleted);
};

export const updateOrderSentStatus = async (
  userId: string,
  orderId: number,
  sent: boolean,
): Promise<void> => {
  try {
    await withTimeout(
      redis.hset(`orders:${userId}:${orderId}`, { sent }),
      1000,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      throw new Error(
        "Redis connection timed out. Please check your Redis configuration.",
      );
    }
    throw error;
  }
};

export const deleteOrder = async (
  userId: string,
  orderId: number,
): Promise<void> => {
  try {
    await withTimeout(
      redis.hset(`orders:${userId}:${orderId}`, { deleted: true }),
      1000,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("timed out")) {
      throw new Error(
        "Redis connection timed out. Please check your Redis configuration.",
      );
    }
    throw error;
  }
};
