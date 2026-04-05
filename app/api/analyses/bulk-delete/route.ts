import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const { ids } = await request.json()
    return callGatewayV1Format('analysis' as ServiceName, 'bulkDelete', { ids }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
