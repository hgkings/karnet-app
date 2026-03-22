import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getWelcomeTemplate(userName: string) {
    const title = 'Kârnet\'e Hoş Geldiniz! 🎉';
    const content = `
        <p>Merhaba ${userName || 'Kullanıcı'},</p>
        <p>Hesabınız başarıyla oluşturuldu. Kârnet ile e-ticaret ürünlerinizin kârlılık analizini kolayca yapabilirsiniz.</p>
        <p>Ücretsiz planınızda <strong>5 analiz hakkınız</strong> bulunuyor. Hemen ilk analizinizi yaparak ürünlerinizin gerçek kâr marjını öğrenin!</p>
    `;

    return {
        subject: 'Kârnet\'e Hoş Geldiniz! 🎉',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'İlk Analizinizi Yapın',
            buttonUrl: `${APP_URL}/dashboard`,
        }),
        text: `Merhaba ${userName || 'Kullanıcı'}, Kârnet'e hoş geldiniz! Hesabınız başarıyla oluşturuldu. Ücretsiz planınızda 5 analiz hakkınız bulunuyor.`,
    };
}
