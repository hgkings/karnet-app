import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/admin-auth'
import { replyToTicket, deleteTicket } from '@/lib/support-service'
import { UpdateTicketSchema } from '@/lib/validations/support'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    const body = await request.json()
    const parsed = UpdateTicketSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    const ticket = await replyToTicket(params.id, parsed.data)
    return NextResponse.json({ success: true, data: ticket }, { status: 200 })
  } catch {
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  try {
    await deleteTicket(params.id)
    return new NextResponse(null, { status: 204 })
  } catch {
    return NextResponse.json({ success: false, error: 'Bir hata oluştu' }, { status: 500 })
  }
}
