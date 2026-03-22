import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';

async function getSupabaseAdmin() {
    const { supabaseAdmin } = await import('@/lib/supabase-server-client');
    return supabaseAdmin;
}

export async function GET(request: NextRequest) {
    // Authorization check
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = await getSupabaseAdmin();
    const now = new Date();
    const results = { warned7: 0, warned1: 0, expired: 0, errors: [] as string[] };

    try {
        // 1. Pro bitiş tarihi 7 gün sonra olanlar
        const in7Days = new Date(now);
        in7Days.setDate(in7Days.getDate() + 7);
        const day7Start = in7Days.toISOString().split('T')[0] + 'T00:00:00.000Z';
        const day7End = in7Days.toISOString().split('T')[0] + 'T23:59:59.999Z';

        const { data: users7 } = await supabaseAdmin
            .from('profiles')
            .select('id, email, name, pro_expires_at')
            .eq('is_pro', true)
            .gte('pro_expires_at', day7Start)
            .lte('pro_expires_at', day7End);

        if (users7) {
            for (const user of users7) {
                try {
                    const expiresDate = new Date(user.pro_expires_at).toLocaleDateString('tr-TR');
                    await emailService.sendProExpiryWarning(
                        { email: user.email, name: user.name, id: user.id },
                        { daysLeft: 7, expiresAt: expiresDate }
                    );
                    results.warned7++;
                } catch (err: any) {
                    results.errors.push(`7-day warning failed for ${user.email}: ${err.message}`);
                }
            }
        }

        // 2. Pro bitiş tarihi 1 gün sonra olanlar
        const in1Day = new Date(now);
        in1Day.setDate(in1Day.getDate() + 1);
        const day1Start = in1Day.toISOString().split('T')[0] + 'T00:00:00.000Z';
        const day1End = in1Day.toISOString().split('T')[0] + 'T23:59:59.999Z';

        const { data: users1 } = await supabaseAdmin
            .from('profiles')
            .select('id, email, name, pro_expires_at')
            .eq('is_pro', true)
            .gte('pro_expires_at', day1Start)
            .lte('pro_expires_at', day1End);

        if (users1) {
            for (const user of users1) {
                try {
                    const expiresDate = new Date(user.pro_expires_at).toLocaleDateString('tr-TR');
                    await emailService.sendProExpiryWarning(
                        { email: user.email, name: user.name, id: user.id },
                        { daysLeft: 1, expiresAt: expiresDate }
                    );
                    results.warned1++;
                } catch (err: any) {
                    results.errors.push(`1-day warning failed for ${user.email}: ${err.message}`);
                }
            }
        }

        // 3. Pro bitiş tarihi geçmiş olanlar (hâlâ is_pro = true)
        const { data: expiredUsers } = await supabaseAdmin
            .from('profiles')
            .select('id, email, name, pro_expires_at')
            .eq('is_pro', true)
            .lt('pro_expires_at', now.toISOString());

        if (expiredUsers) {
            for (const user of expiredUsers) {
                try {
                    // is_pro = false yap
                    await supabaseAdmin
                        .from('profiles')
                        .update({
                            is_pro: false,
                            plan: 'free',
                        })
                        .eq('id', user.id);

                    await emailService.sendProExpired(
                        { email: user.email, name: user.name, id: user.id }
                    );
                    results.expired++;
                } catch (err: any) {
                    results.errors.push(`Expiry processing failed for ${user.email}: ${err.message}`);
                }
            }
        }

        console.log(`[Cron] check-expiry completed:`, results);
        return NextResponse.json({
            success: true,
            ...results,
        });

    } catch (err: any) {
        console.error('[Cron] check-expiry error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
