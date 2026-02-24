/**
 * Base HTML wrapper for all Kârnet emails.
 * Ensures consistent branding, typography, and footer.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://karnet.com';

export function baseEmailTemplate(title: string, content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; color: #111827; line-height: 1.5; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { height: 40px; }
            .card { background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e5e7eb; }
            .title { font-size: 24px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 16px; }
            .content { font-size: 16px; color: #374151; margin-bottom: 24px; }
            .button-wrapper { text-align: center; margin-top: 32px; margin-bottom: 16px; }
            .button { display: inline-block; background-color: #111827; color: #ffffff !important; font-weight: 500; font-size: 16px; text-decoration: none; padding: 12px 24px; border-radius: 8px; }
            .button:hover { background-color: #374151; }
            .footer { text-align: center; margin-top: 32px; font-size: 14px; color: #6b7280; }
            .footer a { color: #6b7280; text-decoration: underline; }
            .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <!-- Fallback to text if logo fails, but URL should be absolute -->
                <h2 style="margin: 0; color: #111827; font-weight: 800; tracking: -1px;">Kârnet</h2>
            </div>
            <div class="card">
                <h1 class="title">${title}</h1>
                <div class="content">
                    ${content}
                </div>
                
                <div class="button-wrapper">
                    <a href="${APP_URL}/dashboard" class="button">Panele Git</a>
                </div>
            </div>
            <div class="footer">
                <p>Bu e-postayı Kârnet bildirimleri kapsamında aldınız.</p>
                <p>&copy; ${new Date().getFullYear()} Kârnet. Tüm hakları saklıdır.</p>
                <p><a href="${APP_URL}/settings">Bildirim Ayarları</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
}
