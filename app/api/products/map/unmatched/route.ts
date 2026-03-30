import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    return callGatewayV1Format('product', 'getUnmatchedProducts', {}, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
