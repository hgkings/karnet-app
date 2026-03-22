import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';

export async function POST(request: NextRequest) {
    try {
        const { userId, email } = await request.json();

        if (!email || !userId) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const name = email.split('@')[0];
        await emailService.sendWelcomeEmail({ email, name, id: userId });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('[Welcome Email API] Error:', err?.message);
        return NextResponse.json({ error: err?.message }, { status: 500 });
    }
}
