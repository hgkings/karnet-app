import { createAdminClient } from '@/lib/supabase-server-client'

export async function getProductsByUserId(userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('product_marketplace_map')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getProductById(id: string, userId: string) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('product_marketplace_map')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createProduct(row: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('product_marketplace_map')
    .insert(row)
    .select('*')
    .single()

  if (error) throw error
  return data
}

export async function updateProduct(id: string, updates: Record<string, unknown>) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('product_marketplace_map')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

export async function deleteProduct(id: string, userId: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('product_marketplace_map')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}
