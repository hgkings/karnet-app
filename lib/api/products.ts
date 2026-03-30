// ----------------------------------------------------------------
// Product API Helpers — Katman 1 (UI-safe)
// Sadece fetch() kullanir. DB/Service/Repository import YASAK.
// ----------------------------------------------------------------

export interface ProductMapRow {
  id: string
  user_id: string
  marketplace: string
  external_product_id: string
  merchant_sku: string | null
  barcode: string | null
  external_title: string
  internal_product_id: string | null
  match_confidence: string
  connection_id: string | null
  created_at: string
  updated_at: string
}

export interface SalesMetricRow {
  id: string
  user_id: string
  internal_product_id: string
  marketplace: string
  period_month: string
  sold_qty: number
  returned_qty: number
  gross_revenue: number
  net_revenue: number
  created_at: string
  updated_at: string
}

/**
 * Pazaryeri urun eslestirme haritasini getirir.
 */
export async function getProductMap(marketplace?: string): Promise<ProductMapRow[]> {
  const params = marketplace ? `?marketplace=${marketplace}` : ''
  const res = await fetch(`/api/products/map${params}`)
  if (!res.ok) throw new Error('Ürün haritası yüklenemedi')
  const data = await res.json()
  return Array.isArray(data) ? data : (data.data ?? [])
}

/**
 * Eslestirilememis pazaryeri urunlerini getirir.
 */
export async function getUnmatchedProducts(): Promise<ProductMapRow[]> {
  const res = await fetch('/api/products/map/unmatched')
  if (!res.ok) throw new Error('Eşleştirilmemiş ürünler yüklenemedi')
  const data = await res.json()
  return Array.isArray(data) ? data : (data.data ?? [])
}

/**
 * Tek bir pazaryeri urununu bir analize eslestirir.
 */
export async function manualMatchProduct(
  mapId: string,
  internalProductId: string | null
): Promise<ProductMapRow> {
  const res = await fetch(`/api/products/map/${mapId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ internalProductId }),
  })
  if (!res.ok) throw new Error('Ürün eşleştirme başarısız')
  return res.json()
}

/**
 * Birden fazla pazaryeri urununu toplu olarak eslestirir.
 */
export async function bulkMatchProducts(
  matches: Array<{ mapId: string; internalProductId: string | null }>
): Promise<{ matched: number }> {
  const res = await fetch('/api/products/map/bulk-match', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ matches }),
  })
  if (!res.ok) throw new Error('Toplu eşleştirme başarısız')
  return res.json()
}

/**
 * Urun satis metriklerini getirir.
 */
export async function getProductMetrics(
  productId?: string,
  periodMonth?: string
): Promise<SalesMetricRow[]> {
  const params = new URLSearchParams()
  if (productId) params.set('productId', productId)
  if (periodMonth) params.set('periodMonth', periodMonth)
  const qs = params.toString()
  const res = await fetch(`/api/products/metrics${qs ? `?${qs}` : ''}`)
  if (!res.ok) throw new Error('Satış metrikleri yüklenemedi')
  const data = await res.json()
  return Array.isArray(data) ? data : (data.data ?? [])
}

/**
 * Pazaryeri urun eslestirme kaydini siler.
 */
export async function deleteProductMap(mapId: string): Promise<{ success: boolean }> {
  const res = await fetch(`/api/products/map/${mapId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Ürün eşleştirme silinemedi')
  return res.json()
}
