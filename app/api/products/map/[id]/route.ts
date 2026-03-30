import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import { type NextRequest } from 'next/server'
import { ManualMatchSchema } from '@/lib/validators/schemas/product.schema'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const { id: mapId } = await params
    const body = await request.json()

    const parsed = ManualMatchSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    return callGatewayV1Format('product', 'manualMatch', {
      mapId,
      internalProductId: parsed.data.internalProductId,
    }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const { id: mapId } = await params

    return callGatewayV1Format('product', 'deleteProductMap', { mapId }, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
