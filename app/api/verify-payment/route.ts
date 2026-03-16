import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const token = searchParams.get('token');
        const paymentId = searchParams.get('paymentId'); // fallback legacy support

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
            return NextResponse.json({ success: false, error: 'Sunucu yapılandırma hatası' }, { status: 500 });
        }

        // ── Token-based verification (new secure flow) ──────────────────────
        if (token) {
            // 1. Authenticate the user making the request
            const cookieStore = cookies();
            const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll(cookiesToSet) {
                        try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { }
                    },
                },
            });

            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return NextResponse.json({ success: false, error: 'Giriş yapmalısınız' }, { status: 401 });
            }

            const admin = createClient(supabaseUrl, serviceKey);

            // 2. Find payment session by token
            const { data: payment, error: paymentErr } = await admin
                .from('payments')
                .select('id, user_id, plan, status, token_expires_at')
                .eq('token', token)
                .single();

            if (paymentErr || !payment) {
                console.warn('[verify-payment] Token bulunamadı:', token?.slice(0, 8) + '...');
                return NextResponse.json({ success: false, error: 'Geçersiz token' }, { status: 400 });
            }

            // 3. Verify token belongs to the logged-in user
            if (payment.user_id !== user.id) {
                console.warn('[verify-payment] Token kullanıcı uyuşmazlığı. payment.user_id:', payment.user_id, 'auth user:', user.id);
                return NextResponse.json({ success: false, error: 'Bu token size ait değil' }, { status: 403 });
            }

            // 4. Check if already activated (idempotent — return success)
            if (payment.status === 'paid') {
                return NextResponse.json({ success: true });
            }

            // 5. Verify token has not expired (15-minute window)
            if (payment.token_expires_at) {
                const expiresAt = new Date(payment.token_expires_at).getTime();
                if (Date.now() > expiresAt) {
                    await admin.from('payments').update({ status: 'expired' }).eq('id', payment.id);
                    console.warn('[verify-payment] Token süresi dolmuş:', payment.id);
                    return NextResponse.json({ success: false, error: 'Oturum süresi doldu. Lütfen tekrar ödeme yapın.' }, { status: 410 });
                }
            }

            // 6. Verify session is in an activatable state
            if (payment.status !== 'created' && payment.status !== 'pending') {
                return NextResponse.json({ success: false, error: `Ödeme durumu geçersiz: ${payment.status}` }, { status: 400 });
            }

            // ── Activate Pro ────────────────────────────────────────────────
            const planType = payment.plan || 'pro_monthly';
            const daysToAdd = planType === 'pro_yearly' ? 365 : 30;
            const proUntil = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
            const now = new Date().toISOString();

            const { error: paymentUpdateErr } = await admin
                .from('payments')
                .update({ status: 'paid', paid_at: now })
                .eq('id', payment.id);

            if (paymentUpdateErr) {
                console.error('[verify-payment] payments güncelleme hatası:', JSON.stringify(paymentUpdateErr));
                return NextResponse.json({ success: false, error: 'Ödeme kaydı güncellenemedi' }, { status: 500 });
            }

            const { error: profileErr } = await admin
                .from('profiles')
                .update({
                    plan: 'pro',
                    is_pro: true,
                    plan_type: planType,
                    pro_until: proUntil,
                    pro_started_at: now,
                    pro_expires_at: proUntil,
                    pro_renewal: false,
                })
                .eq('id', payment.user_id);

            if (profileErr) {
                console.error('[verify-payment] profiles güncelleme hatası:', JSON.stringify(profileErr));
                return NextResponse.json({ success: false, error: 'Profil güncellenemedi' }, { status: 500 });
            }

            console.log('[verify-payment] ✅ Token ile Pro aktif edildi. user:', user.id, 'plan:', planType, 'until:', proUntil);
            return NextResponse.json({ success: true });
        }

        // ── Legacy fallback: paymentId-based check (read-only, no activation) ──
        if (paymentId) {
            const admin = createClient(supabaseUrl, serviceKey);
            const { data: payment } = await admin
                .from('payments')
                .select('status')
                .eq('id', paymentId)
                .single();

            if (payment?.status === 'paid') {
                return NextResponse.json({ success: true });
            }
            return NextResponse.json({ success: false });
        }

        return NextResponse.json({ success: false, error: 'token veya paymentId gerekli' }, { status: 400 });

    } catch (error: any) {
        console.error('[verify-payment] Hata:', error?.message || error);
        return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
    }
}
