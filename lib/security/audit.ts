// ----------------------------------------------------------------
// Audit Logger — tum onemli aksiyonlari loglar.
// Production'da audit_logs tablosuna yazar (fire-and-forget).
// ----------------------------------------------------------------

import { createAdminClient } from '@/lib/supabase/admin'

export type AuditAction =
  | 'auth.login'
  | 'auth.logout'
  | 'auth.register'
  | 'auth.password_reset'
  | 'analysis.create'
  | 'analysis.update'
  | 'analysis.delete'
  | 'marketplace.connect'
  | 'marketplace.disconnect'
  | 'marketplace.sync'
  | 'payment.create'
  | 'payment.callback'
  | 'admin.activate_payment'
  | 'admin.user_update'
  | 'support.ticket_create'
  | 'support.ticket_reply'
  | 'email.send'
  | 'user.delete_account'
  | 'security.cron_auth_fail'

interface AuditEntry {
  action: AuditAction
  userId: string | null
  traceId: string
  metadata?: Record<string, unknown>
  ip?: string
}

/**
 * Audit log kaydi olusturur.
 * DB'ye yazma fire-and-forget — hata olursa sessizce gecer (ana istegi bloklamamali).
 */
export async function auditLog(entry: AuditEntry): Promise<void> {
  const logEntry = {
    action: entry.action,
    user_id: entry.userId,
    trace_id: entry.traceId,
    metadata: entry.metadata ?? {},
    ip: entry.ip ?? 'unknown',
    created_at: new Date().toISOString(),
  }

  try {
    const supabase = createAdminClient()
    await supabase.from('audit_logs').insert(logEntry)
  } catch {
    // Fire-and-forget: audit hatasi ana istegi bloklamamali
  }
}

/**
 * Trace ID uretir — her istegi takip etmek icin.
 * Format: trc_{timestamp}_{random}
 */
export function generateTraceId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `trc_${timestamp}_${random}`
}
