import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379");

export async function get<T>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function set<T>(key: string, value: T, ttlSeconds: number) {
  await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

export async function del(key: string) {
  await redis.del(key);
}

export async function invalidatePattern(pattern: string) {
  const keys = await redis.keys(pattern);
  if (keys.length) {
    await redis.del(keys);
  }
}

export async function rateLimitCheck(key: string, limit: number, windowSeconds: number) {
  const total = await redis.incr(key);
  if (total === 1) {
    await redis.expire(key, windowSeconds);
  }

  return {
    allowed: total <= limit,
    remaining: Math.max(limit - total, 0)
  };
}

