import { baseEmailTemplate } from './base';

export function getEmailVerifyTemplate(verificationUrl: string) {
    const title = 'E-posta adresinizi doğrulayın';
    const content = `
        <p>Hesabınızı aktifleştirmek için aşağıdaki butona tıklayın.</p>
        <p style="font-size: 14px; color: #6b7280;">Bu linkin geçerlilik süresi <strong>24 saat</strong>tir.</p>
    `;

    return {
        subject: 'E-posta adresinizi doğrulayın',
        html: baseEmailTemplate({
            title,
            content,
            buttonText: 'E-postamı Doğrula',
            buttonUrl: verificationUrl,
        }),
        text: `Hesabınızı aktifleştirmek için şu linke tıklayın: ${verificationUrl} (24 saat geçerli)`,
    };
}
