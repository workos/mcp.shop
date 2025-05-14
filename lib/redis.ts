import { Redis, ScanCommandOptions } from "@upstash/redis";

export const withTimeout = <T>(promise: Promise<T>, ms: number = 2_000) =>
  Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Operation timed out")), ms),
    ),
  ]);

// const redis = createClient({ url: process.env.REDIS_URL });
// withTimeout(redis.connect(), 2_000);

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

export async function* scan(options: ScanCommandOptions) {
  let cursor = "0";

  do {
    const [nextCursor, keys] = await redis.scan(cursor, options);
    cursor = nextCursor;

    yield* keys;
  } while (cursor !== "0");
}

export default redis;
