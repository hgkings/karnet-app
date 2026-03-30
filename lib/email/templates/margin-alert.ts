import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getMarginAlertTemplate(productName: string, marginPct: number, threshold: number) {
    const title = `Marj Uyarısı: ${productName}`;
    const content = `
        <p><strong>${productName}</strong> ürününüzün kâr marjı belirlediğiniz eşiğin altına düştü.</p>
        <p>Mevcut marj: <strong>%${marginPct.toFixed(1)}</strong> (Eşik: %${threshold})</p>
        <p>Fiyat veya maliyet ayarlamalarınızı gözden geçirmenizi öneriyoruz.</p>
    `;

    return {
        subject: `Marj Uyarısı: ${productName} — %${marginPct.toFixed(1)}`,
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Ürünü İncele',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `${productName} marjı %${marginPct.toFixed(1)} — eşik %${threshold}. İnceleyin: ${APP_URL}/dashboard`,
    };
}
