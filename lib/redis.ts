import { createClient } from "redis";

export const withTimeout = <T,>(promise: Promise<T>, ms: number = 2_000) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), ms),
    ),
  ]);

const redis = createClient({ url: process.env.REDIS_URL });

withTimeout(
  redis.connect(),
  2_000
);

export default redis;
