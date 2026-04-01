// ----------------------------------------------------------------
// Monitoring & Alerting Sistemi
// Hata sayaci, rate spike tespiti, alert webhook desteği
// ----------------------------------------------------------------

import { securityLog } from './logger'

interface ErrorBucket {
  count: number
  firstSeen: number
  lastSeen: number
}

// In-memory error tracking (Vercel serverless icin yeterli)
// Her cold start'ta sifirlanir — persistent monitoring icin Upstash Redis kullanilabilir
const errorBuckets = new Map<string, ErrorBucket>()
const BUCKET_WINDOW_MS = 5 * 60 * 1000 // 5 dakika
const ALERT_THRESHOLD = 10 // 5 dk icinde 10+ ayni hata → alert

/**
 * Bir hatayi kaydet ve eger esik asilirsa alert uret.
 */
export function trackError(
  category: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  const key = `${category}:${message.slice(0, 100)}`
  const now = Date.now()

  const existing = errorBuckets.get(key)

  if (existing && now - existing.firstSeen < BUCKET_WINDOW_MS) {
    existing.count++
    existing.lastSeen = now

    // Esik asildi — alert
    if (existing.count === ALERT_THRESHOLD) {
      triggerAlert({
        type: 'error_spike',
        category,
        message: `5 dk icinde ${ALERT_THRESHOLD}+ tekrar: ${message.slice(0, 200)}`,
        count: existing.count,
        metadata,
      })
    }
  } else {
    // Yeni bucket veya suresi dolmus
    errorBuckets.set(key, { count: 1, firstSeen: now, lastSeen: now })
  }

  // Eski bucket'lari temizle (memory leak onleme)
  if (errorBuckets.size > 500) {
    const cutoff = now - BUCKET_WINDOW_MS
    const keysToDelete: string[] = []
    errorBuckets.forEach((v, k) => {
      if (v.lastSeen < cutoff) keysToDelete.push(k)
    })
    keysToDelete.forEach(k => errorBuckets.delete(k))
  }
}

/**
 * API endpoint'lerin response surelerini izle.
 * Yavas endpoint tespiti icin.
 */
const SLOW_THRESHOLD_MS = 5000

export function trackLatency(
  path: string,
  method: string,
  durationMs: number,
  statusCode: number
): void {
  if (durationMs > SLOW_THRESHOLD_MS) {
    securityLog({
      event: 'slow_endpoint',
      level: 'MEDIUM',
      path,
      method,
      duration: durationMs,
      statusCode,
      metadata: { thresholdMs: SLOW_THRESHOLD_MS },
    })
  }

  if (statusCode >= 500) {
    trackError('http_5xx', `${method} ${path} → ${statusCode}`, { durationMs })
  }
}

// ----------------------------------------------------------------
// Alert Sistemi
// ----------------------------------------------------------------

interface AlertPayload {
  type: 'error_spike' | 'security_incident' | 'health_degraded'
  category: string
  message: string
  count?: number
  metadata?: Record<string, unknown>
}

/**
 * Alert uret — webhook URL varsa HTTP POST gonder, yoksa log'a yaz.
 * ALERT_WEBHOOK_URL env ile ayarlanir (Slack, Discord, PagerDuty, vb.)
 */
async function triggerAlert(payload: AlertPayload): Promise<void> {
  const webhookUrl = process.env.ALERT_WEBHOOK_URL

  securityLog({
    event: `alert:${payload.type}`,
    level: 'CRITICAL',
    metadata: {
      category: payload.category,
      message: payload.message,
      count: payload.count,
      ...payload.metadata,
    },
  })

  // Webhook URL validasyonu — sadece https URL'lere izin ver
  if (webhookUrl && webhookUrl.startsWith('https://')) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `[Karnet Alert] ${payload.type}: ${payload.message}`,
          ...payload,
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      })
    } catch {
      // Alert gonderilemedi — sessizce logla, uygulamayi etkileme
      securityLog({ event: 'alert_webhook_failed', level: 'MEDIUM' })
    }
  }
}

/**
 * Guvenlik olaylarinda alert tetikle.
 */
export function securityAlert(
  category: string,
  message: string,
  metadata?: Record<string, unknown>
): void {
  triggerAlert({
    type: 'security_incident',
    category,
    message,
    metadata,
  })
}

/**
 * Mevcut hata istatistiklerini getir (admin/debug icin).
 */
export function getErrorStats(): Array<{ key: string; count: number; firstSeen: string; lastSeen: string }> {
  const now = Date.now()
  const stats: Array<{ key: string; count: number; firstSeen: string; lastSeen: string }> = []

  errorBuckets.forEach((bucket, key) => {
    if (now - bucket.lastSeen < BUCKET_WINDOW_MS) {
      stats.push({
        key,
        count: bucket.count,
        firstSeen: new Date(bucket.firstSeen).toISOString(),
        lastSeen: new Date(bucket.lastSeen).toISOString(),
      })
    }
  })

  return stats.sort((a, b) => b.count - a.count)
}
