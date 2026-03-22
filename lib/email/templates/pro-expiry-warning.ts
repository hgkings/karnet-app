import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getProExpiryWarningTemplate(daysLeft: number, expiresAt: string) {
    const title = `Pro planınız ${daysLeft} gün içinde bitiyor`;
    const content = `
        <p>Pro planınız <strong>${expiresAt}</strong> tarihinde sona erecek.</p>
        <p>Yenileme yapmazsanız ücretsiz plana geçiş yapılacaktır.</p>
        <p>Pro avantajlarınızdan yararlanmaya devam etmek için planınızı yenileyin.</p>
    `;

    return {
        subject: `Pro planınız ${daysLeft} gün içinde bitiyor`,
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Planı Yenile',
            buttonUrl: `${APP_URL}/pricing`,
        }),
        text: `Pro planınız ${expiresAt} tarihinde sona erecek. Yenilemek için: ${APP_URL}/pricing`,
    };
}
