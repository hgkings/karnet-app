import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-server-client';
import { getPlanDays } from '@/config/pricing';
import crypto from 'crypto';

/**
 * POST /api/shopier/callback
 * 
 * Shopier OSB (Otomatik Sipariş Bildirimi) webhook.
 * 
 * Incoming POST fields:
 *   - res: base64 encoded JSON with order data
 *   - hash: HMAC-SHA256 signature for verification
 * 
 * Verification:
 *   expected_hash = HMAC_SHA256(res + OSB_USERNAME, OSB_KEY)
 *   Compare with POST.hash — reject if mismatch.
 * 
 * Must respond with plain text: "success"
 */
export async function POST(req: Request) {
    try {
        // 1. Parse form data
        const contentType = req.headers.get('content-type') || '';
        let resField = '';
        let hashField = '';

        if (contentType.includes('application/x-www-form-urlencoded')) {
            const formData = await req.formData();
            resField = (formData.get('res') || '').toString();
            hashField = (formData.get('hash') || '').toString();
        } else {
            // Fallback: try parsing as URL-encoded text
            const text = await req.text();
            const params = new URLSearchParams(text);
            resField = params.get('res') || '';
            hashField = params.get('hash') || '';
        }

        if (!resField || !hashField) {
            console.error('[Shopier OSB] Missing res or hash fields');
            return new Response('MISSING_FIELDS', { status: 400 });
        }

        // 2. Verify HMAC signature
        const osbUsername = process.env.SHOPIER_OSB_USERNAME || '';
        const osbKey = process.env.SHOPIER_OSB_KEY || process.env.SHOPIER_OSB_PASSWORD || '';

        if (!osbKey) {
            console.error('[Shopier OSB] SHOPIER_OSB_KEY not configured!');
            return new Response('SERVER_CONFIG_ERROR', { status: 500 });
        }

        const dataToSign = resField + osbUsername;
        const expectedHash = crypto
            .createHmac('sha256', osbKey)
            .update(dataToSign)
            .digest('hex');

        if (expectedHash !== hashField) {
            console.error('[Shopier OSB] Hash mismatch!', {
                expected: expectedHash,
                received: hashField,
            });
            return new Response('INVALID_HASH', { status: 403 });
        }

        // 3. Decode and parse the order data
        const jsonStr = Buffer.from(resField, 'base64').toString('utf-8');
        const data = JSON.parse(jsonStr);

        console.log('[Shopier OSB] Verified callback data:', JSON.stringify(data, null, 2));

        const orderId = data.orderid || data.order_id || '';
        const isTest = data.istest === 1 || data.istest === '1' || data.istest === true;

        if (!orderId) {
            console.error('[Shopier OSB] Missing orderid in decoded data');
            return new Response('MISSING_ORDER_ID', { status: 400 });
        }

        // 4. Handle test orders gracefully
        if (isTest) {
            console.log('[Shopier OSB] 🧪 Test order received:', orderId);
            // Still process it — but log that it's a test
        }

        // 5. Fetch existing payment record
        const { data: payment, error: fetchError } = await supabaseAdmin
            .from('payments')
            .select('*')
            .eq('provider_order_id', orderId)
            .single();

        if (fetchError || !payment) {
            console.error('[Shopier OSB] Payment not found for orderId:', orderId, fetchError);
            // Still return success to prevent Shopier from retrying with unknown orders
            return new Response('success', { status: 200 });
        }

        // 6. Idempotency: if already paid, just return success
        if (payment.status === 'paid') {
            console.log('[Shopier OSB] Already paid, skipping:', orderId);
            return new Response('success', { status: 200 });
        }

        // 7. Update payment record → paid
        const now = new Date().toISOString();
        await supabaseAdmin
            .from('payments')
            .update({
                status: 'paid',
                paid_at: now,
                provider_tx_id: data.id || data.transaction_id || orderId,
                raw_payload: data,
            })
            .eq('id', payment.id);

        // 8. Activate Pro for the user
        const planDays = getPlanDays(payment.plan);
        const proUntil = new Date();
        proUntil.setDate(proUntil.getDate() + planDays);

        await supabaseAdmin
            .from('profiles')
            .update({
                plan: 'pro',
                plan_expires_at: proUntil.toISOString(),
            })
            .eq('id', payment.user_id);

        console.log(`[Shopier OSB] ✅ Pro activated for user ${payment.user_id} until ${proUntil.toISOString()}${isTest ? ' (TEST)' : ''}`);

        // 9. Respond with "success" (required by Shopier)
        return new Response('success', { status: 200 });

    } catch (error: any) {
        console.error('[Shopier OSB] Unhandled error:', error);
        return new Response('SERVER_ERROR', { status: 500 });
    }
}
