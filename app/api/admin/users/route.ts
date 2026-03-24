import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import * as profilesDal from '@/dal/profiles'

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') ?? ''
  const plan = searchParams.get('plan') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  try {
    const { data, count } = await profilesDal.searchProfiles({
      search: search || undefined,
      plan: plan || undefined,
      limit,
      offset,
    })

    return NextResponse.json({ users: data, total: count, page, limit })
  } catch (error) {
    console.error('Admin users error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    const { userId, plan, pro_until } = await req.json()
    if (!userId || !plan) {
      return NextResponse.json({ success: false, error: 'userId ve plan zorunludur' }, { status: 400 })
    }

    const updates: Record<string, unknown> = { plan }
    if (pro_until !== undefined) updates.pro_until = pro_until
    if (plan === 'pro' && !pro_until) {
      updates.pro_until = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      updates.pro_started_at = new Date().toISOString()
      updates.pro_expires_at = updates.pro_until
    }
    if (plan === 'free') {
      updates.pro_until = null
      updates.pro_expires_at = null
      updates.pro_started_at = null
    }

    await profilesDal.updateProfilePlan(userId, updates)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin users PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
