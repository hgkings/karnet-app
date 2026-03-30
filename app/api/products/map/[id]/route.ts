import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import { type NextRequest } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const { id: mapId } = await params
    const body = await request.json()

    return callGatewayV1Format('product', 'manualMatch', {
      mapId,
      internalProductId: body.internalProductId ?? null,
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
