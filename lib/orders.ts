import redis from "@/lib/redis";
import { User } from "./with-authkit";

export const placeOrder = async (
  args: {
    company: string;
    mailingAddress: string;
    tshirtSize: string;
  },
  user: User,
) => {
  const orderId = await redis.incr("order:id:counter");

  const order = {
    id: orderId,
    userId: user.id,
    sku: "MCP-NTSHRT-25-GW01",
    firstName: user.firstName ?? "UNKNOWN",
    lastName: user.lastName ?? "UNKNOWN",
    email: user.email,
    company: args.company,
    tshirtSize: args.tshirtSize,
  };

  await redis.hSet(`orders:${orderId}`, order);

  return order;
};
