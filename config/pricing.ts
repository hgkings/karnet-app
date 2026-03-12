
export const PRICING = {
    proMonthly: 229,
    proMonthlyId: 'pro_monthly' as const,
    oldMonthly: 399,
    proYearly: 2290,
    proYearlyId: 'pro_yearly' as const,
    currency: "TRY",
    symbol: "₺",
    // PayTR Link ile Ödeme URLs
    paytrLinkMonthly: 'https://www.paytr.com/link/Haw8DWP',
    paytrLinkYearly: 'https://www.paytr.com/link/mJh6qJB',
};

export type PlanId = typeof PRICING.proMonthlyId | typeof PRICING.proYearlyId;

export function getPlanAmount(planId: PlanId): number {
    return planId === 'pro_monthly' ? PRICING.proMonthly : PRICING.proYearly;
}

export function getPlanDays(planId: PlanId): number {
    return planId === 'pro_monthly' ? 30 : 365;
}

export const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: PRICING.currency,
        maximumFractionDigits: 0,
    }).format(amount).replace('TRY', '').trim() + PRICING.symbol;
};

export const monthlyLabel = () => `${PRICING.proMonthly}${PRICING.symbol}/ay`;
export const yearlyLabel = () => `${PRICING.proYearly}${PRICING.symbol}/yıl`;
