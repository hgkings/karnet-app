import { sendEmail as smtpSendEmail } from './smtp';

// Lazy Supabase admin — only import when actually needed
async function getSupabaseAdmin() {
    const { supabaseAdmin } = await import('../supabase-server-client');
    return supabaseAdmin;
}

const MAIL_REPLY_TO = () => process.env.MAIL_REPLY_TO || 'karnet.destek@gmail.com';

export interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
    tags?: { name: string; value: string }[];
    templateName: string;
    userId?: string;
}

export const emailService = {
    async sendEmail({ to, subject, html, text, templateName, userId }: SendEmailOptions) {

        if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
            const errorMsg = 'BREVO_SMTP_USER veya BREVO_SMTP_KEY eksik. E-posta gönderilemez.';
            console.error(errorMsg);
            await this.logEmailAttempt(userId, to, templateName, subject, 'failed', null, errorMsg);
            throw new Error(errorMsg);
        }

        try {
            const result = await smtpSendEmail({
                to,
                subject,
                html,
                text,
                replyTo: MAIL_REPLY_TO(),
            });

            if (!result.success) {
                const errorMsg = String(result.error) || 'SMTP gönderim hatası';
                console.error(`[SMTP Error] Failed to send email to ${to}:`, result.error);
                await this.logEmailAttempt(userId, to, templateName, subject, 'failed', null, errorMsg);
                throw new Error(`SMTP Error: ${errorMsg}`);
            }

            console.log(`[Email Sent] Successfully sent ${templateName} to ${to} (ID: ${result.messageId})`);
            await this.logEmailAttempt(userId, to, templateName, subject, 'sent', result.messageId || null, null);
            return { success: true, provider_message_id: result.messageId };

        } catch (err: any) {
            console.error(`[Email Service Exception] Failed to send email to ${to}:`, err);
            await this.logEmailAttempt(userId, to, templateName, subject, 'failed', null, err.message);
            throw err;
        }
    },

    async logEmailAttempt(
        userId: string | undefined,
        toEmail: string,
        template: string,
        subject: string,
        status: 'sent' | 'failed',
        providerId: string | null | undefined,
        errorMsg: string | null
    ) {
        try {
            const supabaseAdmin = await getSupabaseAdmin();
            const { error } = await supabaseAdmin
                .from('email_logs')
                .insert({
                    user_id: userId || null,
                    to_email: toEmail,
                    template: template,
                    subject: subject,
                    status: status,
                    provider: 'brevo',
                    provider_message_id: providerId || null,
                    error: errorMsg
                });

            if (error) console.error('[DB Log Error] Failed to insert email_log:', error);
        } catch (dbErr) {
            console.error('[DB Log Exception] Failed to write to email_logs:', dbErr);
        }
    }
};
