import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ShopierResponse } from 'shopier';

export const dynamic = 'force-dynamic';

export async function GET() {
    return new Response('success', { status: 200 });
}

export async function POST(req: Request) {
    console.log('[Shopier Callback] POST hit');

    try {
        const fd = await req.formData();
        const body: Record<string, string> = {};
        fd.forEach((val, key) => { body[key] = val.toString(); });

        console.log('[Shopier Callback] Keys:', Object.keys(body));

        const apiSecret = process.env.SHOPIER_API_SECRET || '6f0a13e0a08fdb6e30355cf0694b41b3';

        // Use Shopier built-in verification
        const shopierResponse = ShopierResponse.fromPostData(body);

        if (!shopierResponse.hasValidSignature(apiSecret)) {
            console.error('[Shopier Callback] ❌ Invalid signature');
            return NextResponse.redirect(new URL('/payment/fail?reason=invalid_signature', req.url));
        }

        const isSuccess = shopierResponse.isSuccess();
        const orderId = shopierResponse.getPlatformOrderId(); // This is the paymentId we passed to Shopier
        const shopierPaymentId = shopierResponse.getPaymentId();

        console.log('[Shopier Callback] Valid signature', { isSuccess, orderId, shopierPaymentId });

        if (!isSuccess) {
            return NextResponse.redirect(new URL('/payment/fail?paymentId=' + orderId, req.url));
        }

        // Supabase SERVICE_ROLE
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        const supabase = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // orderId matches our DB payment id
        const { data: payment } = await supabase
            .from('payments')
            .select('*')
            .eq('id', orderId)
            .maybeSingle();

        if (payment) {
            const userId = payment.user_id;
            const plan = payment.plan;
            const now = new Date().toISOString();

            if (payment.status !== 'paid') {
                const { error: updErr } = await supabase
                    .from('payments')
                    .update({
                        status: 'paid',
                        paid_at: now,
                        provider_order_id: shopierPaymentId || orderId,
                        raw_payload: body,
                    })
                    .eq('id', payment.id);
                console.log('[Shopier Callback] Payment marked paid', { error: updErr?.message });
            }

            // Always upgrade profile
            const days = plan === 'pro_yearly' ? 365 : 30;
            const proUntil = new Date();
            proUntil.setDate(proUntil.getDate() + days);
            const proUntilISO = proUntil.toISOString();

            const { error: profErr } = await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    plan_expires_at: proUntilISO,
                    pro_until: proUntilISO,
                    updated_at: now,
                })
                .eq('id', userId);

            if (profErr) {
                console.log('[Shopier Callback] Update profile failed, retrying without pro_until...', profErr.message);
                await supabase
                    .from('profiles')
                    .update({ plan: 'pro', plan_expires_at: proUntilISO, updated_at: now })
                    .eq('id', userId);
            }

            console.log('[Shopier Callback] ✅ Profile upgraded successfully for user:', userId);
        } else {
            console.error('[Shopier Callback] ❌ Payment not found in DB for id:', orderId);
        }

        // Return a redirect to the client's browser
        return NextResponse.redirect(new URL(`/payment/success?paymentId=${orderId}`, req.url));

    } catch (err: any) {
        console.error('[Shopier Callback] error', err?.message || err);
        return NextResponse.redirect(new URL('/payment/fail?reason=server_error', req.url));
    }
}
