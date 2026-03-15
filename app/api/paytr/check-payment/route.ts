import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const paymentId = searchParams.get('paymentId');

        if (!paymentId) {
            return NextResponse.json({ error: 'paymentId gerekli' }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        const merchantId = process.env.PAYTR_MERCHANT_ID;
        const merchantKey = process.env.PAYTR_MERCHANT_KEY;
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

        if (!supabaseUrl || !serviceKey || !merchantId || !merchantKey || !merchantSalt) {
            return NextResponse.json({ error: 'Config eksik' }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, serviceKey);

        // Ödeme kaydını bul
        const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('id', paymentId)
            .single();

        if (!payment) {
            return NextResponse.json({ error: 'Ödeme bulunamadı' }, { status: 404 });
        }

        // Zaten ödenmiş mi?
        if (payment.status === 'paid') {
            return NextResponse.json({ isPro: true, source: 'db' });
        }

        const merchantOid = payment.provider_order_id;
        if (!merchantOid || merchantOid.startsWith('PENDING_')) {
            return NextResponse.json({ isPro: false });
        }

        // PayTR Transaction Query API
        const paytrToken = crypto
            .createHmac('sha256', merchantKey)
            .update(merchantId + merchantOid + merchantSalt)
            .digest('base64');

        const formParams = new URLSearchParams({
            merchant_id: merchantId,
            merchant_oid: merchantOid,
            paytr_token: paytrToken,
        });

        const queryRes = await fetch('https://www.paytr.com/odeme/durum-sorgu', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formParams.toString(),
        });

        const rawText = await queryRes.text();
        console.log('[PayTR Check] Durum sorgu yanıtı:', rawText);

        let queryData: any;
        try {
            queryData = JSON.parse(rawText);
        } catch {
            return NextResponse.json({ isPro: false, error: 'PayTR yanıtı parse edilemedi' });
        }

        console.log('[PayTR Check] payment_status:', queryData.payment_status, 'status:', queryData.status);

        if (queryData.status === 'success' && queryData.payment_status === 'success') {
            // Ödeme başarılı — pro aktif et
            const planType = payment.plan || 'pro_monthly';
            const daysToAdd = planType === 'pro_yearly' ? 365 : 30;
            const proUntil = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

            await supabase.from('payments').update({
                status: 'paid',
                paid_at: new Date().toISOString(),
            }).eq('id', payment.id);

            await supabase.from('profiles').update({
                plan: 'pro',
                is_pro: true,
                plan_type: planType,
                pro_until: proUntil,
                pro_started_at: new Date().toISOString(),
                pro_expires_at: proUntil,
                pro_renewal: false,
            }).eq('id', payment.user_id);

            console.log('[PayTR Check] ✅ Pro aktif edildi:', payment.user_id);
            return NextResponse.json({ isPro: true, source: 'paytr_query' });
        }

        return NextResponse.json({ isPro: false, paymentStatus: queryData.payment_status });

    } catch (error: any) {
        console.error('[PayTR Check] Hata:', error?.message || error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}
