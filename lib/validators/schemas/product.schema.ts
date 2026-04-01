// ----------------------------------------------------------------
// Product Schemas — Katman 2
// Urun eslestirme ve sorgulama validasyonu.
// ----------------------------------------------------------------

import { z } from 'zod'

export const ManualMatchSchema = z.object({
  internalProductId: z.string().uuid('Geçerli bir ürün ID\'si gerekli').nullable(),
})

export const BulkMatchSchema = z.object({
  matches: z.array(
    z.object({
      mapId: z.string().uuid('Geçerli bir eşleştirme ID\'si gerekli'),
      internalProductId: z.string().uuid('Geçerli bir ürün ID\'si gerekli').nullable(),
    }).strict()
  ).min(1, 'En az bir eşleştirme gerekli').max(500),
}).strict()

export const ProductSyncSchema = z.object({
  connectionId: z.string().uuid('Geçerli bir bağlantı ID\'si gerekli'),
})

export const ProductMapQuerySchema = z.object({
  marketplace: z.enum(['trendyol', 'hepsiburada']).optional(),
})
