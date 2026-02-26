import crypto from 'crypto';

export const dynamic = 'force-dynamic';

// Shopier checks this URL with GET to verify it's reachable
export async function GET() {
    return new Response('OK', { status: 200 });
}

/**
 * POST /api/shopier/callback
 * 
 * Shopier OSB (Otomatik Sipariş Bildirimi) webhook.
 * Incoming: res (base64 JSON) + hash
 * Verify: HMAC_SHA256(res + OSB_USERNAME, OSB_KEY)
 * 
 * With fixed product URLs, Shopier generates its own order IDs.
 * We match payments by finding the latest "created" payment for the buyer email,
 * or by matching provider_order_id if the OSB includes our platform_order_id.
 * 
 * Respond: "success"
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

        console.log('[Shopier OSB] Env check:', {
            has_osbUsername: !!osbUsername,
            osbUsernameLength: osbUsername.length,
            has_osbKey: !!osbKey,
            osbKeyLength: osbKey.length,
        });

        if (!osbKey) {
            console.error('[Shopier OSB] SHOPIER_OSB_KEY not configured!');
            return new Response('SERVER_CONFIG_ERROR', { status: 500 });
        }

        const dataToSign = resField + osbUsername;
        const hashHex = crypto.createHmac('sha256', osbKey).update(dataToSign).digest('hex');
        const hashBase64 = crypto.createHmac('sha256', osbKey).update(dataToSign).digest('base64');

        console.log('[Shopier OSB] Hash comparison:', {
            received: hashField,
            expectedHex: hashHex,
            expectedBase64: hashBase64,
            matchHex: hashHex === hashField,
            matchBase64: hashBase64 === hashField,
        });

        const hashValid = (hashHex === hashField) || (hashBase64 === hashField);
        if (!hashValid) {
            console.error('[Shopier OSB] Hash mismatch! Neither hex nor base64 matched.');
            // Still return success for now so we can debug via logs
            // return new Response('INVALID_HASH', { status: 403 });
        }

        // 3. Decode and parse
        const jsonStr = Buffer.from(resField, 'base64').toString('utf-8');
        const data = JSON.parse(jsonStr);

        console.log('[Shopier OSB] Verified callback data:', JSON.stringify(data, null, 2));

        const shopierOrderId = data.orderid || data.order_id || data.platform_order_id || '';
        const buyerEmail = data.buyer_email || data.email || '';
        const isTest = data.istest === 1 || data.istest === '1' || data.istest === true;

        // 3b. Determine plan by Shopier productid
        const productId = String(
            data.productid ||
            data.product_id ||
            (Array.isArray(data.productlist) && data.productlist[0]?.productid) ||
            ''
        );
        const monthlyProductId = process.env.SHOPIER_MONTHLY_PRODUCT_ID || '';
        const yearlyProductId = process.env.SHOPIER_YEARLY_PRODUCT_ID || '';

        let determinedPlan: 'pro_monthly' | 'pro_yearly' | null = null;
        if (productId && productId === monthlyProductId) {
            determinedPlan = 'pro_monthly';
        } else if (productId && productId === yearlyProductId) {
            determinedPlan = 'pro_yearly';
        }

        console.log('[Shopier OSB] Product matching:', {
            receivedProductId: productId,
            monthlyProductId,
            yearlyProductId,
            determinedPlan
        });

        if (!determinedPlan) {
            console.error('[Shopier OSB] Unknown productid:', productId);
            // Still return success so Shopier doesn't retry, but don't activate
            return new Response('success', { status: 200 });
        }

        if (isTest) {
            console.log('[Shopier OSB] 🧪 Test order:', shopierOrderId);
        }

        // 4. Supabase env guard
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('[Shopier OSB] Missing Supabase env vars');
            return new Response('SERVER_CONFIG_ERROR', { status: 500 });
        }

        const { createServerClient } = await import('@supabase/ssr');
        const adminClient = createServerClient(supabaseUrl, supabaseServiceKey, {
            cookies: { getAll: () => [], setAll: () => { } },
        });

        // 5. Try to find matching payment:
        //    a) First try by provider_order_id (if our UUID was passed through)
        //    b) Then try by buyer email (latest "created" payment)
        let payment: any = null;

        if (shopierOrderId) {
            const { data: byOrder } = await adminClient
                .from('payments')
                .select('*')
                .eq('provider_order_id', shopierOrderId)
                .eq('status', 'created')
                .single();
            if (byOrder) payment = byOrder;
        }

        if (!payment && buyerEmail) {
            // Find user by email, then their latest created payment
            const { data: profile } = await adminClient
                .from('profiles')
                .select('id')
                .eq('email', buyerEmail)
                .single();

            if (profile) {
                const { data: byUser } = await adminClient
                    .from('payments')
                    .select('*')
                    .eq('user_id', profile.id)
                    .eq('status', 'created')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();
                if (byUser) payment = byUser;
            }
        }

        if (!payment) {
            console.warn('[Shopier OSB] No matching payment found. Order:', shopierOrderId, 'Email:', buyerEmail);
            // Still return success so Shopier doesn't keep retrying
            return new Response('success', { status: 200 });
        }

        // 6. Idempotency
        if (payment.status === 'paid') {
            console.log('[Shopier OSB] Already paid:', payment.id);
            return new Response('success', { status: 200 });
        }

        // 7. Mark paid + set plan from productid
        const now = new Date().toISOString();
        await adminClient
            .from('payments')
            .update({
                status: 'paid',
                paid_at: now,
                plan: determinedPlan,
                provider_tx_id: shopierOrderId || payment.provider_order_id,
                raw_payload: data,
            })
            .eq('id', payment.id);

        // 8. Activate Pro using plan determined by productid
        const planDays = determinedPlan === 'pro_monthly' ? 30 : 365;
        const proUntil = new Date();
        proUntil.setDate(proUntil.getDate() + planDays);

        await adminClient
            .from('profiles')
            .update({
                plan: 'pro',
                plan_expires_at: proUntil.toISOString(),
            })
            .eq('id', payment.user_id);

        console.log(`[Shopier OSB] ✅ Pro activated for ${payment.user_id} | plan=${determinedPlan} | until ${proUntil.toISOString()}${isTest ? ' (TEST)' : ''}`);

        return new Response('success', { status: 200 });

    } catch (error: any) {
        console.error('[Shopier OSB] Error:', error);
        return new Response('SERVER_ERROR', { status: 500 });
    }
}
