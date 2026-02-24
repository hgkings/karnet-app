import { baseEmailTemplate } from './base';

export function getTestEmailTemplate(userEmail: string) {
    const title = 'E-posta Kurulum Testi Başarılı 🚀';
    const content = `
        <p>Merhaba,</p>
        <p>Kârnet e-posta bildirim sistemini (<strong>Resend via karnet.com</strong>) başarıyla test ettiniz.</p>
        <p>Bu e-posta, <strong>${userEmail}</strong> adresine gönderilmesi planlanan sistem mesajlarının hedeflenen kutuya ulaştığını doğrulamak için sistem tarafından otomatik olarak oluşturulmuştur.</p>
        <div style="background-color: #f3f4f6; padding: 16px; border-radius: 8px; margin: 24px 0;">
            <p style="margin: 0; font-family: monospace; font-size: 14px; color: #4b5563;">
                <strong>Durum:</strong> Başarılı<br/>
                <strong>Zaman:</strong> ${new Date().toLocaleString('tr-TR')}<br/>
                <strong>Sağlayıcı:</strong> Resend
            </p>
        </div>
        <p>Eğer haftalık özet veya zarar riski gibi bildirimleri açtıysanız, bundan sonraki bilgilendirmeleriniz bu adres üzerinden gerçekleştirilecektir.</p>
    `;

    return {
        subject: 'Kârnet: E-posta Testi Başarılı',
        html: baseEmailTemplate(title, content),
        text: `Kârnet E-posta Testi Başarılı\n\nSistem kurulumunuz başarıyla tamamlandı. Hedef E-posta: ${userEmail}\nZaman: ${new Date().toLocaleString('tr-TR')}`,
    };
}
