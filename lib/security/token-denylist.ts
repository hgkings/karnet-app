import { Redis } from '@upstash/redis'

// ----------------------------------------------------------------
// Token Denylist — JWT aninda iptal sistemi
// Redis tabanli — token'in kalan omru kadar TTL ile saklanir.
// Sifre degisiminde, logout'ta ve hesap kilitlemede kullanilir.
// ----------------------------------------------------------------

const PREFIX = 'karnet:denylist'

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = createRedis()

/**
 * Token'i iptal listesine ekler.
 * @param jti JWT ID (sub claim veya session_id)
 * @param ttlSeconds Token'in kalan omru (saniye)
 */
export async function revokeToken(jti: string, ttlSeconds: number = 3600): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(`${PREFIX}:${jti}`, ttlSeconds, '1')
  } catch {
    // Redis hatasi token iptalini engellemez
  }
}

/**
 * Token'in iptal edilip edilmedigini kontrol eder.
 */
export async function isTokenRevoked(jti: string): Promise<boolean> {
  if (!redis) return false
  try {
    const result = await redis.get(`${PREFIX}:${jti}`)
    return result !== null
  } catch {
    // Fail-open: Redis hatasi durumunda token'i gecerli say
    return false
  }
}

/**
 * Kullanicinin tum token'larini iptal eder (sifre degisimi, hesap kilitleme).
 * userId bazli blanket revocation.
 */
export async function revokeAllUserTokens(userId: string, ttlSeconds: number = 86400): Promise<void> {
  if (!redis) return
  try {
    await redis.setex(`${PREFIX}:user:${userId}`, ttlSeconds, '1')
  } catch {
    // Sessizce gec
  }
}

/**
 * Kullanicinin tum token'larinin iptal edilip edilmedigini kontrol eder.
 */
export async function areUserTokensRevoked(userId: string): Promise<boolean> {
  if (!redis) return false
  try {
    const result = await redis.get(`${PREFIX}:user:${userId}`)
    return result !== null
  } catch {
    return false
  }
}
