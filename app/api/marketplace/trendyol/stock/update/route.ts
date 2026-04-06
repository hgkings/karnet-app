import { requireAuth, callGatewayWithSuccess, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import type { ServiceName } from '@/lib/gateway/types'

export const dynamic = 'force-dynamic'

/**
 * POST /api/marketplace/trendyol/stock/update
 * Trendyol'da stok ve fiyat güncelleme
 * Body: { items: [{ barcode, quantity?, salePrice?, listPrice? }] }
 */
export async function POST(request: Request) {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ success: false, error: 'Guncellenecek urun listesi bos.' }, { status: 400 })
    }

    return callGatewayWithSuccess('marketplace' as ServiceName, 'updateTrendyolStockPrice', {
      connectionId,
      items,
    }, user.id)
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
