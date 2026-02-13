export type Marketplace = 'trendyol' | 'hepsiburada' | 'n11' | 'amazon_tr' | 'custom';
export type PlanType = 'free' | 'pro';
export type RiskLevel = 'safe' | 'moderate' | 'risky' | 'dangerous';

export interface User {
  id: string;
  email: string;
  plan: PlanType;
}

export interface ProductInput {
  marketplace: Marketplace;
  product_name: string;
  monthly_sales_volume: number;
  product_cost: number;
  sale_price: number;
  commission_pct: number;
  shipping_cost: number;
  packaging_cost: number;
  ad_cost_per_sale: number;
  return_rate_pct: number;
  vat_pct: number;
  other_cost: number;
  payout_delay_days: number;
}

export interface CalculationResult {
  commission: number;
  vat: number;
  expected_return_loss: number;
  unit_total_cost: number;
  unit_net_profit: number;
  margin_pct: number;
  monthly_net_profit: number;
  monthly_revenue: number;
  monthly_total_cost: number;
  breakeven_price: number;
  estimated_tax_after_profit: number;
}

export interface RiskFactor {
  name: string;
  impact: number;
  description: string;
}

export interface RiskResult {
  score: number;
  level: RiskLevel;
  factors: RiskFactor[];
}

export interface Analysis {
  id: string;
  userId: string;
  input: ProductInput;
  result: CalculationResult;
  risk: RiskResult;
  createdAt: string;
}

export interface SensitivityRow {
  scenario: string;
  originalProfit: number;
  newProfit: number;
  difference: number;
  percentChange: number;
}

export interface CashflowResult {
  workingCapitalNeeded: number;
  monthlyCashGap: number;
  dailyCashBurn: number;
}

export interface MarketplaceDefaults {
  key: Marketplace;
  label: string;
  commission_pct: number;
  return_rate_pct: number;
}
