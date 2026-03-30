import { NextRequest } from 'next/server'
import { requireAdmin, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import { AdminReplySchema } from '@/lib/validators/schemas/support.schema'
import { z } from 'zod'

const AdminTicketPatchSchema = z.object({
  id: z.string().uuid('Geçerli bir ticket ID gerekli'),
}).merge(AdminReplySchema.partial())

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof Response) return auth

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') ?? undefined

    return callGatewayV1Format('support', 'listAllTickets', { status }, auth.id)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdmin()
    if (auth instanceof Response) return auth

    const body = await req.json()

    const parsed = AdminTicketPatchSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    const { id, status, admin_reply } = parsed.data

    return callGatewayV1Format('support', 'replyToTicket', {
      ticketId: id,
      status,
      admin_reply,
    }, auth.id)
  } catch (error) {
    return errorResponse(error)
  }
}
