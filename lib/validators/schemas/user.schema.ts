import { z } from 'zod'

export const UpdateProfileSchema = z.object({
  full_name: z.string().trim().max(200).optional(),
  email: z.string().email().optional(),
  email_notifications_enabled: z.boolean().optional(),
  email_weekly_report: z.boolean().optional(),
  email_risk_alert: z.boolean().optional(),
  email_margin_alert: z.boolean().optional(),
  email_pro_expiry: z.boolean().optional(),
  target_margin: z.number().min(0).max(100).finite().optional(),
  margin_alert: z.boolean().optional(),
  default_marketplace: z.enum(['trendyol', 'hepsiburada', 'n11', 'amazon_tr', 'custom']).optional(),
  default_commission: z.number().min(0).max(100).finite().optional(),
  default_vat: z.number().min(0).max(100).finite().optional(),
  default_return_rate: z.number().min(0).max(100).finite().optional(),
  default_ads_cost: z.number().min(0).finite().max(1_000_000).optional(),
  fixed_cost_monthly: z.number().min(0).finite().max(10_000_000).optional(),
  target_profit_monthly: z.number().min(0).finite().max(10_000_000).optional(),
  monthly_profit_target: z.number().min(0).finite().max(10_000_000).optional(),
  plan: z.enum(['free', 'starter', 'pro', 'admin']).optional(),
}).strict()

export const AdminUpdateUserSchema = z.object({
  userId: z.string().uuid(),
  plan: z.enum(['free', 'starter', 'pro', 'admin']),
}).strict()
