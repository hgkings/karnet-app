import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    const { action, ...params } = await request.json()
    const method = action === 'approve' ? 'approveTrendyolClaim' : action === 'reject' ? 'rejectTrendyolClaim' : null
    if (!method) return Response.json({ success: false, error: 'Gecersiz aksiyon' }, { status: 400 })

    return callGatewayWithSuccess('marketplace' as ServiceName, method, { connectionId, ...params }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
