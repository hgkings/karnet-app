import { baseEmailTemplate } from './base';

export function getPasswordResetTemplate(resetUrl: string) {
    const title = 'Şifre Sıfırlama Talebi';
    const content = `
        <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın.</p>
        <p style="font-size: 14px; color: #6b7280;">Bu link <strong>1 saat</strong> geçerlidir.</p>
        <p style="font-size: 14px; color: #6b7280;">Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.</p>
    `;

    return {
        subject: 'Şifre Sıfırlama Talebi',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'Şifremi Sıfırla',
            buttonUrl: resetUrl,
        }),
        text: `Şifrenizi sıfırlamak için şu linke tıklayın: ${resetUrl} (1 saat geçerli). Bu talebi siz yapmadıysanız görmezden gelin.`,
    };
}
