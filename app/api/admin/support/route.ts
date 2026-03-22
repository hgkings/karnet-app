import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') ?? ''

  try {
    let query = auth.adminClient
      .from('support_tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data: tickets, error } = await query
    if (error) throw error

    const userIds = Array.from(new Set((tickets ?? []).map((t: any) => t.user_id)))
    let emailMap: Record<string, string> = {}

    if (userIds.length > 0) {
      const { data: profiles } = await auth.adminClient
        .from('profiles')
        .select('id, email')
        .in('id', userIds)

      emailMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p.email]))
    }

    const result = (tickets ?? []).map((t: any) => ({
      ...t,
      profiles: { email: emailMap[t.user_id] ?? t.user_id },
    }))

    return NextResponse.json({ tickets: result })
  } catch (error) {
    console.error('Admin support error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    const { id, status, admin_note } = await req.json()
    if (!id) return NextResponse.json({ success: false, error: 'id zorunludur' }, { status: 400 })

    const updates: Record<string, unknown> = {}
    if (status !== undefined) updates.status = status
    if (admin_note !== undefined) updates.admin_note = admin_note

    const { error } = await auth.adminClient.from('support_tickets').update(updates).eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Admin support PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
