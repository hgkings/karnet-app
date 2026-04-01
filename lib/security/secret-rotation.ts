// ----------------------------------------------------------------
// Secret Rotation Yardimcisi
// Secret'larin yasini izler, uyari uretir.
// Vercel env'leri icin: rotation takvimi + otomatik hatirlatma
// ----------------------------------------------------------------

import { securityLog } from './logger'

interface SecretPolicy {
  name: string
  maxAgeDays: number
  description: string
  rotationGuide: string
}

/**
 * Her secret icin rotation politikasi.
 * maxAgeDays: Bu kadar gunden eski ise uyari uret.
 */
const SECRET_POLICIES: SecretPolicy[] = [
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    maxAgeDays: 180,
    description: 'Supabase admin erisim anahtari',
    rotationGuide: 'Supabase Dashboard → Settings → API → Service Role Key → Regenerate',
  },
  {
    name: 'MARKETPLACE_SECRET_KEY',
    maxAgeDays: 90,
    description: 'Marketplace AES sifreleme anahtari',
    rotationGuide: 'Yeni 32-byte hex key olustur, mevcut verileri yeni key ile yeniden sifrele',
  },
  {
    name: 'UPSTASH_REDIS_REST_TOKEN',
    maxAgeDays: 180,
    description: 'Upstash Redis erisim token',
    rotationGuide: 'Upstash Console → Database → REST API → Reset Token',
  },
  {
    name: 'BREVO_SMTP_KEY',
    maxAgeDays: 365,
    description: 'Brevo email API anahtari',
    rotationGuide: 'Brevo Dashboard → SMTP & API → API Keys → Create',
  },
  {
    name: 'PAYTR_MERCHANT_KEY',
    maxAgeDays: 365,
    description: 'PayTR odeme merchant key',
    rotationGuide: 'PayTR Magaza Paneli → Bilgi → API Entegrasyon Bilgileri',
  },
  {
    name: 'PAYTR_MERCHANT_SALT',
    maxAgeDays: 365,
    description: 'PayTR odeme merchant salt',
    rotationGuide: 'PayTR Magaza Paneli → Bilgi → API Entegrasyon Bilgileri',
  },
]

/**
 * Secret rotation tarihlerini takip et.
 * ENV uzerinden: SECRET_ROTATED_<NAME>=YYYY-MM-DD formatinda.
 * Ornek: SECRET_ROTATED_SUPABASE_SERVICE_ROLE_KEY=2026-01-15
 */
export interface RotationStatus {
  name: string
  description: string
  exists: boolean
  lastRotated: string | null
  ageDays: number | null
  maxAgeDays: number
  status: 'ok' | 'warning' | 'expired' | 'unknown'
  rotationGuide: string
}

export function checkSecretRotation(): RotationStatus[] {
  const now = Date.now()
  const results: RotationStatus[] = []

  for (const policy of SECRET_POLICIES) {
    const envValue = process.env[policy.name]
    const rotationDateStr = process.env[`SECRET_ROTATED_${policy.name}`]

    let lastRotated: string | null = null
    let ageDays: number | null = null
    let status: RotationStatus['status'] = 'unknown'

    if (rotationDateStr) {
      const rotationDate = new Date(rotationDateStr)
      if (!isNaN(rotationDate.getTime())) {
        lastRotated = rotationDateStr
        ageDays = Math.floor((now - rotationDate.getTime()) / (1000 * 60 * 60 * 24))

        if (ageDays > policy.maxAgeDays) {
          status = 'expired'
        } else if (ageDays > policy.maxAgeDays * 0.8) {
          status = 'warning' // %80'e ulasti — yaklasıyor
        } else {
          status = 'ok'
        }
      }
    }

    results.push({
      name: policy.name,
      description: policy.description,
      exists: !!envValue,
      lastRotated,
      ageDays,
      maxAgeDays: policy.maxAgeDays,
      status,
      rotationGuide: policy.rotationGuide,
    })
  }

  return results
}

/**
 * Rotation durumunu kontrol et ve suresi gecmis secret'lar icin uyari logla.
 * Cron job veya startup'ta cagrilabilir.
 */
export function auditSecretRotation(): { expiredCount: number; warningCount: number } {
  const results = checkSecretRotation()
  let expiredCount = 0
  let warningCount = 0

  for (const r of results) {
    if (r.status === 'expired') {
      expiredCount++
      securityLog({
        event: 'secret_rotation_expired',
        level: 'HIGH',
        metadata: {
          secret: r.name,
          ageDays: r.ageDays,
          maxAgeDays: r.maxAgeDays,
          guide: r.rotationGuide,
        },
      })
    } else if (r.status === 'warning') {
      warningCount++
      securityLog({
        event: 'secret_rotation_warning',
        level: 'MEDIUM',
        metadata: {
          secret: r.name,
          ageDays: r.ageDays,
          maxAgeDays: r.maxAgeDays,
        },
      })
    }
  }

  return { expiredCount, warningCount }
}
