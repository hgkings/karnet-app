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
    console.log('[OSB] POST hit');

    try {
        // ── 1. Parse body ──
        const ct = req.headers.get('content-type') || '';
        console.log('[OSB] content-type', ct);

        let resField = '';
        let hashField = '';

        if (ct.includes('multipart/form-data')) {
            const fd = await req.formData();
            resField = fd.get('res')?.toString() ?? fd.get('RES')?.toString() ?? '';
            hashField = fd.get('hash')?.toString() ?? fd.get('HASH')?.toString() ?? '';
            console.log('[OSB] formData keys:', Array.from(fd.keys()));
        } else {
            const raw = await req.text();
            console.log('[OSB] raw len', raw.length);
            const params = new URLSearchParams(raw);
            console.log('[OSB] urlencoded keys:', Array.from(params.keys()));
            resField = params.get('res') || params.get('RES') || '';
            hashField = params.get('hash') || params.get('HASH') || '';
        }

        console.log('[OSB] parsed', { hasRes: !!resField, hasHash: !!hashField });

        if (!resField || !hashField) {
            console.error('[OSB] Missing res or hash');
            return new Response('success', { status: 200 });
        }

        // ── 2. Verify signature ──
        const osbUsername = process.env.SHOPIER_OSB_USERNAME || '';
        const osbKey = process.env.SHOPIER_OSB_KEY || '';
        const expected = crypto
            .createHmac('sha256', osbKey)
            .update(resField + osbUsername)
            .digest('hex');
        console.log('[OSB] hash ok:', expected === hashField);

        // ── 3. Decode ──
        const decoded = JSON.parse(Buffer.from(resField, 'base64').toString('utf-8'));
        const orderid = String(decoded.platform_order_id || decoded.orderid || '');
        console.log('[OSB] orderid:', orderid, 'email:', decoded.email, 'price:', decoded.price);

        // ── 4. Supabase ──
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        if (!supabaseUrl || !serviceKey) {
            console.error('[OSB] Missing Supabase env');
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

        console.log('[OSB] payment lookup', {
            orderid,
            found: !!payment,
            id: payment?.id,
            user_id: payment?.user_id,
            plan: payment?.plan,
            status: payment?.status,
            error: payErr?.message,
        });

        if (!payment) {
            console.error('[OSB] ❌ No payment for orderid:', orderid);
            return new Response('success', { status: 200 });
        }

        // Idempotency
        if (payment.status === 'paid') {
            console.log('[OSB] Already paid, skip', payment.id);
            return new Response('success', { status: 200 });
        }

        // ── 6. Update payment → paid ──
        const now = new Date().toISOString();
        const { error: updErr } = await supabase
            .from('payments')
            .update({
                status: 'paid',
                paid_at: now,
                raw_payload: decoded,
            })
            .eq('id', payment.id);

        console.log('[OSB] payment updated', { id: payment.id, error: updErr?.message || 'ok' });

        // ── 7. Update profile → Pro ──
        const days = payment.plan === 'pro_yearly' ? 365 : 30;
        const proUntil = new Date();
        proUntil.setDate(proUntil.getDate() + days);

        const { error: profErr } = await supabase
            .from('profiles')
            .update({
                plan: 'pro',
                plan_expires_at: proUntil.toISOString(),
            })
            .eq('id', payment.user_id);

        console.log('[OSB] profile updated', {
            user_id: payment.user_id,
            plan: 'pro',
            until: proUntil.toISOString(),
            days,
            error: profErr?.message || 'ok',
        });

        return new Response('success', { status: 200 });

    } catch (err: any) {
        console.error('[OSB] error', err?.message || err);
        return new Response('success', { status: 200 });
    }
}
