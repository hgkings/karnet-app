import { createClient } from '@/lib/supabase/client'

// ----------------------------------------------------------------
// MFA (Multi-Factor Authentication) yardimci fonksiyonlari
// Supabase TOTP MFA API'sini saran guvenlik katmani
// UI tarafindan kullanilir — DB import YOKTUR
// ----------------------------------------------------------------

export interface MFAEnrollResult {
  factorId: string
  qrCode: string
  secret: string
  uri: string
}

export interface MFAVerifyResult {
  success: boolean
  error?: string
}

export interface MFAStatus {
  enabled: boolean
  factorId: string | null
  currentLevel: 'aal1' | 'aal2'
  nextLevel: 'aal1' | 'aal2'
}

/**
 * MFA durumunu kontrol eder.
 */
export async function getMFAStatus(): Promise<MFAStatus> {
  const supabase = createClient()

  const { data: factors } = await supabase.auth.mfa.listFactors()
  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()

  const verifiedFactor = factors?.totp?.find((f: { id: string; status: string }) => f.status === 'verified')

  return {
    enabled: !!verifiedFactor,
    factorId: verifiedFactor?.id ?? null,
    currentLevel: aal?.currentLevel ?? 'aal1',
    nextLevel: aal?.nextLevel ?? 'aal1',
  }
}

/**
 * TOTP MFA kayit baslatir.
 * QR kod ve secret doner.
 */
export async function enrollMFA(): Promise<MFAEnrollResult | { error: string }> {
  const supabase = createClient()

  const { data, error } = await supabase.auth.mfa.enroll({
    factorType: 'totp',
    friendlyName: 'Karnet Authenticator',
  })

  if (error || !data) {
    return { error: error?.message ?? 'MFA kayit baslatılamadı.' }
  }

  return {
    factorId: data.id,
    qrCode: data.totp.qr_code,
    secret: data.totp.secret,
    uri: data.totp.uri,
  }
}

/**
 * MFA kodunu dogrulamak icin challenge olusturur ve verify eder.
 */
export async function verifyMFA(
  factorId: string,
  code: string
): Promise<MFAVerifyResult> {
  if (!/^\d{6}$/.test(code)) {
    return { success: false, error: 'Kod 6 haneli sayi olmalidir.' }
  }

  const supabase = createClient()

  const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
    factorId,
  })

  if (challengeError || !challenge) {
    return { success: false, error: challengeError?.message ?? 'Challenge olusturulamadı.' }
  }

  const { error: verifyError } = await supabase.auth.mfa.verify({
    factorId,
    challengeId: challenge.id,
    code,
  })

  if (verifyError) {
    return { success: false, error: 'Dogrulama kodu hatali. Tekrar deneyin.' }
  }

  return { success: true }
}

/**
 * MFA'yi devre disi birakir (factor'u siler).
 */
export async function unenrollMFA(factorId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  const { error } = await supabase.auth.mfa.unenroll({ factorId })

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}
