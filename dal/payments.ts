import { createAdminClient } from '@/lib/supabase-server-client'

export async function getPayments(options: {
  status?: string
  limit: number
  offset: number
}) {
  const supabase = createAdminClient()

  let query = supabase
    .from('payments')
    .select('id, user_id, plan, amount_try, status, provider, provider_order_id, paid_at, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(options.offset, options.offset + options.limit - 1)

  if (options.status) query = query.eq('status', options.status)

  const { data, count, error } = await query
  if (error) throw error

  return { data: data ?? [], count: count ?? 0 }
}
