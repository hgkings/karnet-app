import { Redis } from '@upstash/redis'

// ----------------------------------------------------------------
// Session Guard — Suppheli oturum aktivitesi tespiti
// Her API isteginde kontrol edilir (lightweight).
// IP degisimi, esanli oturum ve payload boyutu kontrolu.
// ----------------------------------------------------------------

const PREFIX = 'karnet:session'
const MAX_CONCURRENT_SESSIONS = 5
const MAX_PAYLOAD_BYTES = 1_048_576 // 1MB

function createRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = createRedis()

export interface SessionCheckResult {
  allowed: boolean
  reason?: string
  anomalyDetected: boolean
  anomalyType?: 'ip_change' | 'concurrent_sessions' | 'payload_too_large'
}

/**
 * Request payload boyutunu kontrol eder.
 * 1MB'tan buyuk payload'lar reddedilir (DDoS/payload inflation korunmasi).
 */
export function checkPayloadSize(contentLength: number | null): SessionCheckResult {
  if (contentLength && contentLength > MAX_PAYLOAD_BYTES) {
    return {
      allowed: false,
      reason: 'Istek boyutu cok buyuk.',
      anomalyDetected: true,
      anomalyType: 'payload_too_large',
    }
  }
  return { allowed: true, anomalyDetected: false }
}

/**
 * Kullanicinin aktif oturum sayisini kontrol eder.
 * MAX_CONCURRENT_SESSIONS'dan fazlasi varsa uyari uretir.
 */
export async function checkConcurrentSessions(userId: string): Promise<SessionCheckResult> {
  if (!redis) return { allowed: true, anomalyDetected: false }

  try {
    const key = `${PREFIX}:active:${userId}`
    const count = await redis.scard(key)

    if (count > MAX_CONCURRENT_SESSIONS) {
      return {
        allowed: true, // Engellemez, ama uyari uretir
        anomalyDetected: true,
        anomalyType: 'concurrent_sessions',
        reason: `${count} esanli oturum tespit edildi.`,
      }
    }

    return { allowed: true, anomalyDetected: false }
  } catch {
    return { allowed: true, anomalyDetected: false }
  }
}

/**
 * Kullanicinin aktif session'ini kaydeder.
 */
export async function registerSession(userId: string, sessionId: string, ip: string): Promise<void> {
  if (!redis) return

  try {
    const key = `${PREFIX}:active:${userId}`
    const metaKey = `${PREFIX}:meta:${userId}:${sessionId}`

    // Session'i aktif sete ekle
    await redis.sadd(key, sessionId)
    await redis.expire(key, 86400 * 30) // 30 gun

    // Session metadata sakla
    await redis.hset(metaKey, {
      ip,
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
    })
    await redis.expire(metaKey, 86400 * 30)
  } catch {
    // Sessizce gec
  }
}

/**
 * Session'i kaldirir (logout).
 */
export async function removeSession(userId: string, sessionId: string): Promise<void> {
  if (!redis) return

  try {
    await redis.srem(`${PREFIX}:active:${userId}`, sessionId)
    await redis.del(`${PREFIX}:meta:${userId}:${sessionId}`)
  } catch {
    // Sessizce gec
  }
}
