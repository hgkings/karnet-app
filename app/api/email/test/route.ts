import { NextResponse } from 'next/server';
import { supabaseAdmin, createClient } from '@/lib/supabase-server-client';
import { emailService } from '@/lib/email/emailService';
import { getTestEmailTemplate } from '@/lib/email/templates';

// Force dynamic — this route uses cookies and env vars at runtime
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // 1. Env Checks (Critical)
        if (!process.env.RESEND_API_KEY) {
            return NextResponse.json({ error: 'RESEND_API_KEY bulunamadı. Sunucu yapılandırması eksik.' }, { status: 500 });
        }
        if (!process.env.MAIL_FROM) {
            return NextResponse.json({ error: 'MAIL_FROM bulunamadı. Lütfen e-posta gönderen adresini ayarlayın.' }, { status: 500 });
        }

        // 2. Auth Check: Use cookie-based client for App Router
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user || !user.email) {
            console.error('[Auth Error] User not found or session invalid:', authError);
            return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapın.' }, { status: 401 });
        }

        const { template } = await req.json();

        if (template !== 'test_email') {
            return NextResponse.json({ error: 'Geçersiz şablon türü.' }, { status: 400 });
        }

        // 3. Generate Template
        const { subject, html, text } = getTestEmailTemplate(user.email);

        // 4. Send Email
        const result = await emailService.sendEmail({
            to: user.email,
            subject,
            html,
            text,
            templateName: 'test_email',
            userId: user.id
        });

        return NextResponse.json({
            ok: true,
            message: 'Test e-postası başarıyla gönderildi.',
            provider_message_id: result.provider_message_id
        });

    } catch (error: any) {
        console.error('[POST /api/email/test] Error:', error);

        let errorMessage = 'E-posta gönderilirken bir hata oluştu.';

        if (error.message.includes('Resend Error')) {
            // Extract Resend specific error if possible
            errorMessage = `Resend Hatası: ${error.message}`;
        }

        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
