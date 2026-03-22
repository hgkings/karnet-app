/**
 * Base HTML wrapper for all Kârnet emails.
 * Ensures consistent branding, typography, and footer.
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.xn--krnet-3qa.com';

interface BaseTemplateOptions {
    title: string;
    content: string;
    buttonText?: string;
    buttonUrl?: string;
}

export function baseEmailTemplate(titleOrOptions: string | BaseTemplateOptions, contentArg?: string): string {
    let title: string;
    let content: string;
    let buttonText: string | undefined;
    let buttonUrl: string | undefined;

    if (typeof titleOrOptions === 'string') {
        title = titleOrOptions;
        content = contentArg || '';
    } else {
        title = titleOrOptions.title;
        content = titleOrOptions.content;
        buttonText = titleOrOptions.buttonText;
        buttonUrl = titleOrOptions.buttonUrl;
    }

    const buttonHtml = buttonText && buttonUrl
        ? `<div class="button-wrapper"><a href="${buttonUrl}" class="button">${buttonText}</a></div>`
        : '';

    return `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #374151; line-height: 1.6; }
            .container { max-width: 560px; margin: 0 auto; padding: 40px 20px; }
            .header { background-color: #0f172a; border-radius: 12px 12px 0 0; padding: 24px; text-align: center; }
            .header h2 { margin: 0; color: #ffffff; font-weight: 800; font-size: 22px; letter-spacing: -0.5px; }
            .card { background-color: #ffffff; border-radius: 0 0 12px 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .title { font-size: 20px; font-weight: 700; color: #111827; margin-top: 0; margin-bottom: 16px; }
            .content { font-size: 16px; color: #374151; margin-bottom: 24px; line-height: 1.6; }
            .button-wrapper { text-align: center; margin-top: 24px; margin-bottom: 16px; }
            .button { display: inline-block; background-color: #4f46e5; color: #ffffff !important; font-weight: 600; font-size: 16px; text-decoration: none; padding: 12px 24px; border-radius: 8px; }
            .footer { text-align: center; margin-top: 24px; font-size: 13px; color: #9ca3af; padding: 0 16px; }
            .footer a { color: #9ca3af; text-decoration: underline; }
            .divider { border-top: 1px solid #e5e7eb; margin: 24px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Kârnet</h2>
            </div>
            <div class="card">
                <h1 class="title">${title}</h1>
                <div class="content">
                    ${content}
                </div>
                ${buttonHtml}
            </div>
            <div class="footer">
                <p>&copy; 2026 Kârnet &middot; Konya, Türkiye</p>
                <p><a href="${APP_URL}/settings">Bildirimleri yönet</a></p>
            </div>
        </div>
    </body>
    </html>
    `;
}
