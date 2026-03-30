import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import { BulkMatchSchema } from '@/lib/validators/schemas/product.schema'

export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const body = await request.json()

    const parsed = BulkMatchSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    return callGatewayV1Format('product', 'bulkMatch', parsed.data, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
