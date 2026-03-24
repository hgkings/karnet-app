import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

function createRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = createRedis()

function createLimiter(prefix: string, requests: number, window: string) {
  if (!redis) return null
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window as Parameters<typeof Ratelimit.slidingWindow>[1]),
    analytics: true,
    prefix,
  })
}

// Auth endpoint'leri için — çok sıkı
const _authRateLimit = createLimiter('karnet:auth', 5, '1 m')

// Genel API için — normal
const _apiRateLimit = createLimiter('karnet:api', 60, '1 m')

// Email endpoint'leri için — çok sıkı
const _emailRateLimit = createLimiter('karnet:email', 3, '1 m')

// Fail-open: Redis yoksa veya hata olursa isteği engelleme
async function safeLimit(limiter: Ratelimit | null, key: string): Promise<{ success: boolean }> {
  if (!limiter) return { success: true }
  try {
    return await limiter.limit(key)
  } catch (err) {
    console.error('Rate limit error (fail-open):', err)
    return { success: true }
  }
}

export const authRateLimit = { limit: (key: string) => safeLimit(_authRateLimit, key) }
export const apiRateLimit = { limit: (key: string) => safeLimit(_apiRateLimit, key) }
export const emailRateLimit = { limit: (key: string) => safeLimit(_emailRateLimit, key) }

export function getIp(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  return xff ? xff.split(',')[0].trim() : '127.0.0.1'
}
