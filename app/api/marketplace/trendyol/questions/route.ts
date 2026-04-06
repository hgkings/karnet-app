import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? 'WAITING_FOR_ANSWER'
    const page = parseInt(searchParams.get('page') ?? '0')

    return callGatewayWithSuccess('marketplace' as ServiceName, 'getTrendyolQuestions', { connectionId, status, page }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    const { questionId, answer } = await request.json()
    return callGatewayWithSuccess('marketplace' as ServiceName, 'answerTrendyolQuestion', { connectionId, questionId, answer }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
