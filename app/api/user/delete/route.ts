import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'

export async function DELETE() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    return callGatewayV1Format('user', 'deleteAccount', {}, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
