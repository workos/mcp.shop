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
  
  // Validate required inputs
  const requiredFields = {
    firstName: args.firstName,
    lastName: args.lastName,
    email: args.email,
    company: args.company,
    streetAddress1: args.streetAddress1,
    city: args.city,
    state: args.state,
    zip: args.zip,
    country: args.country,
    tshirtSize: args.tshirtSize,
  };

  const missingFields = Object.entries(requiredFields)
    .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
    .map(([key]) => key);

  if (missingFields.length > 0) {
    throw new Error(
      `Missing required fields: ${missingFields.join(', ')}. Please fill in all required information.`
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(args.email)) {
    throw new Error('Invalid email address format.');
  }

  // Validate state code (2 letters)
  if (args.state.length !== 2 || !/^[A-Z]{2}$/i.test(args.state)) {
    throw new Error('State must be a 2-letter code (e.g., CA, NY).');
  }

  // Validate country code (2 letters)
  if (args.country.length !== 2 || !/^[A-Z]{2}$/i.test(args.country)) {
    throw new Error('Country must be a 2-letter code (e.g., US, CA).');
  }

  // Validate t-shirt size
  const validSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  if (!validSizes.includes(args.tshirtSize)) {
    throw new Error(`Invalid t-shirt size. Must be one of: ${validSizes.join(', ')}.`);
  }

  // Validate ZIP code (basic check - not empty and reasonable length)
  if (args.zip.length < 3 || args.zip.length > 10) {
    throw new Error('Invalid ZIP/postal code format.');
  }
  
  // Check if Redis is configured
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    throw new Error(
      "Redis is not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.",
    );
  }

  try {
    const orderId = await withTimeout(redis.incr("order:id:counter"), 1000);
    const isRunShirt = args.isRunMcpShirt ?? false;

    // Sanitize inputs (trim whitespace)
    const sanitizedArgs = {
      firstName: args.firstName.trim(),
      lastName: args.lastName.trim(),
      email: args.email.trim().toLowerCase(),
      company: args.company.trim(),
      phone: args.phone?.trim(),
      streetAddress1: args.streetAddress1.trim(),
      streetAddress2: args.streetAddress2?.trim(),
      city: args.city.trim(),
      state: args.state.trim().toUpperCase(),
      zip: args.zip.trim(),
      country: args.country.trim().toUpperCase(),
      tshirtSize: args.tshirtSize,
      isRunMcpShirt: isRunShirt,
    };

    // Build legacy mailingAddress from components for backward compatibility
    const mailingAddressParts = [
      sanitizedArgs.streetAddress1,
      sanitizedArgs.streetAddress2,
      sanitizedArgs.city,
      sanitizedArgs.state,
      sanitizedArgs.zip,
      sanitizedArgs.country,
    ].filter(Boolean);
    const mailingAddress = mailingAddressParts.join(", ");

    const order: Order = {
      id: orderId,
      userId: user.id,
      orderDate: new Date().toISOString(),
      sku: isRunShirt ? "MCP-RUN-NTSHRT-25-GW01" : "MCP-NTSHRT-25-GW01",
      firstName: sanitizedArgs.firstName,
      lastName: sanitizedArgs.lastName,
      email: sanitizedArgs.email,
      company: sanitizedArgs.company,
      phone: sanitizedArgs.phone,
      streetAddress1: sanitizedArgs.streetAddress1,
      streetAddress2: sanitizedArgs.streetAddress2,
      city: sanitizedArgs.city,
      state: sanitizedArgs.state,
      zip: sanitizedArgs.zip,
      country: sanitizedArgs.country,
      mailingAddress: mailingAddress,
      tshirtSize: sanitizedArgs.tshirtSize,
      isRunMcpShirt: sanitizedArgs.isRunMcpShirt,
      sent: false,
      deleted: false,
    };

    // Filter out null/undefined values for Redis (Redis doesn't accept null values)
    const orderForRedis = Object.fromEntries(
      Object.entries(order).filter(([_, value]) => value != null)
    );

    await withTimeout(
      redis.hset(`orders:${user.id}:${orderId}`, orderForRedis),
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
