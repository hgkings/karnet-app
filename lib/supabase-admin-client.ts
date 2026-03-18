import { createClient } from '@supabase/supabase-js'

/**
 * Service role key ile Supabase client oluşturur.
 * RLS'yi tamamen bypass eder — TÜM verilere erişir.
 * SADECE server-side API route'larında kullan, client component'te asla import etme.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL veya SUPABASE_SERVICE_ROLE_KEY eksik')
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
