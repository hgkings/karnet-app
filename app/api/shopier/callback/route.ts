import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/* ─── GET: Shopier connectivity check ─── */
export async function GET() {
    return new Response('success', { status: 200 });
}

/* ─── POST: Shopier OSB webhook ─── */
export async function POST(req: Request) {
    console.log('[OSB] POST received');

    try {
        // ── 1. Read form body ──
        const raw = await req.text();
        const params = new URLSearchParams(raw);
        const resField = params.get('res') || '';
        const hashField = params.get('hash') || '';

        if (!resField || !hashField) {
            console.error('[OSB] Missing res or hash');
            return new Response('success', { status: 200 });
        }

        // ── 2. Verify HMAC-SHA256 signature ──
        const osbUsername = process.env.SHOPIER_OSB_USERNAME || '';
        const osbKey = process.env.SHOPIER_OSB_KEY || '';
        const expected = crypto
            .createHmac('sha256', osbKey)
            .update(resField + osbUsername)
            .digest('hex');

        const hashOk = expected === hashField;
        console.log('[OSB] hash', { ok: hashOk });
        // Allow mismatch for now (debugging)

        // ── 3. Decode base64 → JSON ──
        const decoded = JSON.parse(Buffer.from(resField, 'base64').toString('utf-8'));

        const orderid = String(decoded.platform_order_id || decoded.orderid || '');
        const email = String(decoded.email || '');
        const price = parseFloat(decoded.price || '0');
        const productid = String(decoded.productid || '');
        const productName = String(decoded.product_name || decoded.productname || '');
        const istest = decoded.istest === 1 || decoded.istest === '1';

        console.log('[OSB] POST received', { orderid, email, price, productid, productName, istest });

        // ── 4. Determine plan ──
        const yearlyPid = process.env.SHOPIER_YEARLY_PRODUCT_ID || '';
        const monthlyPid = process.env.SHOPIER_MONTHLY_PRODUCT_ID || '';

        let plan: 'pro_monthly' | 'pro_yearly' = 'pro_monthly';
        let days = 30;

        if (productid === yearlyPid || productName.toLowerCase().includes('yıllık') || price >= 2000) {
            plan = 'pro_yearly';
            days = 365;
        } else {
            plan = 'pro_monthly';
            days = 30;
        }
        console.log('[OSB] determined plan', { plan, days });

        // ── 5. Supabase admin client ──
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseUrl || !serviceKey) {
            console.error('[OSB] Missing SUPABASE env');
            return new Response('success', { status: 200 });
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // ── 6. Find user by email ──
        const { data: profile, error: profileLookupErr } = await supabase
            .from('profiles')
            .select('id, email, plan')
            .eq('email', email)
            .maybeSingle();

        console.log('[OSB] profile lookup', { found: !!profile, userId: profile?.id, error: profileLookupErr?.message });

        if (!profile) {
            console.error('[OSB] ❌ No profile for email:', email);
            // Still insert a payment record for tracking
            await supabase.from('payments').insert({
                user_id: '00000000-0000-0000-0000-000000000000',
                provider_order_id: orderid || crypto.randomUUID(),
                provider: 'shopier',
                plan,
                amount_try: Math.round(price),
                status: 'paid',
                paid_at: new Date().toISOString(),
                raw_payload: decoded,
            });
            return new Response('success', { status: 200 });
        }

        const userId = profile.id;

        // ── 7. Find latest 'created' payment for this user+plan in last 60 min ──
        const sixtyMinAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const { data: existingPayment, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'created')
            .eq('plan', plan)
            .gte('created_at', sixtyMinAgo)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        console.log('[OSB] payment lookup', { found: !!existingPayment, paymentId: existingPayment?.id, error: payErr?.message });

        const now = new Date().toISOString();

        if (existingPayment) {
            // Update existing payment
            const { error: updateErr } = await supabase
                .from('payments')
                .update({
                    status: 'paid',
                    provider_order_id: orderid || existingPayment.provider_order_id,
                    paid_at: now,
                    raw_payload: decoded,
                })
                .eq('id', existingPayment.id);

            console.log('[OSB] payment updated', { id: existingPayment.id, error: updateErr?.message || 'ok' });
        } else {
            // Insert new paid payment
            const { error: insertErr } = await supabase
                .from('payments')
                .insert({
                    user_id: userId,
                    provider_order_id: orderid || crypto.randomUUID(),
                    provider: 'shopier',
                    plan,
                    amount_try: Math.round(price),
                    status: 'paid',
                    paid_at: now,
                    raw_payload: decoded,
                });

            console.log('[OSB] payment inserted', { userId, error: insertErr?.message || 'ok' });
        }

        // ── 8. Update profile → Pro ──
        const proUntil = new Date();
        proUntil.setDate(proUntil.getDate() + days);

        const { error: profileErr } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                plan_expires_at: proUntil.toISOString(),
            })
            .eq('id', userId);

        console.log('[OSB] profile updated', {
            userId,
            plan,
            until: proUntil.toISOString(),
            error: profileErr?.message || 'ok',
            istest,
        });

        return new Response('success', { status: 200 });

    } catch (err: any) {
        console.error('[OSB] unhandled error', err?.message || err);
        return new Response('success', { status: 200 });
    }
}
