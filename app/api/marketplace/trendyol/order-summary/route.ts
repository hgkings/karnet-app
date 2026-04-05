import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

/**
 * GET /api/marketplace/trendyol/order-summary
 * Dashboard sipariş özeti — bugün, kargolanan, bekleyen, iptal/iade
 */
export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    return callGatewayWithSuccess('marketplace' as ServiceName, 'getOrderSummary', { connectionId }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
