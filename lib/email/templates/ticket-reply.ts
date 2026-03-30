import { baseEmailTemplate } from './base';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

export function getTicketReplyTemplate(ticketSubject: string, adminReply: string) {
    const title = 'Destek Talebiniz Yanıtlandı';
    const content = `
        <p>Destek talebiniz yanıtlandı:</p>
        <p style="font-weight: 600; margin-bottom: 8px;">${ticketSubject}</p>
        <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; margin: 12px 0; color: #333;">
            ${adminReply}
        </div>
        <p>Ek sorularınız varsa destek sayfasından yeni bir talep oluşturabilirsiniz.</p>
    `;

    return {
        subject: `Destek Yanıtı: ${ticketSubject}`,
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Destek Sayfası',
            buttonUrl: `${APP_URL}/support`,
        }),
        text: `Destek talebiniz "${ticketSubject}" yanıtlandı: ${adminReply}`,
    };
}
