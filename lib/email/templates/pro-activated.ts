import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getProActivatedTemplate(planType: string, expiresAt: string) {
    const planLabel = planType === 'pro_yearly' ? 'Yıllık' : 'Aylık';
    const title = '🎉 Kârnet Pro Aktif!';
    const content = `
        <p>Pro planınız başarıyla aktifleştirildi.</p>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 16px; margin: 20px 0; border-radius: 8px;">
            <p style="margin: 0 0 4px 0; font-weight: 600;">Plan: ${planLabel}</p>
            <p style="margin: 0; color: #6b7280;">Bitiş tarihi: ${expiresAt}</p>
        </div>
        <p>Artık şu özelliklere erişebilirsiniz:</p>
        <ul style="padding-left: 20px; line-height: 2;">
            <li>✓ Sınırsız analiz</li>
            <li>✓ PDF rapor</li>
            <li>✓ Gelişmiş simülatörler</li>
            <li>✓ Tüm pazaryerleri</li>
        </ul>
    `;

    return {
        subject: '🎉 Kârnet Pro Aktif!',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Panele Git',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Kârnet Pro planınız (${planLabel}) aktifleştirildi. Bitiş: ${expiresAt}. Sınırsız analiz, PDF rapor, gelişmiş simülatörler ve tüm pazaryerlerine erişebilirsiniz.`,
    };
}
