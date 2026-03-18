import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20
  const offset = (page - 1) * limit

  try {
    let query = auth.adminClient
      .from('payments')
      .select('id, user_id, plan, amount_try, status, provider, provider_order_id, paid_at, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) query = query.eq('status', status)

    const { data: payments, count, error } = await query
    if (error) throw error

    // Email'leri ayrı sorguda çek (FK join yerine — daha güvenilir)
    const userIds = Array.from(new Set((payments ?? []).map(p => p.user_id)))
    let emailMap: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await auth.adminClient
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      emailMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.email]))
    }

    const result = (payments ?? []).map(p => ({
      ...p,
      profiles: { email: emailMap[p.user_id] ?? null },
    }))

    return NextResponse.json({ payments: result, total: count ?? 0, page, limit })
  } catch (error) {
    console.error('Admin payments error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
