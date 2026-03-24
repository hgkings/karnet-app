import { createAdminClient } from '@/lib/supabase-server-client'

export async function getAnalysesByUserId(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getAnalysisById(id: string, userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createAnalysis(row: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('analyses')
    .upsert(row, { onConflict: 'id' })
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateAnalysis(id: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('analyses')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteAnalysis(id: string, userId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('analyses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

export async function getAnalysisCount(userId: string): Promise<number> {
  const supabase = createAdminClient()

  const { count, error } = await supabase
    .from('analyses')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if (error) throw error
  return count ?? 0
}

export async function getAnalysisStats(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('analyses')
    .select('outputs, risk_level, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function checkAnalysisExists(id: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { data } = await supabase
    .from('analyses')
    .select('id')
    .eq('id', id)
    .maybeSingle()

  return !!data
}
