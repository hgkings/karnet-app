import { z } from 'zod'

export const ConnectMarketplaceSchema = z.object({
  marketplace: z.enum(['trendyol', 'hepsiburada']),
  apiKey: z.string().trim().min(1, 'API anahtarı zorunludur').max(500),
  apiSecret: z.string().trim().min(1, 'API secret zorunludur').max(500),
  sellerId: z.string().trim().min(1, 'Satıcı ID zorunludur').max(200),
  storeName: z.string().trim().max(200).optional(),
}).strict()

export const DisconnectMarketplaceSchema = z.object({
  connectionId: z.string().uuid(),
}).strict()
