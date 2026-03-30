import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

interface WeeklyStats {
    totalProfit: number;
    avgMargin: number;
    totalProducts: number;
    riskyProducts: number;
    topProduct: string;
}

export function getWeeklyReportTemplate(stats: WeeklyStats) {
    const title = 'Haftalık Kârlılık Raporu';
    const formatCurrency = (v: number) => `₺${v.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`;
    const content = `
        <p>Bu haftaki portföy özetiniz:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Toplam Tahmini Kâr</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${formatCurrency(stats.totalProfit)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Ortalama Marj</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">%${stats.avgMargin.toFixed(1)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Toplam Ürün</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${stats.totalProducts}</td>
            </tr>
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px 0; color: #666;">Riskli Ürün</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600; color: ${stats.riskyProducts > 0 ? '#dc2626' : '#16a34a'};">${stats.riskyProducts}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #666;">En Kârlı Ürün</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 600;">${stats.topProduct || '—'}</td>
            </tr>
        </table>
    `;

    return {
        subject: `Haftalık Rapor — ${formatCurrency(stats.totalProfit)} tahmini kâr`,
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Dashboard\'a Git',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Haftalık rapor: ${formatCurrency(stats.totalProfit)} kâr, %${stats.avgMargin.toFixed(1)} marj, ${stats.totalProducts} ürün.`,
    };
}
