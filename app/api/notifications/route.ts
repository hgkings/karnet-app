import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'
import { z } from 'zod'

const NotificationSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur').max(200),
  message: z.string().min(1, 'Mesaj zorunludur').max(2000),
  type: z.enum(['info', 'success', 'warning', 'error']).default('info'),
})

const NotificationListSchema = z.array(NotificationSchema).min(1, 'En az bir bildirim gerekli')

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    return callGatewayV1Format('notification' as ServiceName, 'list', {}, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const body = await request.json()
    const raw = Array.isArray(body) ? body : [body]

    const parsed = NotificationListSchema.safeParse(raw)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    return callGatewayV1Format('notification' as ServiceName, 'create', { notifications: parsed.data }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
