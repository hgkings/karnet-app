import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export async function GET(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const { searchParams } = new URL(request.url)
    const marketplace = searchParams.get('marketplace') ?? undefined

    return callGatewayV1Format('product', 'listProducts', { marketplace }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
