// ----------------------------------------------------------------
// Environment Variable Dogrulama
// Uygulama baslatildiginda zorunlu env degiskenlerini kontrol eder.
// Eksik veya hatali env varsa erken crash (fail-fast).
// ----------------------------------------------------------------

interface EnvRule {
  name: string
  required: boolean
  minLength?: number
  mustNotBePublic?: boolean // NEXT_PUBLIC_ ile baslamasi YASAK
}

const ENV_RULES: EnvRule[] = [
  // Public (client-side)
  { name: 'NEXT_PUBLIC_SUPABASE_URL', required: true, minLength: 10 },
  { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', required: true, minLength: 20 },
  { name: 'NEXT_PUBLIC_APP_URL', required: true, minLength: 5 },

  // Private (server-side only)
  { name: 'SUPABASE_SERVICE_ROLE_KEY', required: true, minLength: 20, mustNotBePublic: true },
  { name: 'MARKETPLACE_SECRET_KEY', required: true, minLength: 10, mustNotBePublic: true },

  // Upstash Redis
  { name: 'UPSTASH_REDIS_REST_URL', required: false, minLength: 10 },
  { name: 'UPSTASH_REDIS_REST_TOKEN', required: false, minLength: 10, mustNotBePublic: true },

  // Email
  { name: 'BREVO_SMTP_KEY', required: false, minLength: 5, mustNotBePublic: true },

  // PayTR
  { name: 'PAYTR_MERCHANT_ID', required: false, mustNotBePublic: true },
  { name: 'PAYTR_MERCHANT_KEY', required: false, mustNotBePublic: true },
  { name: 'PAYTR_MERCHANT_SALT', required: false, mustNotBePublic: true },
]

export interface EnvValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Tum env degiskenlerini dogruladir.
 * Production'da zorunlu eksikse hata firlatir.
 * Development'ta uyari verir.
 */
export function validateEnv(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  const isProduction = process.env.NODE_ENV === 'production'

  for (const rule of ENV_RULES) {
    const value = process.env[rule.name]

    // Zorunlu kontrolu
    if (rule.required && (!value || value.trim().length === 0)) {
      if (isProduction) {
        errors.push(`${rule.name} tanimlanmamis (zorunlu)`)
      } else {
        warnings.push(`${rule.name} tanimlanmamis (zorunlu — production'da hata verir)`)
      }
      continue
    }

    // Deger varsa uzunluk kontrolu
    if (value && rule.minLength && value.length < rule.minLength) {
      warnings.push(`${rule.name} cok kisa (min: ${rule.minLength} karakter)`)
    }

    // NEXT_PUBLIC_ kontrolu (hassas deger public olmamali)
    if (rule.mustNotBePublic) {
      // Ayni degerin NEXT_PUBLIC_ versiyonu var mi kontrol et
      const publicVersion = process.env[`NEXT_PUBLIC_${rule.name}`]
      if (publicVersion) {
        errors.push(`${rule.name} NEXT_PUBLIC_ ile ifsa ediliyor — GUVENLIK ACIGI`)
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Startup'ta cagrilir. Production'da hatali env varsa crash eder.
 */
export function assertEnvValid(): void {
  const result = validateEnv()

  if (result.warnings.length > 0 && process.env.NODE_ENV !== 'production') {
    for (const w of result.warnings) {
      // Development: sadece uyari
      process.stderr.write(`[env-validator] UYARI: ${w}\n`)
    }
  }

  if (!result.valid) {
    for (const e of result.errors) {
      process.stderr.write(`[env-validator] HATA: ${e}\n`)
    }
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Env dogrulama basarisiz: ${result.errors.join(', ')}`)
    }
  }
}
