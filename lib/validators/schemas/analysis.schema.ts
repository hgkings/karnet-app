import { z } from 'zod'

export const AnalysisInputSchema = z.object({
  productName: z.string().trim().min(1, 'Ürün adı zorunludur').max(300),
  marketplace: z.enum(['trendyol', 'hepsiburada', 'n11', 'amazon_tr', 'custom']),
  category: z.string().trim().max(200).optional(),
  salePrice: z.number().positive('Satış fiyatı 0\'dan büyük olmalıdır').finite().max(1_000_000),
  productCost: z.number().min(0).finite().max(1_000_000),
  shippingCost: z.number().min(0).finite().max(100_000),
  packagingCost: z.number().min(0).finite().max(100_000),
  adCostPerSale: z.number().min(0).finite().max(100_000),
  otherCost: z.number().min(0).finite().max(100_000),
  commissionPct: z.number().min(0).max(100).finite(),
  returnRatePct: z.number().min(0).max(100).finite(),
  vatPct: z.number().min(0).max(100).finite(),
  monthlySalesVolume: z.number().int().min(0).max(10_000_000),
  payoutDelayDays: z.number().int().min(0).max(365),
  serviceFeeAmount: z.number().min(0).finite().max(100_000),
  n11ExtraPct: z.number().min(0).max(100).finite(),
}).strict()

export const AnalysisUpdateSchema = AnalysisInputSchema.partial()

export const RequiredPricePayloadSchema = z.object({
  input: AnalysisInputSchema,
  targetMarginRate: z.number().optional(),
  targetProfitPerUnit: z.number().optional(),
})

export const AnalysisDefaultsSchema = z.object({
  marketplace: z.enum(['trendyol', 'hepsiburada', 'n11', 'amazon_tr', 'custom']),
  category: z.string().trim().max(200).optional(),
}).strict()