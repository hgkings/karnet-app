import { baseEmailTemplate } from './base';

/**
 * template for weekly summary
 */
export function getWeeklySummaryTemplate(userName: string, stats: any) {
    const title = 'Haftalık Kârnet Özetiniz 📊';
    const content = `
        <p>Merhaba ${userName || 'Kullanıcı'},</p>
        <p>Bu hafta Kârnet panelinizdeki ürünlerin genel durum özeti aşağıdadır:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Toplam Analiz Edilen Ürün</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right;">${stats.totalProducts || 0}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Ortalama Kâr Marjı</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: ${stats.avgMargin > 15 ? '#10b981' : '#f59e0b'}">%${stats.avgMargin || 0}</td>
            </tr>
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Riskli Ürün Sayısı</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-weight: 600; text-align: right; color: ${stats.riskyProducts > 0 ? '#ef4444' : '#10b981'}">${stats.riskyProducts || 0}</td>
            </tr>
        </table>
        
        <p>Daha detaylı analiz ve optimizasyon önerileri için panelinize giriş yapabilirsiniz.</p>
    `;

    return {
        subject: 'Kârnet Haftalık Özetiniz',
        html: baseEmailTemplate(title, content),
        text: `Haftalık Özet:\nToplam Ürün: ${stats.totalProducts}\nOrtalama Marj: %${stats.avgMargin}\nRiskli Ürünler: ${stats.riskyProducts}`
    };
}

/**
 * template for target margin alert
 */
export function getTargetMarginAlertTemplate(productName: string, currentMargin: number, targetMargin: number) {
    const title = '⚠️ Hedef Marj Uyarısı';
    const content = `
        <p>Dikkat,</p>
        <p><strong>${productName}</strong> adlı ürününüzün kâr marjı, belirlediğiniz hedef marjın altına düştü.</p>
        <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0; border-radius: 4px;">
            <p style="margin: 0 0 8px 0;"><strong>Mevcut Marj:</strong> %${currentMargin}</p>
            <p style="margin: 0;"><strong>Hedef Marj:</strong> %${targetMargin}</p>
        </div>
        <p>Reklam giderlerini veya maliyetleri gözden geçirmenizi öneririz.</p>
    `;

    return {
        subject: `Uyarı: ${productName} hedef marjın altında!`,
        html: baseEmailTemplate(title, content),
        text: `Uyarı: ${productName} adlı ürününüzün kâr marjı (%${currentMargin}), hedefiniz olan %${targetMargin}'in altına düştü.`
    };
}

/**
 * template for loss risk alert
 */
export function getLossRiskAlertTemplate(productName: string, profit: number) {
    const title = '🚨 Zarar Riski Alarmı';
    const content = `
        <p>Acil İnceleme Gerekiyor,</p>
        <p><strong>${productName}</strong> adlı ürününüz yapılan son hesaplamalara göre <strong>zarar etmektedir</strong>.</p>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 16px; margin: 24px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #ef4444; font-size: 20px; font-weight: 700;">Net Kâr: ${profit} ₺</p>
            <p style="margin: 4px 0 0 0; color: #991b1b; font-size: 14px;">Zararına satış tespit edildi!</p>
        </div>
        <p>Lütfen fiyatlandırmanızı, komisyon oranlarınızı veya maliyetlerinizi acilen kontrol edin.</p>
    `;

    return {
        subject: `ACİL: ${productName} ürününde zarar riski!`,
        html: baseEmailTemplate(title, content),
        text: `ACil Uyarı: ${productName} adlı ürününüz ${profit} TL ile zarar etmektedir. Lütfen panelinizi kontrol edin.`
    };
}
