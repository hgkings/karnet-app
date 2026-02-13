import { ProductInput, CalculationResult, RiskResult, RiskLevel, RiskFactor } from '@/types';

export function calculateRisk(input: ProductInput, result: CalculationResult): RiskResult {
  const factors: RiskFactor[] = [];
  let totalScore = 100;

  const marginPenalty = getMarginPenalty(result.margin_pct);
  if (marginPenalty > 0) {
    factors.push({
      name: 'Düşük Kar Marjı',
      impact: marginPenalty,
      description: `Kar marjı %${result.margin_pct.toFixed(1)} — ${result.margin_pct < 5 ? 'Tehlikeli düşük' : result.margin_pct < 15 ? 'Riskli seviye' : 'Dikkat gerekli'}`,
    });
    totalScore -= marginPenalty;
  }

  const returnPenalty = getReturnPenalty(input.return_rate_pct);
  if (returnPenalty > 0) {
    factors.push({
      name: 'Yüksek İade Oranı',
      impact: returnPenalty,
      description: `İade oranı %${input.return_rate_pct} — ${input.return_rate_pct > 15 ? 'Çok yüksek' : input.return_rate_pct > 10 ? 'Yüksek' : 'Orta seviye'}`,
    });
    totalScore -= returnPenalty;
  }

  const adCostRatio = input.sale_price > 0 ? (input.ad_cost_per_sale / input.sale_price) * 100 : 0;
  const adPenalty = getAdCostPenalty(adCostRatio);
  if (adPenalty > 0) {
    factors.push({
      name: 'Yüksek Reklam Maliyeti',
      impact: adPenalty,
      description: `Reklam/satış oranı %${adCostRatio.toFixed(1)} — ${adCostRatio > 20 ? 'Çok yüksek' : adCostRatio > 10 ? 'Yüksek' : 'Dikkat'}`,
    });
    totalScore -= adPenalty;
  }

  const commissionPenalty = getCommissionPenalty(input.commission_pct);
  if (commissionPenalty > 0) {
    factors.push({
      name: 'Yüksek Komisyon',
      impact: commissionPenalty,
      description: `Komisyon oranı %${input.commission_pct} — ${input.commission_pct > 25 ? 'Çok yüksek' : 'Dikkat gerekli'}`,
    });
    totalScore -= commissionPenalty;
  }

  const cashflowPenalty = getCashflowPenalty(input.payout_delay_days);
  if (cashflowPenalty > 0) {
    factors.push({
      name: 'Nakit Akışı Riski',
      impact: cashflowPenalty,
      description: `Ödeme gecikmesi ${input.payout_delay_days} gün — ${input.payout_delay_days > 21 ? 'Yüksek risk' : 'Orta risk'}`,
    });
    totalScore -= cashflowPenalty;
  }

  if (result.unit_net_profit < 0) {
    factors.push({
      name: 'Zarar Durumu',
      impact: 30,
      description: 'Birim başına zarar ediyorsunuz!',
    });
    totalScore -= 30;
  }

  const score = Math.max(0, Math.min(100, totalScore));

  return {
    score,
    level: getLevel(score),
    factors,
  };
}

function getMarginPenalty(margin: number): number {
  if (margin < 0) return 35;
  if (margin < 5) return 25;
  if (margin < 10) return 15;
  if (margin < 15) return 10;
  if (margin < 20) return 5;
  return 0;
}

function getReturnPenalty(rate: number): number {
  if (rate > 20) return 20;
  if (rate > 15) return 15;
  if (rate > 10) return 10;
  if (rate > 5) return 5;
  return 0;
}

function getAdCostPenalty(ratio: number): number {
  if (ratio > 25) return 20;
  if (ratio > 15) return 15;
  if (ratio > 10) return 10;
  if (ratio > 5) return 5;
  return 0;
}

function getCommissionPenalty(pct: number): number {
  if (pct > 30) return 15;
  if (pct > 25) return 10;
  if (pct > 20) return 5;
  return 0;
}

function getCashflowPenalty(days: number): number {
  if (days > 28) return 15;
  if (days > 21) return 10;
  if (days > 14) return 5;
  return 0;
}

function getLevel(score: number): RiskLevel {
  if (score >= 80) return 'safe';
  if (score >= 60) return 'moderate';
  if (score >= 40) return 'risky';
  return 'dangerous';
}

export const riskLevelConfig: Record<RiskLevel, { label: string; color: string; bgColor: string; textColor: string }> = {
  safe: { label: 'Güvenli', color: '#10b981', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', textColor: 'text-emerald-700 dark:text-emerald-400' },
  moderate: { label: 'Orta Risk', color: '#f59e0b', bgColor: 'bg-amber-100 dark:bg-amber-900/30', textColor: 'text-amber-700 dark:text-amber-400' },
  risky: { label: 'Riskli', color: '#f97316', bgColor: 'bg-orange-100 dark:bg-orange-900/30', textColor: 'text-orange-700 dark:text-orange-400' },
  dangerous: { label: 'Tehlikeli', color: '#ef4444', bgColor: 'bg-red-100 dark:bg-red-900/30', textColor: 'text-red-700 dark:text-red-400' },
};
