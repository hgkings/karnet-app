import { NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET() {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    const [
      { count: totalUsers },
      { count: proUsers },
      { count: totalAnalyses },
      { data: payments },
      { count: totalTickets },
      { count: openTickets },
      { data: recentUsers },
    ] = await Promise.all([
      auth.adminClient.from('profiles').select('*', { count: 'exact', head: true }),
      auth.adminClient.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
      auth.adminClient.from('analyses').select('*', { count: 'exact', head: true }),
      auth.adminClient.from('payments').select('amount_try, status').eq('status', 'paid'),
      auth.adminClient.from('tickets').select('*', { count: 'exact', head: true }),
      auth.adminClient.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'acik'),
      auth.adminClient.from('profiles').select('id, email, plan, created_at').order('created_at', { ascending: false }).limit(5),
    ])

    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount_try || 0), 0) ?? 0

    return NextResponse.json({
      totalUsers: totalUsers ?? 0,
      proUsers: proUsers ?? 0,
      freeUsers: (totalUsers ?? 0) - (proUsers ?? 0),
      totalAnalyses: totalAnalyses ?? 0,
      totalRevenue,
      totalTickets: totalTickets ?? 0,
      openTickets: openTickets ?? 0,
      recentUsers: recentUsers ?? [],
    })
  } catch (error) {
    console.error('Admin stats error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
