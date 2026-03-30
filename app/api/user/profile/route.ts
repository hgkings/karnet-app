import { requireAuth, callGatewayV1Format, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'
import { UpdateProfileSchema } from '@/lib/validators/schemas/user.schema'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    return callGatewayV1Format('user' as ServiceName, 'getProfile', {}, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user
    const body = await request.json()

    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    return callGatewayV1Format('user' as ServiceName, 'updateProfile', parsed.data, user.id)
  } catch (error) {
    return errorResponse(error)
  }
}
