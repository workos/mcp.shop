import { createClient } from "redis";

const redis = createClient({ url: process.env.REDIS_URL });
await redis.connect();
export default redis;
