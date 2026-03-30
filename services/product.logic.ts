// ----------------------------------------------------------------
// ProductLogic — Katman 6
// Urun eslestirme yonetimi ve satis metrikleri.
// ----------------------------------------------------------------

import { ServiceError } from '@/lib/gateway/types'
import type { AnalysisRepository } from '@/repositories/analysis.repository'
import type { ProductRepository } from '@/repositories/product.repository'
import type { ProductMarketplaceMapRow } from '@/lib/db/types'

export class ProductLogic {
  constructor(
    private readonly analysisRepo: AnalysisRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  /**
   * Kullanicinin tum urunlerini (analizlerini) pazaryeri eslestirme bilgisiyle doner.
   */
  async listProducts(
    _traceId: string,
    payload: unknown,
    userId: string
  ): Promise<unknown> {
    const { marketplace } = (payload ?? {}) as { marketplace?: string }

    const [analyses, mapRows] = await Promise.all([
      this.analysisRepo.findByUserId(userId),
      this.productRepo.getMapByUserId(userId, marketplace),
    ])

    // Eslestirme haritasini analiz ID'sine gore indexle
    const mapByInternalId = new Map<string, ProductMarketplaceMapRow[]>()
    for (const row of mapRows) {
      if (row.internal_product_id) {
        const existing = mapByInternalId.get(row.internal_product_id) ?? []
        existing.push(row)
        mapByInternalId.set(row.internal_product_id, existing)
      }
    }

    return analyses.map(a => ({
      ...a,
      marketplace_maps: mapByInternalId.get(a.id) ?? [],
    }))
  }

  /**
   * Pazaryeri urun eslestirme haritasini doner.
   */
  async getProductMap(
    _traceId: string,
    payload: unknown,
    userId: string
  ): Promise<ProductMarketplaceMapRow[]> {
    const { marketplace } = (payload ?? {}) as { marketplace?: string }
    return this.productRepo.getMapByUserId(userId, marketplace)
  }

  /**
   * Eslestirilememis (internal_product_id = null) urunleri doner.
   */
  async getUnmatchedProducts(
    _traceId: string,
    _payload: unknown,
    userId: string
  ): Promise<ProductMarketplaceMapRow[]> {
    const allMaps = await this.productRepo.getMapByUserId(userId)
    return allMaps.filter(m => !m.internal_product_id)
  }

  /**
   * Tek bir pazaryeri urununu manuel olarak bir analize eslestirir.
   */
  async manualMatch(
    traceId: string,
    payload: unknown,
    userId: string
  ): Promise<ProductMarketplaceMapRow> {
    const { mapId, internalProductId } = payload as {
      mapId: string
      internalProductId: string | null
    }

    // Eslestirme kaydinin bu kullaniciya ait oldugunu dogrula
    const existing = await this.productRepo.getMapById(userId, mapId)
    if (!existing) {
      throw new ServiceError('Eşleştirme kaydı bulunamadı', {
        code: 'MAP_NOT_FOUND',
        statusCode: 404,
        traceId,
      })
    }

    // Hedef analiz varsa kullaniciya ait mi kontrol et
    if (internalProductId) {
      const analysis = await this.analysisRepo.findByIdAndUserId(internalProductId, userId)
      if (!analysis) {
        throw new ServiceError('Hedef ürün bulunamadı', {
          code: 'ANALYSIS_NOT_FOUND',
          statusCode: 404,
          traceId,
        })
      }
    }

    return this.productRepo.updateMap(userId, mapId, {
      internal_product_id: internalProductId,
      match_confidence: internalProductId ? 'high' : 'manual_required',
      updated_at: new Date().toISOString(),
    })
  }

  /**
   * Birden fazla pazaryeri urununu toplu olarak eslestirir.
   */
  async bulkMatch(
    traceId: string,
    payload: unknown,
    userId: string
  ): Promise<{ matched: number }> {
    const { matches } = payload as {
      matches: Array<{ mapId: string; internalProductId: string | null }>
    }

    let matched = 0
    for (const { mapId, internalProductId } of matches) {
      await this.manualMatch(traceId, { mapId, internalProductId }, userId)
      matched++
    }

    return { matched }
  }

  /**
   * Urun satis metriklerini doner.
   */
  async getSalesMetrics(
    _traceId: string,
    payload: unknown,
    userId: string
  ): Promise<unknown> {
    const { productId, periodMonth } = (payload ?? {}) as {
      productId?: string
      periodMonth?: string
    }
    return this.productRepo.getSalesMetrics(userId, productId, periodMonth)
  }

  /**
   * Pazaryeri urun eslestirme kaydini siler.
   */
  async deleteProductMap(
    traceId: string,
    payload: unknown,
    userId: string
  ): Promise<{ success: boolean }> {
    const { mapId } = payload as { mapId: string }

    const existing = await this.productRepo.getMapById(userId, mapId)
    if (!existing) {
      throw new ServiceError('Eşleştirme kaydı bulunamadı', {
        code: 'MAP_NOT_FOUND',
        statusCode: 404,
        traceId,
      })
    }

    await this.productRepo.deleteMap(userId, mapId)
    return { success: true }
  }
}
