import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

/**
 * Haftalık özet raporu
 */
export function getWeeklyReportTemplate(userName: string, stats: {
    analysisCount: number;
    topProduct?: { name: string; margin: number };
    riskProduct?: { name: string };
}) {
    const title = '📊 Haftalık Kârnet Raporunuz';
    const content = `
        <p>Merhaba ${userName || 'Kullanıcı'},</p>
        <p>Bu hafta <strong>${stats.analysisCount}</strong> ürün analiz ettiniz.</p>

        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Toplam Analiz</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${stats.analysisCount}</td>
            </tr>
            ${stats.topProduct ? `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">En Kârlı Ürün</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #10b981;">${stats.topProduct.name} (%${stats.topProduct.margin})</td>
            </tr>
            ` : ''}
            ${stats.riskProduct ? `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">En Riskli Ürün</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: #ef4444;">${stats.riskProduct.name}</td>
            </tr>
            ` : ''}
        </table>
    `;

    return {
        subject: '📊 Haftalık Kârnet Raporunuz',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Detayları Gör',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Haftalık Özet: Bu hafta ${stats.analysisCount} ürün analiz ettiniz.${stats.topProduct ? ` En kârlı: ${stats.topProduct.name} (%${stats.topProduct.margin})` : ''}${stats.riskProduct ? ` En riskli: ${stats.riskProduct.name}` : ''}`,
    };
}

/**
 * Zarar eden ürün tespiti
 */
export function getRiskAlertTemplate(productName: string, currentPrice: number, loss: number) {
    const title = '⚠️ Zarar Eden Ürün Tespit Edildi';
    const content = `
        <p><strong>${productName}</strong> ürününüzün zarar ettiğini tespit ettik.</p>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; margin: 20px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 8px 0; color: #6b7280;">Mevcut Fiyat: <strong>${currentPrice} ₺</strong></p>
            <p style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 700;">Zarar: ${loss} ₺</p>
        </div>
        <p>Lütfen fiyatlandırmanızı ve maliyetlerinizi kontrol edin.</p>
    `;

    return {
        subject: '⚠️ Zarar Eden Ürün Tespit Edildi',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Analizi İncele',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Uyarı: ${productName} ürününüz zarar ediyor. Mevcut fiyat: ${currentPrice} ₺, Zarar: ${loss} ₺`,
    };
}

/**
 * Hedef marj uyarısı
 */
export function getMarginAlertTemplate(productName: string, currentMargin: number, targetMargin: number) {
    const title = '📉 Hedef Marjınızın Altına Düştünüz';
    const content = `
        <p><strong>${productName}</strong> ürününüzün marjı hedef marjınızın altına düştü.</p>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Mevcut Marj:</strong> %${currentMargin}</p>
            <p style="margin: 0;"><strong>Hedef Marj:</strong> %${targetMargin}</p>
        </div>
        <p>Reklam giderlerini veya maliyetleri gözden geçirmenizi öneririz.</p>
    `;

    return {
        subject: '📉 Hedef Marjınızın Altına Düştünüz',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Analizi İncele',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Uyarı: ${productName} marjı (%${currentMargin}) hedef marjınızın (%${targetMargin}) altına düştü.`,
    };
}

// Backward compatibility exports
export const getWeeklySummaryTemplate = (userName: string, stats: any) =>
    getWeeklyReportTemplate(userName, {
        analysisCount: stats.totalProducts || 0,
        topProduct: undefined,
        riskProduct: undefined,
    });

export const getTargetMarginAlertTemplate = getMarginAlertTemplate;

export function getLossRiskAlertTemplate(productName: string, profit: number) {
    return getRiskAlertTemplate(productName, 0, Math.abs(profit));
}
