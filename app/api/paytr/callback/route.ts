import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(req: Request) {
    console.log('[PayTR Callback] ========== REQUEST RECEIVED ==========');

    try {
        // PayTR sends callback as form-urlencoded
        const formData = await req.formData();
        const payload = Object.fromEntries(formData.entries());

        // Log ALL incoming fields
        console.log('[PayTR Callback] Incoming fields:');
        for (const [key, value] of Object.entries(payload)) {
            console.log(`  ${key}: ${value}`);
        }

        const merchant_oid = String(payload.merchant_oid || '');
        const status = String(payload.status || '');
        const total_amount = String(payload.total_amount || '');
        const hash = String(payload.hash || '');

        // ── 1. Hash Validation ──────────────────────────────────
        const merchantKey = process.env.PAYTR_MERCHANT_KEY;
        const merchantSalt = process.env.PAYTR_MERCHANT_SALT;

        if (!merchantKey || !merchantSalt) {
            console.error('[PayTR Callback] ❌ PAYTR_MERCHANT_KEY or PAYTR_MERCHANT_SALT env vars MISSING!');
            console.error('[PayTR Callback] merchantKey exists:', !!merchantKey);
            console.error('[PayTR Callback] merchantSalt exists:', !!merchantSalt);
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        console.log('[PayTR Callback] Env vars loaded. Validating hash...');

        // PayTR Link API: hash = base64(hmac_sha256(merchant_oid + merchant_salt + status + total_amount, merchant_key))
        const hashStr = merchant_oid + merchantSalt + status + total_amount;
        const expectedHash = crypto
            .createHmac('sha256', merchantKey)
            .update(hashStr)
            .digest('base64');

        if (hash !== expectedHash) {
            console.error('[PayTR Callback] ❌ HASH MISMATCH!');
            console.error('[PayTR Callback]   Received hash:', hash);
            console.error('[PayTR Callback]   Expected hash:', expectedHash);
            console.error('[PayTR Callback]   merchant_oid:', merchant_oid);
            console.error('[PayTR Callback]   status:', status);
            console.error('[PayTR Callback]   total_amount:', total_amount);
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        console.log('[PayTR Callback] ✅ Hash validated successfully');

        // ── 2. Status Check ─────────────────────────────────────
        if (status !== 'success') {
            console.log(`[PayTR Callback] ⚠️ Status is not success: "${status}". Skipping upgrade.`);
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        console.log('[PayTR Callback] ✅ Status is success. Proceeding with upgrade...');

        // ── 3. Supabase Connection ──────────────────────────────
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceKey) {
            console.error('[PayTR Callback] ❌ Supabase env vars missing!');
            console.error('[PayTR Callback]   SUPABASE_URL exists:', !!supabaseUrl);
            console.error('[PayTR Callback]   SERVICE_ROLE_KEY exists:', !!serviceKey);
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        const supabase = createClient(supabaseUrl, serviceKey);
        console.log('[PayTR Callback] Supabase client created with service role');

        // ── 4. Find Pending Payment ─────────────────────────────
        const { data: payment, error: fetchError } = await supabase
            .from('payments')
            .select('*')
            .eq('status', 'created')
            .eq('provider', 'paytr')
            .order('created_at', { ascending: true })
            .limit(1)
            .single();

        if (fetchError || !payment) {
            console.error('[PayTR Callback] ❌ No pending payment record found!');
            console.error('[PayTR Callback]   fetchError:', JSON.stringify(fetchError));
            console.error('[PayTR Callback]   merchant_oid:', merchant_oid);
            console.error('[PayTR Callback]   total_amount:', total_amount);
            console.log('[PayTR Callback] ⚠️ Payment successful at PayTR but no pending record in DB.');
            return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }

        console.log(`[PayTR Callback] ✅ Found pending payment: id=${payment.id}, user=${payment.user_id}, email=${payment.email}, plan=${payment.plan}`);

        // ── 5. Update Payment Record ────────────────────────────
        const { error: paymentUpdateErr } = await supabase
            .from('payments')
            .update({
                status: 'paid',
                paid_at: new Date().toISOString(),
                provider_order_id: merchant_oid,
                raw_payload: payload as any,
            })
            .eq('id', payment.id);

        if (paymentUpdateErr) {
            console.error('[PayTR Callback] ❌ Failed to update payment record:', JSON.stringify(paymentUpdateErr));
        } else {
            console.log('[PayTR Callback] ✅ Payment record updated to paid');
        }

        // ── 6. Upgrade User Profile ─────────────────────────────
        const plan = payment.plan; // 'pro_monthly' or 'pro_yearly'
        const daysToAdd = plan === 'pro_yearly' ? 365 : 30;
        const proUntil = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();

        const { error: profileUpdateErr } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                is_pro: true,
                plan_type: plan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly',
                pro_until: proUntil,
            })
            .eq('id', payment.user_id);

        if (profileUpdateErr) {
            console.error('[PayTR Callback] ❌ Failed to update profile:', JSON.stringify(profileUpdateErr));
            console.error('[PayTR Callback]   user_id:', payment.user_id);
        } else {
            console.log(`[PayTR Callback] ✅ SUCCESS! User ${payment.user_id} (${payment.email}) upgraded to Pro`);
            console.log(`[PayTR Callback]   is_pro: true`);
            console.log(`[PayTR Callback]   plan_type: ${plan === 'pro_yearly' ? 'pro_yearly' : 'pro_monthly'}`);
            console.log(`[PayTR Callback]   pro_until: ${proUntil}`);
        }

        console.log('[PayTR Callback] ========== DONE ==========');
        return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });

    } catch (error: any) {
        console.error('[PayTR Callback] ❌ EXCEPTION:', error?.message || error);
        console.error('[PayTR Callback] Stack:', error?.stack);
        return new NextResponse('OK', { status: 200, headers: { 'Content-Type': 'text/plain' } });
    }
}
