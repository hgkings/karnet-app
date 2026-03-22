import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getProExpiredTemplate() {
    const title = 'Pro planınız sona erdi';
    const content = `
        <p>Pro planınız bugün sona erdi.</p>
        <p>Verileriniz güvende, analizlerinize erişmeye devam edebilirsiniz.</p>
        <p>Tekrar Pro olmak ve sınırsız analiz, PDF rapor gibi avantajlardan yararlanmak için planınızı yenileyin.</p>
    `;

    return {
        subject: 'Pro planınız sona erdi',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Tekrar Pro Ol',
            buttonUrl: `${APP_URL}/pricing`,
        }),
        text: `Pro planınız bugün sona erdi. Verileriniz güvende. Tekrar Pro olmak için: ${APP_URL}/pricing`,
    };
}
