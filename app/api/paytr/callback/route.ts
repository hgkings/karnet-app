import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
    try {
        // PayTR sends callback as form-urlencoded
        const formData = await req.formData();
        const payload = Object.fromEntries(formData.entries());

        // Log all incoming fields
        console.log('[PayTR Callback] === Incoming POST ===');
        for (const [key, value] of Object.entries(payload)) {
            console.log(`[PayTR Callback]   ${key}:`, value);
        }

        const {
            merchant_oid,
            status,
            total_amount,
            hash,
            callback_id,
        } = payload as Record<string, string>;

        // ── Hash Validation ──────────────────────────────────────
        const merchantKey = process.env.PAYTR_MERCHANT_KEY;
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

        if (!merchantKey || !merchantSalt) {
            console.error('[PayTR Callback] PAYTR_MERCHANT_KEY or PAYTR_MERCHANT_SALT env vars missing!');
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        // PayTR Link API hash: HMAC-SHA256(merchant_oid + merchant_salt + status + total_amount, merchant_key) → base64
        const hashStr = `${merchant_oid}${merchantSalt}${status}${total_amount}`;
        const expectedHash = crypto
            .createHmac('sha256', merchantKey)
            .update(hashStr)
            .digest('base64');

        if (hash !== expectedHash) {
            console.error('[PayTR Callback] ❌ Hash mismatch!', {
                received: hash,
                expected: expectedHash,
                merchant_oid,
            });
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        console.log('[PayTR Callback] ✅ Hash validated successfully');

        // ── Database Update ──────────────────────────────────────
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceKey) {
            console.error('[PayTR Callback] Supabase env vars missing!');
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const supabase = createClient(supabaseUrl, serviceKey);

        if (status === 'success') {
            // Find payment by provider_order_id (merchant_oid)
            const { data: payment, error: fetchError } = await supabase
                .from('payments')
                .select('*')
                .eq('provider_order_id', merchant_oid)
                .single();

            if (fetchError || !payment) {
                // Payment record may not exist for Link API (link is static, no pre-created record).
                // Log and still try to identify user from callback_id or skip.
                console.warn('[PayTR Callback] Payment record not found for merchant_oid:', merchant_oid);
                console.log('[PayTR Callback] callback_id:', callback_id);
                console.log('[PayTR Callback] Payment successful but no matching record. Manual check needed.');
                return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
            }

            if (payment.status === 'paid') {
                console.log('[PayTR Callback] Payment already marked as paid:', merchant_oid);
                return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
            }

            // Update payment record
            await supabase
                .from('payments')
                .update({
                    status: 'paid',
                    paid_at: new Date().toISOString(),
                    raw_payload: payload as any,
                })
                .eq('id', payment.id);

            // Upgrade user to Pro
            const plan = payment.plan; // 'pro_monthly' or 'pro_yearly'
            const daysToAdd = plan === 'pro_yearly' ? 365 : 30;
            const proUntil = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

            await supabase
                .from('profiles')
                .update({
                    plan: 'pro',
                    pro_until: proUntil,
                })
                .eq('id', payment.user_id);

            console.log(`[PayTR Callback] ✅ User ${payment.user_id} upgraded to Pro (${plan}) until ${proUntil}`);
        } else {
            console.log(`[PayTR Callback] ⚠️ Payment not successful. status=${status}, merchant_oid=${merchant_oid}`);

            // Update payment status to failed if record exists
            const { data: payment } = await supabase
                .from('payments')
                .select('id')
                .eq('provider_order_id', merchant_oid)
                .single();

            if (payment) {
                await supabase
                    .from('payments')
                    .update({ status: 'failed', raw_payload: payload as any })
                    .eq('id', payment.id);
            }
        }

        return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });

    } catch (error: any) {
        console.error('[PayTR Callback] Error:', error);
        return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
}
