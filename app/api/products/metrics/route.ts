import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId') ?? undefined
    const periodMonth = searchParams.get('periodMonth') ?? undefined

    return callGatewayV1Format('product', 'getSalesMetrics', {
      productId,
      periodMonth,
    }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
