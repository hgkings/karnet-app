
import { sendEmail } from '@/lib/email/smtp';

export async function sendNotificationEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    return sendEmail({ to, subject, html });
}
