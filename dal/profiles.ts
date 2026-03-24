import { createAdminClient } from '@/lib/supabase-server-client'

const PROFILE_SELECT_FULL = 'id, email, plan, pro_until, pro_expires_at, pro_renewal, pro_started_at, email_notifications_enabled, target_margin, margin_alert, default_marketplace, default_commission, default_vat, monthly_profit_target, default_return_rate, default_ads_cost, fixed_cost_monthly, target_profit_monthly, email_weekly_report, email_risk_alert, email_margin_alert, email_pro_expiry'
const PROFILE_SELECT_CORE = 'id, email, plan, pro_until, pro_expires_at, pro_renewal, pro_started_at, email_notifications_enabled'

export async function getProfileById(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select(PROFILE_SELECT_FULL)
    .eq('id', userId)
    .maybeSingle()

  // Fallback: preference columns may not exist yet
  if (error && error.code === '42703') {
    const fallback = await supabase
      .from('profiles')
      .select(PROFILE_SELECT_CORE)
      .eq('id', userId)
      .maybeSingle()

    if (fallback.error) throw fallback.error
    return fallback.data
  }

  if (error) throw error
  return data
}

export async function upsertProfile(userId: string, email: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      { id: userId, email, plan: 'free', email_notifications_enabled: true },
      { onConflict: 'id' }
    )
    .select(PROFILE_SELECT_FULL)
    .single()

  // Fallback if preference columns don't exist
  if (error && error.code === '42703') {
    const fb = await supabase
      .from('profiles')
      .upsert(
        { id: userId, email, plan: 'free', email_notifications_enabled: true },
        { onConflict: 'id' }
      )
      .select(PROFILE_SELECT_CORE)
      .single()

    if (fb.error) throw fb.error
    return fb.data
  }

  if (error) throw error
  return data
}

export async function updateProfile(userId: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function updateProfilePlan(userId: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)

  if (error) throw error
}

export async function getProfilesByIds(userIds: string[]) {
  if (userIds.length === 0) return []

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('id, email')
    .in('id', userIds)

  if (error) throw error
  return data ?? []
}

export async function searchProfiles(options: {
  search?: string
  plan?: string
  limit: number
  offset: number
}) {
  const supabase = createAdminClient()

  let query = supabase
    .from('profiles')
    .select('id, email, plan, pro_until, pro_expires_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(options.offset, options.offset + options.limit - 1)

  if (options.search) {
    const sanitized = options.search.replace(/[%_\\]/g, '\\$&').substring(0, 100)
    query = query.ilike('email', `%${sanitized}%`)
  }
  if (options.plan) query = query.eq('plan', options.plan)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], count: count ?? 0 }
}
