import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const body = await request.json()

    return callGatewayV1Format('product', 'bulkMatch', body, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
