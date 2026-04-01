import { revokeAllUserTokens } from './token-denylist'
import { securityLog } from './logger'
import { auditLog } from './audit'

// ----------------------------------------------------------------
// Olay Mudahale — Otomatik guvenlik aksiyonlari
// Hesap kilitleme, acil durum ve bildirim fonksiyonlari.
// ----------------------------------------------------------------

/**
 * Kullanici hesabini kilitler.
 * Tum aktif session'lar sonlandirilir.
 */
export async function lockUserAccount(userId: string, reason: string): Promise<void> {
  // Tum token'lari iptal et (24 saat)
  await revokeAllUserTokens(userId, 86400)

  // Guvenlik logu
  securityLog({
    event: 'account.locked',
    level: 'CRITICAL',
    userId,
    metadata: { reason },
  })

  // Audit log
  await auditLog({
    action: 'security.account_locked',
    userId,
    traceId: `incident_${Date.now()}`,
    metadata: { reason },
  })
}

/**
 * Guvenlik olayini bildirir ve loglar.
 */
export async function notifySecurityIncident(incident: {
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  userId: string | null
  ip: string | null
  details: Record<string, unknown>
}): Promise<void> {
  securityLog({
    event: `incident.${incident.type}`,
    level: incident.severity,
    userId: incident.userId,
    ip: incident.ip,
    metadata: incident.details,
  })

  await auditLog({
    action: 'security.incident_reported',
    userId: incident.userId,
    traceId: `incident_${Date.now()}`,
    metadata: {
      type: incident.type,
      severity: incident.severity,
      ...incident.details,
    },
  })
}
