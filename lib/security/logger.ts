// ----------------------------------------------------------------
// Merkezi Guvenlik Loglama Sistemi
// Yapilandirilmis JSON log — Vercel Log Drains uyumlu.
// ASLA loglanmaz: sifreler, token'lar, API key'ler, kredi karti.
// ----------------------------------------------------------------

export type LogLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO'

export interface SecurityLogEntry {
  timestamp: string
  level: LogLevel
  event: string
  userId: string | null
  ip: string | null
  path: string | null
  method: string | null
  statusCode: number | null
  duration: number | null
  requestId: string | null
  metadata?: Record<string, unknown>
}

/**
 * Guvenlik olayini loglar.
 * Production: JSON format (Vercel Log Drains ile uyumlu)
 * Development: Okunabilir format
 */
export function securityLog(entry: Partial<SecurityLogEntry> & { event: string; level: LogLevel }): void {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    level: entry.level,
    event: entry.event,
    userId: entry.userId ?? null,
    ip: entry.ip ?? null,
    path: entry.path ?? null,
    method: entry.method ?? null,
    statusCode: entry.statusCode ?? null,
    duration: entry.duration ?? null,
    requestId: entry.requestId ?? null,
    metadata: sanitizeMetadata(entry.metadata),
  }

  // JSON output — Vercel Log Drains, Datadog, vb. tarafindan parse edilir
  const output = JSON.stringify(logEntry)

  switch (entry.level) {
    case 'CRITICAL':
    case 'HIGH':
      process.stderr.write(`[SECURITY:${entry.level}] ${output}\n`)
      break
    default:
      process.stdout.write(`[SECURITY:${entry.level}] ${output}\n`)
      break
  }
}

/**
 * Metadata icindeki hassas alanlari temizler.
 * Sifreler, token'lar, API key'ler loglanMAZ.
 */
function sanitizeMetadata(metadata?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!metadata) return undefined

  const sanitized: Record<string, unknown> = {}
  const SENSITIVE_KEYS = [
    'password', 'token', 'secret', 'key', 'authorization',
    'cookie', 'credit_card', 'card_number', 'cvv', 'ssn',
    'api_key', 'apiKey', 'apiSecret', 'api_secret',
  ]

  for (const [k, v] of Object.entries(metadata)) {
    const lowerKey = k.toLowerCase()
    if (SENSITIVE_KEYS.some(s => lowerKey.includes(s))) {
      sanitized[k] = '[REDACTED]'
    } else {
      sanitized[k] = v
    }
  }

  return sanitized
}

// Kisayol fonksiyonlari
export function logAuthEvent(event: string, userId: string | null, ip: string | null, metadata?: Record<string, unknown>): void {
  securityLog({ event, level: event.includes('failed') || event.includes('blocked') ? 'HIGH' : 'LOW', userId, ip, metadata })
}

export function logAccessDenied(path: string, userId: string | null, ip: string | null): void {
  securityLog({ event: 'access.denied', level: 'HIGH', userId, ip, path })
}

export function logRateLimitExceeded(path: string, identifier: string, ip: string | null): void {
  securityLog({ event: 'rate_limit.exceeded', level: 'MEDIUM', userId: null, ip, path, metadata: { identifier } })
}

export function logAnomaly(type: string, userId: string | null, ip: string | null, details: Record<string, unknown>): void {
  securityLog({ event: `anomaly.${type}`, level: 'HIGH', userId, ip, metadata: details })
}
