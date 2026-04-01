// ----------------------------------------------------------------
// Output Sanitizasyon — API response guvenlik katmani
// Hassas bilgilerin (tablo adi, stack trace, DB detayi)
// kullaniciya gonderilmesini engeller.
// ----------------------------------------------------------------

/**
 * Hata response'unu sanitize eder.
 * Stack trace, tablo adlari ve teknik detaylar gizlenir.
 * Sadece genel, kullanici dostu mesajlar doner.
 */
export function sanitizeErrorResponse(
  error: unknown,
  fallbackMessage = 'Islem basarisiz oldu. Lutfen tekrar deneyin.'
): { error: string; code: string } {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase()

    // DB hatalari — tablo/column adlarini gizle
    if (
      msg.includes('pgrst') ||
      msg.includes('duplicate key') ||
      msg.includes('violates') ||
      msg.includes('relation') ||
      msg.includes('column')
    ) {
      return { error: 'Veri isleme hatasi olustu.', code: 'database_error' }
    }

    // Auth hatalari
    if (msg.includes('jwt') || msg.includes('token') || msg.includes('unauthorized')) {
      return { error: 'Oturum suresi doldu. Lutfen tekrar giris yapin.', code: 'unauthorized' }
    }

    // Rate limit
    if (msg.includes('rate limit') || msg.includes('too many')) {
      return { error: 'Cok fazla istek gonderdiniz. Lutfen bekleyin.', code: 'rate_limited' }
    }

    // Validation hatalari — bunlar kullaniciya gosterilebilir
    if (msg.includes('validation') || msg.includes('zorunlu') || msg.includes('gecersiz')) {
      return { error: error.message, code: 'validation_error' }
    }
  }

  return { error: fallbackMessage, code: 'internal_error' }
}

/**
 * Kullanici profil response'undan hassas alanlari cikarir.
 */
export function sanitizeProfileResponse(profile: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...profile }

  // Hassas alanlar — response'tan cikarilir
  delete sanitized.raw_app_meta_data
  delete sanitized.raw_user_meta_data
  delete sanitized.password_hash
  delete sanitized.encrypted_password
  delete sanitized.confirmation_token
  delete sanitized.recovery_token
  delete sanitized.service_role_key

  return sanitized
}

/**
 * Analiz response'undan potansiyel hassas alanlari cikarir.
 * user_id kalmali (frontend sahiplik kontrolu icin gerekli).
 */
export function sanitizeAnalysisResponse(analysis: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...analysis }

  // Internal metadata alanlarini cikar
  delete sanitized.raw_payload
  delete sanitized.internal_notes

  return sanitized
}

/**
 * Response header'larindan teknoloji ifsa edenleri cikarir.
 */
export function stripSensitiveHeaders(headers: Headers): void {
  headers.delete('x-powered-by')
  headers.delete('server')
}
