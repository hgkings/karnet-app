import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server-client'
import * as profileService from '@/services/profile.service'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user }, error: authErr } = await supabase.auth.getUser()

    if (authErr || !user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const profile = await profileService.getProfile(user.id, user.email ?? '')

    return NextResponse.json({
      plan: profile.plan || 'free',
      plan_expires_at: profile.pro_expires_at || null,
      email: profile.email || user.email,
    })
  } catch (err: unknown) {
    console.error('[user/profile] Error:', (err as Error).message)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
