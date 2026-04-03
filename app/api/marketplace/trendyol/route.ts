import { requireAuth, callGatewayV1Format, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'
import { ConnectMarketplaceSchema } from '@/lib/validators/schemas/marketplace.schema'

export const dynamic = 'force-dynamic'

// ─── GET: Fetch connection status ───
export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    return callGatewayWithSuccess('marketplace' as ServiceName, 'getStatus', { marketplace: 'trendyol' }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}

// ─── POST: Save credentials (encrypt & store) ───
export async function POST(req: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const body = await req.json()

    const parsed = ConnectMarketplaceSchema.safeParse({ ...body, marketplace: 'trendyol' })
    if (!parsed.success) {
      return Response.json(
        { success: false, error: 'Doğrulama hatası', details: parsed.error.errors },
        { status: 422 }
      )
    }

    // Gateway'den gelen { connectionId, status } formatını UI'ın beklediği formata dönüştür
    const gatewayRes = await callGatewayV1Format('marketplace' as ServiceName, 'connect', parsed.data, user.id)
    const gatewayData = await gatewayRes.json() as Record<string, unknown>

    if (gatewayData.error) {
      return Response.json({
        success: false,
        error: (gatewayData.error as string) || 'Bağlantı oluşturulamadı',
        error_code: 'connection_upsert_failed',
      }, { status: 400 })
    }

    return Response.json({
      success: true,
      secrets_saved: true,
      connectionId: gatewayData.connectionId,
      status: gatewayData.status,
      message: gatewayData.message,
      storeName: gatewayData.storeName,
    })
  } catch (err: unknown) {
    return errorResponse(err)
  }
}

// ─── DELETE: Disconnect ───
export async function DELETE() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) {
      // Bağlantı bulunamazsa zaten disconnected
      return Response.json({ success: true })
    }

    return callGatewayWithSuccess('marketplace' as ServiceName, 'disconnect', { connectionId }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
