import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getRiskAlertTemplate(productName: string, riskLevel: string, riskScore: number) {
    const title = `Risk Uyarısı: ${productName}`;
    const content = `
        <p><strong>${productName}</strong> ürününüz için risk seviyesi değişti.</p>
        <p>Yeni risk seviyesi: <strong>${riskLevel}</strong> (Skor: ${riskScore}/100)</p>
        <p>Ürün detaylarını inceleyerek gerekli aksiyonları alabilirsiniz.</p>
    `;

    return {
        subject: `Risk Uyarısı: ${productName} — ${riskLevel}`,
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Ürünü İncele',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `${productName} ürününüz risk seviyesi: ${riskLevel} (${riskScore}/100). İnceleyin: ${APP_URL}/dashboard`,
    };
}
