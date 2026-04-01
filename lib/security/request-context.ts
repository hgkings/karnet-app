import { randomUUID } from 'crypto'

// ----------------------------------------------------------------
// Request Context — Her istek icin benzersiz ID ve tracing
// Request ID: kullanici destek bildirimlerinde kullanilir
// "X-Request-ID: abc123" ile loglari bulabiliyoruz
// ----------------------------------------------------------------

/**
 * Kriptografik olarak guclu, benzersiz request ID uretir.
 */
export function generateRequestId(): string {
  return randomUUID()
}

/**
 * Guclu trace ID uretir (audit log ve gateway icin).
 * Eski format (trc_timestamp_random) yerine UUID kullanir.
 */
export function generateTraceId(): string {
  return `trc_${randomUUID().replace(/-/g, '')}`
}
