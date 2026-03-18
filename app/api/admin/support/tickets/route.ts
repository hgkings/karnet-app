import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { getAllTickets, getTicketStats } from '@/lib/support-service'
import { TicketFilterSchema } from '@/lib/validations/support'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    const { searchParams } = new URL(request.url)

    if (searchParams.get('stats') === '1') {
      const stats = await getTicketStats()
      return NextResponse.json({ success: true, data: stats }, { status: 200 })
    }

    const filterParsed = TicketFilterSchema.safeParse({
      status: searchParams.get('status') ?? undefined,
      priority: searchParams.get('priority') ?? undefined,
      category: searchParams.get('category') ?? undefined,
      search: searchParams.get('search') ?? undefined,
    })

    const filters = filterParsed.success ? filterParsed.data : {}
    const tickets = await getAllTickets(filters)
    return NextResponse.json({ success: true, data: tickets }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
