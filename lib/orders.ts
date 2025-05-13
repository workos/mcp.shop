import redis from "@/lib/redis";
import { User } from "./with-authkit";

export const placeOrder = async (
  args: {
    fullName: string;
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
    fullName:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : args.fullName,
    email: user.email,
    company: args.company,
    tshirtSize: args.tshirtSize,
  };

  await redis.hSet(`orders:${orderId}`, order);

  return order;
};
