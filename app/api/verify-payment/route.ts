import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json({ success: false, error: 'paymentId gerekli' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const merchantId = process.env.PAYTR_MERCHANT_ID;
        const merchantKey = process.env.PAYTR_MERCHANT_KEY;
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

        if (!supabaseUrl || !serviceKey || !merchantId || !merchantKey || !merchantSalt) {
            return NextResponse.json({ success: false, error: 'Sunucu yapılandırma hatası' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceKey);

        const { data: payment, error: paymentErr } = await supabase
            .from('payments')
            .select('id, status, plan, user_id, provider_order_id')
            .eq('id', paymentId)
            .single();

        if (paymentErr || !payment) {
            return NextResponse.json({ success: false, error: 'Ödeme bulunamadı' }, { status: 404 });
        }

        // Zaten ödenmiş
        if (payment.status === 'paid') {
            return NextResponse.json({ success: true });
        }

        const merchantOid = payment.provider_order_id;
        if (!merchantOid || merchantOid.startsWith('PENDING_')) {
            return NextResponse.json({ success: false });
        }

        // PayTR durum sorgula
        const paytrToken = crypto
            .createHmac('sha256', merchantKey)
            .update(merchantId + merchantOid + merchantSalt)
            .digest('base64');

        const queryRes = await fetch('https://www.paytr.com/odeme/durum-sorgu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                merchant_id: merchantId,
                merchant_oid: merchantOid,
                paytr_token: paytrToken,
            }).toString(),
        });

        const queryData = await queryRes.json().catch(() => null);
        console.log('[verify-payment] PayTR yanıt:', JSON.stringify(queryData));

        if (queryData?.status === 'success' && queryData?.payment_status === 'success') {
            const planType = payment.plan || 'pro_monthly';
            const daysToAdd = planType === 'pro_yearly' ? 365 : 30;
            const proUntil = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

            await supabase
                .from('payments')
                .update({ status: 'paid', paid_at: new Date().toISOString() })
                .eq('id', payment.id);

            const { error: profileErr } = await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    is_pro: true,
                    plan_type: planType,
                    pro_until: proUntil,
                    pro_started_at: new Date().toISOString(),
                    pro_expires_at: proUntil,
                    pro_renewal: false,
                })
                .eq('id', payment.user_id);

            if (profileErr) {
                console.error('[verify-payment] Profil güncelleme hatası:', JSON.stringify(profileErr));
                return NextResponse.json({ success: false, error: 'Profil güncellenemedi' }, { status: 500 });
            }

            console.log('[verify-payment] ✅ Pro aktif edildi:', payment.user_id);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false });

    } catch (error: any) {
        console.error('[verify-payment] Hata:', error?.message || error);
        return NextResponse.json({ success: false, error: 'Sunucu hatası' }, { status: 500 });
    }
}
