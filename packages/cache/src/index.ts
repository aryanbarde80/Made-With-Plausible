import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false
});
const namespace = `pulseboard:${process.env.NODE_ENV ?? "development"}`;

redis.on("error", () => {
  // Avoid noisy build-time unhandled error spam when Redis is not available.
});

function withNamespace(key: string) {
  return `${namespace}:${key}`;
}

export async function get<T>(key: string): Promise<T | null> {
  const value = await redis.get(withNamespace(key));
  return value ? (JSON.parse(value) as T) : null;
}

export async function set<T>(key: string, value: T, ttlSeconds: number) {
  await redis.set(withNamespace(key), JSON.stringify(value), "EX", ttlSeconds);
}

export async function del(key: string) {
  await redis.del(withNamespace(key));
}

export async function invalidatePattern(pattern: string) {
  const matcher = withNamespace(pattern);
  const keys: string[] = [];
  let cursor = "0";

  do {
    const [nextCursor, batch] = await redis.scan(cursor, "MATCH", matcher, "COUNT", 100);
    cursor = nextCursor;
    keys.push(...batch);
  } while (cursor !== "0");

  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

export async function rateLimitCheck(key: string, limit: number, windowSeconds: number) {
  const scopedKey = withNamespace(`ratelimit:${key}`);
  const total = await redis.incr(scopedKey);
  if (total === 1) {
    await redis.expire(scopedKey, windowSeconds);
  }

  return {
    allowed: total <= limit,
    remaining: Math.max(limit - total, 0)
  };
}
