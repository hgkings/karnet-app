import { requireAuth, resolveConnectionId, errorResponse } from '@/lib/api/helpers'
import { decrypt } from '@/lib/db/db.helper'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchProducts } from '@/lib/marketplace/trendyol.api'

export const dynamic = 'force-dynamic'

/**
 * GET /api/marketplace/trendyol/stock
 * Trendyol'dan güncel stok + fiyat + fotoğraf çeker — DB'ye yazmadan direkt döner.
 */
export async function GET() {
  try {
    const user = await requireAuth()
    if (user instanceof Response) return user

    const connectionId = await resolveConnectionId(user.id, 'trendyol')
    if (connectionId instanceof Response) return connectionId

    // Credentials çöz
    const admin = createAdminClient()
    const { data: secretRow } = await admin
      .from('marketplace_secrets')
      .select('encrypted_blob')
      .eq('connection_id', connectionId)
      .single()

    if (!secretRow?.encrypted_blob) {
      return Response.json({ success: false, error: 'Bağlantı bilgileri bulunamadı' }, { status: 404 })
    }

    const creds = JSON.parse(decrypt(secretRow.encrypted_blob)) as {
      apiKey: string; apiSecret: string; sellerId: string
    }

    // Trendyol'dan tüm ürünleri çek
    const products: Array<{
      id: string; title: string; barcode: string; stockCode: string;
      salePrice: number; listPrice: number; quantity: number;
      imageUrl: string | null; categoryName: string; brand: string;
      productUrl: string | null;
    }> = []

    let page = 0
    let totalPages = 1
    while (page < totalPages && page < 50) {
      const result = await fetchProducts(creds, page, 200, { approved: true })
      for (const p of result.content) {
        const images = (p.images as Array<{ url: string }>) ?? []
        products.push({
          id: String(p.id ?? ''),
          title: (p.title as string) ?? '',
          barcode: (p.barcode as string) ?? '',
          stockCode: (p.stockCode as string) ?? '',
          salePrice: (p.salePrice as number) ?? 0,
          listPrice: (p.listPrice as number) ?? 0,
          quantity: (p.quantity as number) ?? 0,
          imageUrl: images[0]?.url ?? null,
          categoryName: (p.categoryName as string) ?? '',
          brand: (p.brand as string) ?? '',
          productUrl: p.productUrl
            ? String(p.productUrl)
            : (p.productContentId ? `https://www.trendyol.com/-p-${p.productContentId}` : null),
        })
      }
      totalPages = result.totalPages
      page++
    }

    // Stok özeti
    const outOfStock = products.filter(p => p.quantity === 0).length
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 5).length
    const totalStock = products.reduce((sum, p) => sum + p.quantity, 0)

    return Response.json({
      success: true,
      totalProducts: products.length,
      totalStock,
      outOfStock,
      lowStock,
      products,
    })
  } catch (err: unknown) {
    return errorResponse(err)
  }
}
