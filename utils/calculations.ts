import { ProductInput, CalculationResult } from '@/types';

export function calculateProfit(input: ProductInput): CalculationResult {
  const {
    sale_price,
    product_cost,
    commission_pct,
    shipping_cost,
    packaging_cost,
    ad_cost_per_sale,
    return_rate_pct,
    vat_pct,
    other_cost,
    monthly_sales_volume,
  } = input;

  const commission = sale_price * (commission_pct / 100);
  const vat = sale_price * (vat_pct / 100);
  const expected_return_loss = (return_rate_pct / 100) * sale_price;

  const unit_total_cost =
    product_cost +
    shipping_cost +
    packaging_cost +
    ad_cost_per_sale +
    other_cost +
    commission +
    vat +
    expected_return_loss;

  const unit_net_profit = sale_price - unit_total_cost;
  const margin_pct = sale_price > 0 ? (unit_net_profit / sale_price) * 100 : 0;
  const monthly_net_profit = unit_net_profit * monthly_sales_volume;
  const monthly_revenue = sale_price * monthly_sales_volume;
  const monthly_total_cost = unit_total_cost * monthly_sales_volume;
  const breakeven_price = calculateBreakevenPrice(input);
  const estimated_tax_after_profit = monthly_net_profit > 0 ? monthly_net_profit * 0.8 : 0;

  return {
    commission,
    vat,
    expected_return_loss,
    unit_total_cost,
    unit_net_profit,
    margin_pct,
    monthly_net_profit,
    monthly_revenue,
    monthly_total_cost,
    breakeven_price,
    estimated_tax_after_profit,
  };
}

function calculateBreakevenPrice(input: ProductInput): number {
  const {
    product_cost,
    shipping_cost,
    packaging_cost,
    ad_cost_per_sale,
    other_cost,
    commission_pct,
    vat_pct,
    return_rate_pct,
  } = input;

  const fixed_per_unit = product_cost + shipping_cost + packaging_cost + ad_cost_per_sale + other_cost;
  const variable_rate = (commission_pct + vat_pct + return_rate_pct) / 100;

  if (variable_rate >= 1) return Infinity;

  return fixed_per_unit / (1 - variable_rate);
}

export function calculateWithOverrides(
  base: ProductInput,
  overrides: Partial<ProductInput>
): CalculationResult {
  return calculateProfit({ ...base, ...overrides });
}

export function generateSensitivityAnalysis(input: ProductInput) {
  const original = calculateProfit(input);

  const scenarios: { scenario: string; overrides: Partial<ProductInput> }[] = [
    { scenario: 'Fiyat +5%', overrides: { sale_price: input.sale_price * 1.05 } },
    { scenario: 'Fiyat +10%', overrides: { sale_price: input.sale_price * 1.10 } },
    { scenario: 'Fiyat -5%', overrides: { sale_price: input.sale_price * 0.95 } },
    { scenario: 'Fiyat -10%', overrides: { sale_price: input.sale_price * 0.90 } },
    { scenario: 'Komisyon +2%', overrides: { commission_pct: input.commission_pct + 2 } },
    { scenario: 'Komisyon -2%', overrides: { commission_pct: Math.max(0, input.commission_pct - 2) } },
    { scenario: 'Reklam maliyeti +5₺', overrides: { ad_cost_per_sale: input.ad_cost_per_sale + 5 } },
    { scenario: 'Reklam maliyeti +10₺', overrides: { ad_cost_per_sale: input.ad_cost_per_sale + 10 } },
    { scenario: 'İade oranı 2x', overrides: { return_rate_pct: Math.min(100, input.return_rate_pct * 2) } },
    { scenario: 'Satış hacmi +20%', overrides: { monthly_sales_volume: Math.round(input.monthly_sales_volume * 1.2) } },
  ];

  return scenarios.map(({ scenario, overrides }) => {
    const result = calculateWithOverrides(input, overrides);
    const diff = result.monthly_net_profit - original.monthly_net_profit;
    return {
      scenario,
      originalProfit: original.monthly_net_profit,
      newProfit: result.monthly_net_profit,
      difference: diff,
      percentChange: original.monthly_net_profit !== 0
        ? (diff / Math.abs(original.monthly_net_profit)) * 100
        : 0,
    };
  });
}

export function calculateCashflow(input: ProductInput) {
  const unitCost = input.product_cost + input.shipping_cost + input.packaging_cost + input.other_cost;
  const monthlyOutflow = unitCost * input.monthly_sales_volume;
  const dailyOutflow = monthlyOutflow / 30;
  const workingCapitalNeeded = dailyOutflow * input.payout_delay_days;
  const result = calculateProfit(input);
  const monthlyInflow = result.monthly_revenue - result.commission - result.vat;
  const monthlyCashGap = monthlyOutflow - (monthlyInflow * (30 - input.payout_delay_days) / 30);

  return {
    workingCapitalNeeded: Math.max(0, workingCapitalNeeded),
    monthlyCashGap: Math.max(0, monthlyCashGap),
    dailyCashBurn: dailyOutflow,
  };
}
