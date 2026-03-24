import * as profilesDal from '@/dal/profiles'
import { User, PlanType, Marketplace } from '@/types'

const PREF_KEYS: (keyof User)[] = [
  'target_margin', 'margin_alert', 'default_marketplace', 'default_commission',
  'default_vat', 'monthly_profit_target', 'default_return_rate', 'default_ads_cost',
  'fixed_cost_monthly', 'target_profit_monthly',
  'email_weekly_report', 'email_risk_alert', 'email_margin_alert', 'email_pro_expiry'
]

const CORE_KEYS: (keyof User)[] = ['email', 'plan', 'email_notifications_enabled']
const ALL_ALLOWED_KEYS: (keyof User)[] = [...CORE_KEYS, ...PREF_KEYS]

function mapProfileRow(data: Record<string, unknown>): User {
  return {
    id: data.id as string,
    email: data.email as string,
    plan: (data.plan as PlanType) || 'free',
    pro_until: (data.pro_until as string) ?? null,
    pro_expires_at: (data.pro_expires_at as string) ?? null,
    pro_renewal: (data.pro_renewal as boolean) ?? true,
    pro_started_at: (data.pro_started_at as string) ?? null,
    email_notifications_enabled: data.email_notifications_enabled !== false,
    target_margin: (data.target_margin as number) ?? undefined,
    margin_alert: (data.margin_alert as boolean) ?? undefined,
    default_marketplace: data.default_marketplace as Marketplace | undefined,
    default_commission: (data.default_commission as number) ?? undefined,
    default_vat: (data.default_vat as number) ?? undefined,
    monthly_profit_target: (data.monthly_profit_target as number) ?? undefined,
    default_return_rate: (data.default_return_rate as number) ?? undefined,
    default_ads_cost: (data.default_ads_cost as number) ?? undefined,
    fixed_cost_monthly: (data.fixed_cost_monthly as number) ?? undefined,
    target_profit_monthly: (data.target_profit_monthly as number) ?? undefined,
    email_weekly_report: (data.email_weekly_report as boolean) ?? true,
    email_risk_alert: (data.email_risk_alert as boolean) ?? true,
    email_margin_alert: (data.email_margin_alert as boolean) ?? true,
    email_pro_expiry: (data.email_pro_expiry as boolean) ?? true,
  }
}

export async function getProfile(userId: string, email: string): Promise<User> {
  try {
    const data = await profilesDal.getProfileById(userId)
    if (data) return mapProfileRow(data as Record<string, unknown>)

    // Profile yok — upsert ile oluştur
    const upserted = await profilesDal.upsertProfile(userId, email)
    if (upserted) return mapProfileRow(upserted as Record<string, unknown>)

    return { id: userId, email, plan: 'free', email_notifications_enabled: true }
  } catch (err) {
    console.error('getProfile error:', err)
    return { id: userId, email, plan: 'free', email_notifications_enabled: true }
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<User>
): Promise<{ success: boolean; error?: string }> {
  const safeUpdates: Record<string, unknown> = {}
  for (const key of ALL_ALLOWED_KEYS) {
    if (updates[key] !== undefined) safeUpdates[key] = updates[key]
  }

  try {
    await profilesDal.updateProfile(userId, safeUpdates)
    return { success: true }
  } catch (err: unknown) {
    const error = err as { code?: string; message?: string }
    // Column doesn't exist — retry with core keys only
    if (error.code === '42703' || error.message?.includes('column')) {
      const coreSafe: Record<string, unknown> = {}
      for (const key of CORE_KEYS) {
        if (updates[key] !== undefined) coreSafe[key] = updates[key]
      }
      if (Object.keys(coreSafe).length > 0) {
        try {
          await profilesDal.updateProfile(userId, coreSafe)
        } catch (retryErr: unknown) {
          return { success: false, error: (retryErr as Error).message }
        }
      }
      return {
        success: false,
        error: 'Tercih sütunları henüz veritabanında oluşturulmamış. Lütfen Supabase SQL Editor\'da migration sorgusunu çalıştırın.',
      }
    }
    return { success: false, error: (err as Error).message }
  }
}

export async function updateEmailPreferences(
  userId: string,
  prefs: Partial<Pick<User, 'email_weekly_report' | 'email_risk_alert' | 'email_margin_alert' | 'email_pro_expiry' | 'email_notifications_enabled'>>
): Promise<{ success: boolean; error?: string }> {
  return updateProfile(userId, prefs)
}
