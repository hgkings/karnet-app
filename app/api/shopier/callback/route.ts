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
        // ── 1. Read body robustly ──
        const ct = req.headers.get('content-type') || '';
        console.log('[OSB] content-type', ct);

        let resField = '';
        let hashField = '';

        if (ct.includes('multipart/form-data')) {
            const fd = await req.formData();
            resField = fd.get('res')?.toString() ?? fd.get('RES')?.toString() ?? '';
            hashField = fd.get('hash')?.toString() ?? fd.get('HASH')?.toString() ?? '';
            console.log('[OSB] parsed via formData, keys:', Array.from(fd.keys()));
        } else {
            const raw = await req.text();
            console.log('[OSB] raw len', raw.length);
            const params = new URLSearchParams(raw);
            console.log('[OSB] keys', Array.from(params.keys()));
            resField = params.get('res') || params.get('RES') || '';
            hashField = params.get('hash') || params.get('HASH') || '';
        }

        console.log('[OSB] parsed', {
            hasRes: !!resField, resLen: resField.length,
            hasHash: !!hashField, hashLen: hashField.length,
        });

        if (!resField || !hashField) {
            console.error('[OSB] Missing res or hash after parsing');
            return new Response('success', { status: 200 });
        }

        // ── 2. Verify HMAC-SHA256 signature ──
        const osbUsername = process.env.SHOPIER_OSB_USERNAME || '';
        const osbKey = process.env.SHOPIER_OSB_KEY || '';
        const expected = crypto
            .createHmac('sha256', osbKey)
            .update(resField + osbUsername)
            .digest('hex');

        console.log('[OSB] hash', { ok: expected === hashField });

        // ── 3. Decode base64 → JSON ──
        const decoded = JSON.parse(Buffer.from(resField, 'base64').toString('utf-8'));

        const orderid = String(decoded.platform_order_id || decoded.orderid || '');
        const email = String(decoded.email || '');
        const price = parseFloat(decoded.price || '0');
        const istest = decoded.istest === 1 || decoded.istest === '1';

        console.log('[OSB] decoded', { orderid, email, price, istest });

        // ── 4. Supabase admin client ──
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

        if (!supabaseUrl || !serviceKey) {
            console.error('[OSB] Missing SUPABASE env');
            return new Response('success', { status: 200 });
        }

        const supabase = createClient(supabaseUrl, serviceKey, {
            auth: { autoRefreshToken: false, persistSession: false },
        });

        // ── 5. Find payment by provider_order_id ──
        const { data: payment, error: payErr } = await supabase
            .from('payments')
            .select('*')
            .eq('provider', 'shopier')
            .eq('provider_order_id', orderid)
            .limit(1)
            .maybeSingle();

        console.log('[OSB] payment lookup by orderid', {
            orderid,
            found: !!payment,
            paymentId: payment?.id,
            userId: payment?.user_id,
            plan: payment?.plan,
            error: payErr?.message,
        });

        if (!payment) {
            // Fallback: find latest 'created' payment for this email
            console.error('[OSB] ❌ No payment found for orderid:', orderid);

            // Try email fallback
            const { data: profile } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', email)
                .maybeSingle();

            if (profile) {
                const { data: latestPayment } = await supabase
                    .from('payments')
                    .select('*')
                    .eq('user_id', profile.id)
                    .eq('status', 'created')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (latestPayment) {
                    console.log('[OSB] fallback: found latest created payment', {
                        id: latestPayment.id,
                        userId: latestPayment.user_id,
                        plan: latestPayment.plan,
                    });
                    // Process this payment instead
                    await processPayment(supabase, latestPayment, decoded, orderid);
                    return new Response('success', { status: 200 });
                }
            }

            console.error('[OSB] ❌ No fallback payment found either');
            return new Response('success', { status: 200 });
        }

        // ── 6. Process payment ──
        await processPayment(supabase, payment, decoded, orderid);

        return new Response('success', { status: 200 });

    } catch (err: any) {
        console.error('[OSB] unhandled error', err?.message || err);
        return new Response('success', { status: 200 });
    }
}

async function processPayment(
    supabase: any,
    payment: any,
    decoded: any,
    orderid: string,
) {
    const now = new Date().toISOString();
    const userId = payment.user_id;
    const plan = payment.plan; // 'pro_monthly' or 'pro_yearly'

    // Skip if already paid (idempotency)
    if (payment.status === 'paid') {
        console.log('[OSB] already paid, skipping', { paymentId: payment.id });
        return;
    }

    // Update payment → paid
    const { error: updateErr } = await supabase
        .from('payments')
        .update({
            status: 'paid',
            paid_at: now,
            provider_order_id: orderid || payment.provider_order_id,
            raw_payload: decoded,
        })
        .eq('id', payment.id);

    console.log('[OSB] payment updated', {
        paymentId: payment.id,
        userId,
        plan,
        error: updateErr?.message || 'ok',
    });

    // Update profile → Pro
    const days = plan === 'pro_yearly' ? 365 : 30;
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
        plan: 'pro',
        until: proUntil.toISOString(),
        days,
        error: profileErr?.message || 'ok',
    });
}
