import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    const body = await request.json()
    const { action, ...params } = body as { action: string; [key: string]: unknown }

    const methodMap: Record<string, string> = {
      updateStatus: 'updateOrderStatus',
      markUnsupplied: 'markOrderUnsupplied',
      splitPackage: 'splitOrderPackage',
      updateBoxInfo: 'updateOrderBoxInfo',
      changeCargo: 'changeOrderCargo',
      sendInvoice: 'sendTrendyolInvoiceLink',
    }

    const method = methodMap[action]
    if (!method) {
      return Response.json({ success: false, error: `Gecersiz aksiyon: ${action}` }, { status: 400 })
    }

    return callGatewayWithSuccess('marketplace' as ServiceName, method, { connectionId, ...params }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
