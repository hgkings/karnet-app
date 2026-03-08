import { NextResponse } from 'next/server';
import { getPlanAmount, PlanId } from '@/config/pricing';
import { Shopier, Buyer, Address, ProductType, AutoSubmitFormRenderer } from 'shopier';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    return NextResponse.redirect(new URL('/pricing', process.env.NEXT_PUBLIC_APP_URL || 'https://xn--krnet-3qa.com'));
}

export async function POST(req: Request) {
    console.log('[create-order] POST hit');

    try {
        // ── 1. Read env vars with fallbacks & trim ──
        const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '').trim();
        const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '').trim();
        const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

        // Shopier API Key: SHOPIER_API_KEY → fallback SHOPIER_API_TOKEN
        const apiKey = (process.env.SHOPIER_API_KEY || process.env.SHOPIER_API_TOKEN || '').trim();
        // Shopier API Secret: SHOPIER_API_SECRET → fallback SHOPIER_OSB_KEY
        const apiSecret = (process.env.SHOPIER_API_SECRET || process.env.SHOPIER_API_TOKEN_SECRET || process.env.SHOPIER_OSB_KEY || '').trim();

        const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://xn--krnet-3qa.com').trim();

        // ── 2. Env visibility map (never expose values) ──
        const envSeen = {
            SHOPIER_API_KEY: !!process.env.SHOPIER_API_KEY,
            SHOPIER_API_SECRET: !!process.env.SHOPIER_API_SECRET,
            SHOPIER_API_TOKEN: !!process.env.SHOPIER_API_TOKEN,
            SHOPIER_API_TOKEN_SECRET: !!process.env.SHOPIER_API_TOKEN_SECRET,
            SHOPIER_OSB_KEY: !!process.env.SHOPIER_OSB_KEY,
            SHOPIER_OSB_USERNAME: !!process.env.SHOPIER_OSB_USERNAME,
            SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
            NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            NEXT_PUBLIC_SITE_URL: !!process.env.NEXT_PUBLIC_SITE_URL,
            NEXT_PUBLIC_APP_URL: !!process.env.NEXT_PUBLIC_APP_URL,
        };

        console.log('[create-order] env_seen:', JSON.stringify(envSeen));

        // ── 3. Check required resolved values ──
        const requiredResolved: Record<string, string> = {
            'SUPABASE_URL': supabaseUrl,
            'SUPABASE_ANON_KEY': supabaseAnonKey,
            'SUPABASE_SERVICE_ROLE_KEY': serviceKey,
            'SHOPIER_API_KEY (veya SHOPIER_API_TOKEN)': apiKey,
            'SHOPIER_API_SECRET (veya SHOPIER_OSB_KEY)': apiSecret,
        };

        const missingKeys = Object.entries(requiredResolved)
            .filter(([_, value]) => !value)
            .map(([key]) => key);

        if (missingKeys.length > 0) {
            console.error('[create-order] Missing resolved keys:', missingKeys);
            return NextResponse.json({
                ok: false,
                error: 'Ödeme yapılandırması eksik.',
                error_code: 'server_config_missing',
                missing_keys: missingKeys,
                env_seen: envSeen,
                vercel_env: process.env.VERCEL_ENV ?? null,
            }, { status: 500 });
        }

        // ── 4. Auth ──
        const { createServerClient } = await import('@supabase/ssr');
        const { cookies } = await import('next/headers');
        const cookieStore = cookies();
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() { return cookieStore.getAll(); },
                setAll(cookiesToSet) {
                    try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { }
                },
            },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Giriş yapmanız gerekiyor.' }, { status: 401 });
        }

        // ── 5. Parse body ──
        const body = await req.json();
        const plan = body.plan as PlanId;
        if (plan !== 'pro_monthly' && plan !== 'pro_yearly') {
            return NextResponse.json({ error: 'Geçersiz plan.' }, { status: 400 });
        }

        const amount = getPlanAmount(plan);

        // ── 6. Insert payment with service role ──
        const admin = createServerClient(supabaseUrl, serviceKey, {
            cookies: { getAll: () => [], setAll: () => { } },
        });

        const { data: payment, error: insertErr } = await admin
            .from('payments')
            .insert({
                user_id: user.id,
                plan,
                amount_try: amount,
                status: 'pending',
                provider: 'shopier',
                provider_order_id: crypto.randomUUID(),
            })
            .select('id')
            .single();

        if (insertErr || !payment) {
            console.error('[create-order] insert error:', insertErr?.message);
            return NextResponse.json({ error: 'Sipariş oluşturulamadı.' }, { status: 500 });
        }

        const paymentId = payment.id;
        console.log('[create-order] db payment created:', paymentId);

        // ── 7. Shopier API Initialization ──
        const shopier = new Shopier(apiKey, apiSecret);

        // Setup buyer details
        const email = user.email || 'bilgi@karnet.com';
        const phone = user.user_metadata?.phone || '05555555555';
        const name = user.user_metadata?.first_name || 'Karnet';
        const surname = user.user_metadata?.last_name || 'Kullanıcısı';

        const buyer = new Buyer({
            id: user.id.substring(0, 10),
            name: name,
            surname: surname,
            email: email,
            phone: phone,
        });

        const address = new Address({
            address: 'Bilinmeyen Adres',
            city: 'İstanbul',
            country: 'Türkiye',
            postcode: '34000',
        });

        const params = shopier.getParams();
        params.setBuyer(buyer);
        params.setAddress(address);

        // Base domain (to create return url)
        const returnUrl = `${siteUrl}/api/shopier/callback?paymentId=${paymentId}`;

        params.setOrderData(paymentId, amount.toString(), returnUrl);
        params.setProductData(
            plan === 'pro_monthly' ? 'Kârnet Pro Aylık' : 'Kârnet Pro Yıllık',
            ProductType.DEFAULT_TYPE
        );

        // Generate HTML with Shopier AutoSubmit Form
        const renderer = new AutoSubmitFormRenderer(shopier);
        const formHtml = shopier.goWith(renderer);

        return NextResponse.json({ formHtml, paymentId });

    } catch (error: any) {
        console.error('[create-order] error:', error?.message);
        return NextResponse.json({ error: 'Bir hata oluştu.' }, { status: 500 });
    }
}
