/**
 * Central Plan Configuration — Single Source of Truth
 *
 * Kârnet artık TAMAMEN ÜCRETSİZ. Tüm özellikler ve sınırsız kullanım
 * herkese açıktır. Tüm planlar aynı: tam erişim.
 *
 * ALL plan limits must be read from here.
 * Do NOT hardcode limit numbers anywhere else in the app.
 */

const FULL_ACCESS = {
    maxProducts: Infinity,
    maxMarketplaces: Infinity,
    csvExport: true,
    csvImport: true,
    jsonExport: true,
    proAccounting: true,
    sensitivityAnalysis: true,
    breakEven: true,
    cashflow: true,
    marketplaceComparison: true,
    apiIntegration: true,
    pdfReportMonthly: Infinity,
    weeklyEmailReport: true,
    prioritySupport: true,
    competitorTracking: true,
} as const;

export const PLAN_LIMITS = {
    free: FULL_ACCESS,
    starter: FULL_ACCESS,
    pro: FULL_ACCESS,
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;
export type PlanFeature = keyof typeof PLAN_LIMITS.free;

/**
 * Helper to get the limit for a given plan.
 * Kârnet ücretsiz olduğu için her plan tam erişim döndürür.
 */
export function getPlanLimits(_plan: string | undefined) {
    return FULL_ACCESS;
}
