import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server-client'
import { createSupabaseAdminClient } from '@/lib/supabase-admin-client'

type VerifyAdminResult =
  | { authorized: false; response: NextResponse }
  | { authorized: true; userId: string; adminClient: ReturnType<typeof createSupabaseAdminClient> }

/**
 * Her admin API route'unun başında çağır.
 * 1. Oturum kontrolü — session cookie ile
 * 2. Plan kontrolü — service_role client ile (RLS bypass)
 */
export async function verifyAdmin(): Promise<VerifyAdminResult> {
  const supabase = createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      ),
    }
  }

  const adminClient = createSupabaseAdminClient()
  const { data: profile } = await adminClient
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  if (profile?.plan !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Yetkiniz yok' },
        { status: 403 }
      ),
    }
  }

  return { authorized: true, userId: user.id, adminClient }
}
