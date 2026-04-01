import { Redis } from '@upstash/redis'

// ----------------------------------------------------------------
// Brute Force Korumasi — Kademeli kilitleme sistemi
// Upstash Redis ile calisir.
// 5 basarisiz → 5 dk kilitleme
// 10 basarisiz → 1 saat kilitleme
// 20 basarisiz → 24 saat kilitleme
// ----------------------------------------------------------------

const LOCKOUT_TIERS = [
  { attempts: 5, lockoutSeconds: 300 },       // 5 dk
  { attempts: 10, lockoutSeconds: 3600 },      // 1 saat
  { attempts: 20, lockoutSeconds: 86400 },     // 24 saat
] as const

const PREFIX = 'karnet:bruteforce'

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN

  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = createRedis()

interface BruteForceResult {
  allowed: boolean
  remainingAttempts: number
  lockoutSeconds: number
  totalAttempts: number
}

/**
 * Brute force kontrolu yapar.
 * @param identifier - email:ip kombinasyonu
 */
export async function checkLoginAttempts(
  identifier: string
): Promise<BruteForceResult> {
  if (process.env.NODE_ENV === 'development') {
    return { allowed: true, remainingAttempts: 999, lockoutSeconds: 0, totalAttempts: 0 }
  }

  if (!redis) {
    return { allowed: true, remainingAttempts: 999, lockoutSeconds: 0, totalAttempts: 0 }
  }

  try {
    const lockKey = `${PREFIX}:lock:${identifier}`
    const attemptsKey = `${PREFIX}:attempts:${identifier}`

    // Kilitleme kontrolu
    const lockTTL = await redis.ttl(lockKey)
    if (lockTTL > 0) {
      const attempts = (await redis.get<number>(attemptsKey)) ?? 0
      return {
        allowed: false,
        remainingAttempts: 0,
        lockoutSeconds: lockTTL,
        totalAttempts: attempts,
      }
    }

    // Mevcut deneme sayisi
    const attempts = (await redis.get<number>(attemptsKey)) ?? 0

    // En yuksek tier'a gore kalan deneme hesapla
    const nextTier = LOCKOUT_TIERS.find(t => attempts < t.attempts)
    const remainingAttempts = nextTier ? nextTier.attempts - attempts : 0

    return {
      allowed: true,
      remainingAttempts: Math.max(0, remainingAttempts),
      lockoutSeconds: 0,
      totalAttempts: attempts,
    }
  } catch {
    // Fail-open: Redis hatasi durumunda gecir
    return { allowed: true, remainingAttempts: 999, lockoutSeconds: 0, totalAttempts: 0 }
  }
}

/**
 * Basarisiz giris denemesini kaydeder.
 * Eger tier esigine ulasilirsa hesabi kilitler.
 */
export async function recordFailedAttempt(
  identifier: string
): Promise<{ locked: boolean; lockoutSeconds: number }> {
  if (!redis) return { locked: false, lockoutSeconds: 0 }

  try {
    const attemptsKey = `${PREFIX}:attempts:${identifier}`
    const lockKey = `${PREFIX}:lock:${identifier}`

    // Atomik arttirma
    const newCount = await redis.incr(attemptsKey)

    // Ilk deneme ise 24 saat TTL koy (otomatik temizlik)
    if (newCount === 1) {
      await redis.expire(attemptsKey, 86400)
    }

    // Kademeli kilitleme kontrolu (en yuksek uygun tier)
    let lockoutSeconds = 0
    for (const tier of LOCKOUT_TIERS) {
      if (newCount >= tier.attempts) {
        lockoutSeconds = tier.lockoutSeconds
      }
    }

    if (lockoutSeconds > 0) {
      await redis.setex(lockKey, lockoutSeconds, '1')
      return { locked: true, lockoutSeconds }
    }

    return { locked: false, lockoutSeconds: 0 }
  } catch {
    return { locked: false, lockoutSeconds: 0 }
  }
}

/**
 * Basarili giris sonrasi deneme sayacini sifirlar.
 */
export async function resetAttempts(identifier: string): Promise<void> {
  if (!redis) return

  try {
    const attemptsKey = `${PREFIX}:attempts:${identifier}`
    const lockKey = `${PREFIX}:lock:${identifier}`
    await redis.del(attemptsKey, lockKey)
  } catch {
    // Sessizce gec — resetAttempts basarisiz olsa bile login'i engellemez
  }
}
